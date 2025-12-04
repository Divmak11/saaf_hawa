# Saaf Hawa Abhiyan - API Contracts & Integration Plan

## Overview
This document outlines the API contracts between frontend and backend for the Delhi Air Pollution Petition website.

## Current Mock Implementation

### Mock Data Location
- **File**: `/app/frontend/src/mock.js`
- **Functions**:
  - `mockPetitionData`: Contains total signatures count and recent signatures list
  - `mockSubmitSignature(formData)`: Simulates petition signing
  - `getUserSignature()`: Retrieves user signature from localStorage

### Mock Data Structure
```javascript
{
  totalSignatures: 12847,
  recentSignatures: [
    { name: "Priya Sharma", timestamp: "2 minutes ago" },
    // ... more entries
  ]
}
```

## Backend Implementation Plan

### 1. Database Models

#### Signature Model
```python
{
  "_id": ObjectId,
  "name": str (required),
  "email": str (optional),
  "phone": str (optional),
  "timestamp": datetime,
  "signature_number": int (auto-increment)
}
```

#### Counter Model (for tracking signature numbers)
```python
{
  "_id": "signature_counter",
  "count": int
}
```

### 2. API Endpoints

#### GET `/api/petition/stats`
**Purpose**: Get current petition statistics
**Response**:
```json
{
  "total_signatures": 12847,
  "recent_signatures": [
    {
      "name": "Priya Sharma",
      "timestamp": "2 minutes ago"
    }
  ]
}
```

#### POST `/api/petition/sign`
**Purpose**: Submit a new petition signature
**Request Body**:
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",  // optional
  "phone": "+91 98765 43210"     // optional
}
```
**Response**:
```json
{
  "success": true,
  "signature": {
    "id": "abc123",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "+91 98765 43210",
    "timestamp": "2025-12-02T05:30:00Z",
    "signature_number": 12848
  }
}
```

#### GET `/api/petition/signature/{id}`
**Purpose**: Retrieve a specific signature by ID
**Response**:
```json
{
  "id": "abc123",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+91 98765 43210",
  "timestamp": "2025-12-02T05:30:00Z",
  "signature_number": 12848
}
```

#### GET `/api/petition/download-pdf/{id}`
**Purpose**: Generate and download PDF of signed petition
**Response**: PDF file

#### GET `/api/petition/download-image/{id}`
**Purpose**: Generate and download image of signed petition
**Response**: PNG/JPEG image

### 3. Frontend Changes Required

#### Home.jsx
- Replace `mockSubmitSignature` with actual API call to `/api/petition/sign`
- Store signature ID in localStorage for success page
- Update error handling for real API errors

#### Success.jsx
- Replace `getUserSignature()` with API call to `/api/petition/signature/{id}`
- Implement actual PDF download via `/api/petition/download-pdf/{id}`
- Implement actual image download via `/api/petition/download-image/{id}`

#### SignatureForm.jsx (if needed)
- Add real-time signature counter by polling `/api/petition/stats` every 10 seconds

### 4. Implementation Steps

1. **Create MongoDB models** in `/app/backend/models/`
2. **Create signature service** with business logic in `/app/backend/services/`
3. **Create API routes** in `/app/backend/routers/`
4. **Implement PDF generation** using reportlab or similar
5. **Implement image generation** using Pillow or similar
6. **Update frontend to use real APIs** instead of mock
7. **Test complete flow**

### 5. Environment Variables Needed
None - using existing MongoDB setup

### 6. Dependencies to Install

#### Backend
- `reportlab`: For PDF generation
- `Pillow`: For image generation

### 7. Testing Checklist
- [ ] Submit signature with all fields
- [ ] Submit signature with only name (required field)
- [ ] View success page with signed petition
- [ ] Download PDF
- [ ] Download image
- [ ] Share on social media
- [ ] Verify signature counter increments
- [ ] Test on mobile devices

### 8. Notes
- Initial signature counter should start from mock value (12847) to maintain continuity
- Timestamps should show relative time (e.g., "2 minutes ago")
- Recent signatures list should show latest 5 signatures
- Social share functionality is already implemented on frontend
