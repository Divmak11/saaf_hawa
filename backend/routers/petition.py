from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from models.signature import SignatureCreate, Signature, PetitionStats
from services.signature_service import SignatureService
from services.pdf_service import PDFService
from services.image_service import ImageService
from motor.motor_asyncio import AsyncIOMotorDatabase
from middleware.rate_limiter import petition_rate_limiter, api_rate_limiter
from middleware.security import SecurityValidator
import os

router = APIRouter(prefix="/petition", tags=["petition"])

# This will be initialized in server.py
signature_service: SignatureService = None

def init_petition_router(db: AsyncIOMotorDatabase):
    global signature_service
    signature_service = SignatureService(db)

@router.get("/stats", response_model=PetitionStats)
async def get_petition_stats(request: Request):
    """Get petition statistics"""
    # Apply rate limiting
    client_ip = request.client.host
    if not await api_rate_limiter.check_rate_limit(client_ip):
        raise HTTPException(status_code=429, detail="Too many requests. Please try again later.")
    
    return await signature_service.get_petition_stats()

@router.post("/sign", response_model=Signature)
async def sign_petition(signature_data: SignatureCreate, request: Request):
    """Submit a new petition signature with rate limiting and validation"""
    # Get client IP
    client_ip = request.client.host
    
    # Apply strict rate limiting for petition submissions
    if not await petition_rate_limiter.check_rate_limit(client_ip):
        raise HTTPException(
            status_code=429, 
            detail="Too many submission attempts. Please wait 5 minutes before trying again."
        )
    
    # Validate and sanitize inputs
    is_valid, error = SecurityValidator.validate_name(signature_data.name)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error)
    
    is_valid, error = SecurityValidator.validate_phone(signature_data.phone)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error)
    
    if signature_data.email:
        is_valid, error = SecurityValidator.validate_email(signature_data.email)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error)
    
    # Sanitize inputs
    signature_data.name = SecurityValidator.sanitize_string(signature_data.name, 100)
    signature_data.phone = SecurityValidator.sanitize_string(signature_data.phone, 20)
    if signature_data.email:
        signature_data.email = SecurityValidator.sanitize_string(signature_data.email, 100)
    
    try:
        signature = await signature_service.create_signature(signature_data)
        return signature
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create signature: {str(e)}")

@router.get("/signature/{signature_id}", response_model=Signature)
async def get_signature(signature_id: str):
    """Get a specific signature by ID"""
    signature = await signature_service.get_signature(signature_id)
    if not signature:
        raise HTTPException(status_code=404, detail="Signature not found")
    return signature

@router.get("/download-pdf/{signature_id}")
async def download_pdf(signature_id: str):
    """Generate and download PDF of signed petition"""
    signature = await signature_service.get_signature(signature_id)
    if not signature:
        raise HTTPException(status_code=404, detail="Signature not found")
    
    try:
        pdf_buffer = PDFService.generate_petition_pdf(signature)
        
        return StreamingResponse(
            pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=petition_{signature_id}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate PDF: {str(e)}")

@router.get("/download-image/{signature_id}")
async def download_image(signature_id: str):
    """Generate and download image of signed petition"""
    signature = await signature_service.get_signature(signature_id)
    if not signature:
        raise HTTPException(status_code=404, detail="Signature not found")
    
    try:
        image_buffer = ImageService.generate_petition_image(signature)
        
        return StreamingResponse(
            image_buffer,
            media_type="image/png",
            headers={
                "Content-Disposition": f"attachment; filename=petition_{signature_id}.png"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate image: {str(e)}")
