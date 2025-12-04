import re
import html
from typing import Optional

class SecurityValidator:
    @staticmethod
    def sanitize_string(value: str, max_length: int = 200) -> str:
        """Sanitize string input to prevent XSS and injection attacks"""
        if not value:
            return ""
        
        # Trim and limit length
        value = value.strip()[:max_length]
        
        # HTML escape to prevent XSS
        value = html.escape(value)
        
        return value
    
    @staticmethod
    def validate_name(name: str) -> tuple[bool, Optional[str]]:
        """Validate name input"""
        if not name or len(name.strip()) < 2:
            return False, "Name must be at least 2 characters long"
        
        if len(name) > 100:
            return False, "Name must be less than 100 characters"
        
        # Allow letters, spaces, dots, hyphens, and apostrophes
        if not re.match(r"^[a-zA-Z\s.'-]+$", name):
            return False, "Name contains invalid characters"
        
        return True, None
    
    @staticmethod
    def validate_phone(phone: str) -> tuple[bool, Optional[str]]:
        """Validate phone number"""
        if not phone:
            return False, "Phone number is required"
        
        # Remove common separators
        cleaned_phone = re.sub(r'[\s\-\(\)]', '', phone)
        
        # Check if it contains only digits and + (for country code)
        if not re.match(r'^\+?[0-9]{10,15}$', cleaned_phone):
            return False, "Invalid phone number format"
        
        return True, None
    
    @staticmethod
    def validate_email(email: str) -> tuple[bool, Optional[str]]:
        """Validate email format"""
        if not email:
            return True, None  # Email is optional
        
        if len(email) > 100:
            return False, "Email must be less than 100 characters"
        
        # Basic email validation
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return False, "Invalid email format"
        
        return True, None
