# Sahaayak API Documentation

## Base URL

http://localhost:5000/api


# Authentication APIs

## 1. Register

POST /auth/register

Access: Public

### Body

{
  "name": "Naman",
  "email": "naman@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "worker",
  "language": "Hindi"
}


## 2. Login

POST /auth/login

Access: Public

### Body

{
  "email": "naman@example.com",
  "password": "password123"
}


## 3. Get Current User

GET /auth/me

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>



# Worker APIs

All worker APIs require:

Authorization: Bearer <JWT_TOKEN>

Role required: worker


## 4. Create Worker Profile

POST /workers/profile

Access: Authenticated Worker

### Body

{
  "occupation": "Electrician",
  "skills": ["Wiring", "Repair"],
  "experience": 3,
  "certifications": [],
  "availability": true,
  "serviceRadius": 10,
  "location": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716]
  }
}


## 5. Get My Worker Profile

GET /workers/profile

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>


## 6. Update Worker Profile

PUT /workers/profile

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "occupation": "Electrician",
  "skills": ["Wiring", "Repair", "Installation"],
  "experience": 4,
  "serviceRadius": 15,
  "location": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716]
  }
}


## 7. Update Worker Availability

PATCH /workers/availability

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "availability": true
}



# Service APIs

## 8. Get All Services

GET /services

Access: Public


## 9. Get Service By ID

GET /services/:id

Access: Public


## 10. Create Service

POST /services

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "name": "Electrical Repair",
  "category": "Electrical",
  "description": "Home electrical repair service",
  "basePrice": 500,
  "estimatedDuration": 60
}


## 11. Update Service

PUT /services/:id

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "name": "Electrical Repair",
  "category": "Electrical",
  "description": "Home electrical repair service",
  "basePrice": 600,
  "estimatedDuration": 90
}


## 12. Delete / Deactivate Service

DELETE /services/:id

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>



# Booking APIs

All booking APIs require:

Authorization: Bearer <JWT_TOKEN>


## 13. Create Booking

POST /bookings

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "service": "<SERVICE_ID>",
  "scheduledDate": "2026-09-10T10:00:00.000Z",
  "address": "123 Main Street, Delhi",
  "location": {
    "type": "Point",
    "coordinates": [77.1025, 28.7041]
  },
  "description": "Need electrical repair at home",
  "price": 500
}


## 14. Get My Bookings

GET /bookings/my

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>


## 15. Get Worker Bookings

GET /bookings/worker

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>


## 16. Get Booking By ID

GET /bookings/:id

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>


## 17. Accept Booking

PATCH /bookings/:id/accept

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>


## 18. Reject Booking

PATCH /bookings/:id/reject

Access: Authenticated Worker

### Header

Authorization: Bearer <JWT_TOKEN>


## 19. Update Booking Status

PATCH /bookings/:id/status

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "status": "in-progress"
}


Possible status values:

accepted
in-progress
completed
cancelled


## 20. Cancel Booking

PATCH /bookings/:id/cancel

Access: Authenticated Customer

### Header

Authorization: Bearer <JWT_TOKEN>


# Payment APIs

All payment APIs require:

Authorization: Bearer <JWT_TOKEN>


## 21. Create Payment

POST /payments

Access: Authenticated Customer

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "booking": "<BOOKING_ID>",
  "paymentMethod": "upi"
}


## 22. Get My Payments

GET /payments/my

Access: Authenticated Customer

### Header

Authorization: Bearer <JWT_TOKEN>


## 23. Get Payment By ID

GET /payments/:id

Access: Authenticated Customer

### Header

Authorization: Bearer <JWT_TOKEN>


## 24. Update Payment Status

PATCH /payments/:id/status

Access: Authenticated Customer

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "paymentStatus": "paid",
  "transactionId": "TXN123456789"
}


Possible payment methods:

cash
upi
card
online


Possible payment statuses:

pending
paid
failed
refunded


# Welfare APIs

## 25. Get All Welfare Schemes

GET /welfare

Access: Public

### Query Parameter

category

Example:

GET /welfare?category=health


## 26. Get Welfare Scheme By ID

GET /welfare/:id

Access: Public


## 27. Create Welfare Scheme

POST /welfare

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "title": "Health Insurance Scheme",
  "description": "Healthcare support scheme for eligible workers",
  "provider": "Government",
  "category": "Health",
  "benefits": "Financial assistance for healthcare expenses",
  "eligibility": "Eligible registered workers",
  "requiredDocuments": [
    "Aadhaar Card",
    "Income Certificate"
  ],
  "applicationProcess": "Apply through the official government portal",
  "applicationUrl": "https://example.gov.in"
}


