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



# Health Check

## 25. Check Backend Status

GET /health

Access: Public

This endpoint checks whether the backend is running.