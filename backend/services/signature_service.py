from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorDatabase
from models.signature import Signature, SignatureCreate, PetitionStats
import os

class SignatureService:
    def __init__(self, db: AsyncIOMotorDatabase):
        self.db = db
        self.signatures_collection = db.signatures
        self.counters_collection = db.counters
    
    async def initialize_counter(self):
        """Initialize signature counter if not exists"""
        counter = await self.counters_collection.find_one({"_id": "signature_counter"})
        if not counter:
            await self.counters_collection.insert_one({
                "_id": "signature_counter",
                "count": 12847  # Starting from mock value
            })
    
    async def get_next_signature_number(self) -> int:
        """Get and increment signature counter"""
        result = await self.counters_collection.find_one_and_update(
            {"_id": "signature_counter"},
            {"$inc": {"count": 1}},
            return_document=True
        )
        return result["count"]
    
    async def create_signature(self, signature_data: SignatureCreate) -> Signature:
        """Create a new signature"""
        signature_number = await self.get_next_signature_number()
        
        signature = Signature(
            name=signature_data.name,
            email=signature_data.email,
            phone=signature_data.phone,
            signature_number=signature_number,
            timestamp=datetime.utcnow()
        )
        
        # Convert to dict and insert
        signature_dict = signature.dict()
        signature_dict['_id'] = signature_dict['id']
        
        await self.signatures_collection.insert_one(signature_dict)
        
        return signature
    
    async def get_signature(self, signature_id: str) -> Signature:
        """Get a signature by ID"""
        signature_doc = await self.signatures_collection.find_one({"_id": signature_id})
        if not signature_doc:
            return None
        
        signature_doc['id'] = signature_doc['_id']
        return Signature(**signature_doc)
    
    async def get_petition_stats(self) -> PetitionStats:
        """Get petition statistics"""
        # Get total count
        counter = await self.counters_collection.find_one({"_id": "signature_counter"})
        total = counter["count"] if counter else 0
        
        # Get recent 5 signatures
        recent_docs = await self.signatures_collection.find().sort("timestamp", -1).limit(5).to_list(5)
        
        recent_signatures = []
        for doc in recent_docs:
            time_diff = datetime.utcnow() - doc['timestamp']
            
            if time_diff.total_seconds() < 60:
                time_ago = f"{int(time_diff.total_seconds())} seconds ago"
            elif time_diff.total_seconds() < 3600:
                time_ago = f"{int(time_diff.total_seconds() / 60)} minutes ago"
            elif time_diff.total_seconds() < 86400:
                time_ago = f"{int(time_diff.total_seconds() / 3600)} hours ago"
            else:
                time_ago = f"{int(time_diff.total_seconds() / 86400)} days ago"
            
            recent_signatures.append({
                "name": doc['name'],
                "timestamp": time_ago
            })
        
        return PetitionStats(
            total_signatures=total,
            recent_signatures=recent_signatures
        )