## 28. Update Welfare Scheme

PUT /welfare/:id

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "title": "Updated Health Insurance Scheme",
  "description": "Updated healthcare support scheme",
  "benefits": "Updated benefits",
  "eligibility": "Updated eligibility"
}


## 29. Delete / Deactivate Welfare Scheme

DELETE /welfare/:id

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>


# Scheme APIs

## 30. Get All Schemes

GET /schemes

Access: Public

### Query Parameter

category

Example:

GET /schemes?category=health


## 31. Get Scheme By ID

GET /schemes/:id

Access: Public


## 32. Create Scheme

POST /schemes

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "title": "Health Insurance Scheme",
  "description": "Healthcare support scheme for eligible workers",
  "provider": "Government",
  "category": "Health",
  "benefits": "Financial assistance for healthcare expenses",
  "eligibility": "Eligible registered workers",
  "requiredDocuments": [
    "Aadhaar Card",
    "Income Certificate"
  ],
  "applicationProcess": "Apply through the official government portal",
  "applicationUrl": "https://example.gov.in"
}


## 33. Update Scheme

PUT /schemes/:id

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "title": "Updated Health Insurance Scheme",
  "description": "Updated healthcare support scheme",
  "benefits": "Updated benefits",
  "eligibility": "Updated eligibility"
}


## 34. Delete / Deactivate Scheme

DELETE /schemes/:id

Access: Authenticated

### Header

Authorization: Bearer <JWT_TOKEN>


# Admin APIs

All Admin APIs require:

Authorization: Bearer <JWT_TOKEN>

Access: Authenticated Admin


## 35. Get Admin Dashboard Statistics

GET /admin/dashboard

### Header

Authorization: Bearer <JWT_TOKEN>

### Response

{
  "success": true,
  "statistics": {
    "totalUsers": 0,
    "totalWorkers": 0,
    "totalServices": 0,
    "totalBookings": 0,
    "totalPayments": 0,
    "totalWelfareSchemes": 0,
    "totalSchemes": 0,
    "pendingWorkers": 0,
    "pendingBookings": 0
  }
}


## 36. Get Workers For Admin

GET /admin/workers

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Query Parameter

status

Possible values:

pending
verified
rejected

Example:

GET /admin/workers?status=pending


## 37. Update Worker Verification Status

PATCH /admin/workers/:id/verification

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "verificationStatus": "verified"
}

Possible verification statuses:

pending
verified
rejected

When a worker is rejected or moved back to pending, their availability is automatically set to false.


# Review & Rating APIs

## 38. Create Review

POST /reviews

Access: Authenticated Customer

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "booking": "<BOOKING_ID>",
  "rating": 5,
  "comment": "Excellent service and very professional."
}

### Rules

- Only the customer who owns the booking can create the review.
- The booking must have status `completed`.
- The booking must have an assigned worker.
- Only one review can be created per booking.
- Rating must be an integer from 1 to 5.


## 39. Get Worker Reviews

GET /reviews/worker/:workerId

Access: Public

### Example

GET /reviews/worker/<WORKER_ID>

Returns the reviews and ratings submitted for the specified worker.


# Insurance APIs

## 40. Get All Insurance Plans

GET /insurance

Access: Public

Returns all active insurance plans available on the platform.


## 41. Get Insurance Plan By ID

GET /insurance/:id

Access: Public

Returns details of a specific active insurance plan.


## 42. Create Insurance Plan

POST /insurance

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "provider": "LIC",
  "planName": "Worker Protection Plan",
  "description": "Insurance coverage designed for eligible workers",
  "coverageAmount": 500000,
  "premiumAmount": 1200,
  "premiumFrequency": "yearly",
  "eligibility": "Registered workers meeting the eligibility criteria",
  "benefits": [
    "Accidental coverage",
    "Medical assistance"
  ],
  "documentsRequired": [
    "Aadhaar Card",
    "Income Certificate"
  ],
  "applicationUrl": "https://example.gov.in"
}


## 43. Update Insurance Plan

PUT /insurance/:id

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "planName": "Updated Worker Protection Plan",
  "premiumAmount": 1300,
  "benefits": [
    "Accidental coverage",
    "Medical assistance",
    "Emergency support"
  ]
}


## 44. Delete / Deactivate Insurance Plan

DELETE /insurance/:id

Access: Authenticated Admin

### Header

Authorization: Bearer <JWT_TOKEN>

This deactivates the insurance plan instead of permanently deleting it.


# Health Check

## 45. Check Backend Status

GET /health

Access: Public

This endpoint checks whether the backend is running.