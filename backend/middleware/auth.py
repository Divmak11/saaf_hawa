from fastapi import HTTPException, Security, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Dict, Optional

security = HTTPBearer()

class AdminAuthManager:
    def __init__(self):
        self.active_tokens: Dict[str, datetime] = {}
        self.token_expiry_hours = 24
        
        # Get admin credentials from environment
        self.admin_username = os.getenv('ADMIN_USERNAME', 'admin')
        self.admin_password_hash = self._hash_password(os.getenv('ADMIN_PASSWORD', 'changeme123'))
    
    def _hash_password(self, password: str) -> str:
        """Hash password using SHA-256"""
        return hashlib.sha256(password.encode()).hexdigest()
    
    def verify_credentials(self, username: str, password: str) -> bool:
        """Verify admin credentials"""
        if username != self.admin_username:
            return False
        
        password_hash = self._hash_password(password)
        return password_hash == self.admin_password_hash
    
    def generate_token(self) -> str:
        """Generate a new authentication token"""
        token = secrets.token_urlsafe(32)
        expiry = datetime.now() + timedelta(hours=self.token_expiry_hours)
        self.active_tokens[token] = expiry
        return token
    
    def verify_token(self, token: str) -> bool:
        """Verify if token is valid and not expired"""
        if token not in self.active_tokens:
            return False
        
        expiry = self.active_tokens[token]
        if datetime.now() > expiry:
            del self.active_tokens[token]
            return False
        
        return True
    
    def revoke_token(self, token: str):
        """Revoke a token"""
        if token in self.active_tokens:
            del self.active_tokens[token]
    
    def cleanup_expired_tokens(self):
        """Remove expired tokens"""
        now = datetime.now()
        expired = [token for token, expiry in self.active_tokens.items() if now > expiry]
        for token in expired:
            del self.active_tokens[token]

# Global auth manager
auth_manager = AdminAuthManager()

async def verify_admin_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """Dependency to verify admin authentication"""
    token = credentials.credentials
    
    if not auth_manager.verify_token(token):
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return token
