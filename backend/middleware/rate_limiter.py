from fastapi import Request, HTTPException
from datetime import datetime, timedelta
from collections import defaultdict
import asyncio

class RateLimiter:
    def __init__(self, max_requests: int = 5, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)
        self.cleanup_interval = 300  # Cleanup every 5 minutes
        
    async def check_rate_limit(self, identifier: str) -> bool:
        """Check if identifier has exceeded rate limit"""
        now = datetime.now()
        cutoff = now - timedelta(seconds=self.window_seconds)
        
        # Remove old requests
        self.requests[identifier] = [
            req_time for req_time in self.requests[identifier]
            if req_time > cutoff
        ]
        
        # Check if limit exceeded
        if len(self.requests[identifier]) >= self.max_requests:
            return False
        
        # Add current request
        self.requests[identifier].append(now)
        return True
    
    async def cleanup_old_entries(self):
        """Periodically cleanup old entries"""
        while True:
            await asyncio.sleep(self.cleanup_interval)
            now = datetime.now()
            cutoff = now - timedelta(seconds=self.window_seconds * 2)
            
            # Remove entries with no recent requests
            to_delete = []
            for identifier, times in self.requests.items():
                if not times or max(times) < cutoff:
                    to_delete.append(identifier)
            
            for identifier in to_delete:
                del self.requests[identifier]

# Global rate limiter instances
petition_rate_limiter = RateLimiter(max_requests=3, window_seconds=300)  # 3 submissions per 5 minutes
api_rate_limiter = RateLimiter(max_requests=60, window_seconds=60)  # 60 requests per minute
