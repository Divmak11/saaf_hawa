from fastapi import APIRouter, HTTPException, Depends, Response
from typing import List, Optional
from datetime import datetime, timedelta
import csv
from io import StringIO

from models.admin import AdminLogin, SignatureFilter
from models.signature import Signature
from middleware.auth import auth_manager, verify_admin_token
from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter(prefix="/admin", tags=["admin"])

# MongoDB connection
MONGO_URL = os.getenv('MONGO_URL')
DB_NAME = os.getenv('DB_NAME', 'test_database')
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

@router.post("/login")
async def admin_login(credentials: AdminLogin):
    """Admin login endpoint"""
    if not auth_manager.verify_credentials(credentials.username, credentials.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = auth_manager.generate_token()
    return {
        "token": token,
        "expires_in": 86400  # 24 hours in seconds
    }

@router.post("/logout")
async def admin_logout(token: str = Depends(verify_admin_token)):
    """Admin logout endpoint"""
    auth_manager.revoke_token(token)
    return {"message": "Logged out successfully"}

@router.get("/signatures")
async def get_all_signatures(
    page: int = 1,
    limit: int = 50,
    search: Optional[str] = None,
    date_from: Optional[str] = None,
    date_to: Optional[str] = None,
    token: str = Depends(verify_admin_token)
):
    """Get all signatures with pagination and filtering"""
    try:
        # Build query
        query = {}
        
        # Search filter
        if search:
            query['$or'] = [
                {'name': {'$regex': search, '$options': 'i'}},
                {'phone': {'$regex': search, '$options': 'i'}}
            ]
        
        # Date range filter
        if date_from or date_to:
            query['timestamp'] = {}
            if date_from:
                query['timestamp']['$gte'] = datetime.fromisoformat(date_from)
            if date_to:
                query['timestamp']['$lte'] = datetime.fromisoformat(date_to)
        
        # Get total count
        total = await db.signatures.count_documents(query)
        
        # Get paginated results
        skip = (page - 1) * limit
        signatures = await db.signatures.find(
            query,
            {'_id': 0}
        ).sort('timestamp', -1).skip(skip).limit(limit).to_list(limit)
        
        return {
            'signatures': signatures,
            'total': total,
            'page': page,
            'limit': limit,
            'total_pages': (total + limit - 1) // limit
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching signatures: {str(e)}")

@router.get("/stats")
async def get_admin_stats(token: str = Depends(verify_admin_token)):
    """Get detailed statistics for admin"""
    try:
        # Total signatures
        total = await db.signatures.count_documents({})
        
        # Signatures today
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_count = await db.signatures.count_documents({
            'timestamp': {'$gte': today_start}
        })
        
        # Signatures this week
        week_start = today_start - timedelta(days=today_start.weekday())
        week_count = await db.signatures.count_documents({
            'timestamp': {'$gte': week_start}
        })
        
        # Signatures this month
        month_start = today_start.replace(day=1)
        month_count = await db.signatures.count_documents({
            'timestamp': {'$gte': month_start}
        })
        
        # Daily signatures for last 30 days
        thirty_days_ago = today_start - timedelta(days=30)
        pipeline = [
            {'$match': {'timestamp': {'$gte': thirty_days_ago}}},
            {
                '$group': {
                    '_id': {
                        '$dateToString': {
                            'format': '%Y-%m-%d',
                            'date': '$timestamp'
                        }
                    },
                    'count': {'$sum': 1}
                }
            },
            {'$sort': {'_id': 1}}
        ]
        daily_stats = await db.signatures.aggregate(pipeline).to_list(None)
        
        return {
            'total_signatures': total,
            'today': today_count,
            'this_week': week_count,
            'this_month': month_count,
            'daily_trend': daily_stats
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching statistics: {str(e)}")

@router.delete("/signature/{signature_id}")
async def delete_signature(signature_id: str, token: str = Depends(verify_admin_token)):
    """Delete a signature (for spam/test entries)"""
    try:
        result = await db.signatures.delete_one({'id': signature_id})
        
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Signature not found")
        
        return {"message": "Signature deleted successfully"}
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting signature: {str(e)}")

@router.get("/export-csv")
async def export_signatures_csv(token: str = Depends(verify_admin_token)):
    """Export all signatures to CSV"""
    try:
        signatures = await db.signatures.find({}, {'_id': 0}).sort('timestamp', -1).to_list(None)
        
        # Create CSV
        output = StringIO()
        writer = csv.DictWriter(output, fieldnames=['signature_number', 'name', 'phone', 'email', 'timestamp'])
        writer.writeheader()
        
        for sig in signatures:
            writer.writerow({
                'signature_number': sig.get('signature_number', ''),
                'name': sig.get('name', ''),
                'phone': sig.get('phone', ''),
                'email': sig.get('email', ''),
                'timestamp': sig.get('timestamp', '').isoformat() if sig.get('timestamp') else ''
            })
        
        csv_content = output.getvalue()
        output.close()
        
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={
                "Content-Disposition": f"attachment; filename=petition_signatures_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
            }
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error exporting CSV: {str(e)}")
