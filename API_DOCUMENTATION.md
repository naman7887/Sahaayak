# Sahaayak API Documentation

## Base URL

http://localhost:5000/api


# Authentication APIs

## 1. Register

POST /auth/register

Access: Public

### Body

{
  "name": "Ramesh Kumar",
  "email": "ramesh@gmail.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "worker",
  "language": "hi"
}


## 2. Login

POST /auth/login

Access: Public

### Body

{
  "email": "ramesh@gmail.com",
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

### Body

{
  "occupation": "Electrician",
  "skills": [
    "Fan Installation",
    "Wiring",
    "Switch Repair",
    "Inverter Installation"
  ],
  "experience": 7,
  "certifications": [
    {
      "name": "Electrical Technician Certificate",
      "issuingOrganization": "Skill Development Institute",
      "certificateNumber": "CERT12345"
    }
  ],
  "serviceRadius": 10,
  "location": {
    "coordinates": [77.43, 28.67]
  }
}

Note:
Coordinates must be [longitude, latitude].


## 5. Get My Worker Profile

GET /workers/profile

Authorization: Bearer <JWT_TOKEN>


## 6. Update Worker Profile

PUT /workers/profile

Authorization: Bearer <JWT_TOKEN>


## 7. Update Worker Availability

PATCH /workers/availability

Authorization: Bearer <JWT_TOKEN>

### Body

{
  "availability": true
}

## 8. Service APIs

GET /services

Access: Public

## 9. Get Service By ID

GET /services/:id

Access: Public

## 10. Create Service

POST /services

Access: Authenticated

Header

Authorization: Bearer <JWT_TOKEN>

## Body
{
  "name": "Fan Repair",
  "category": "Electrical",
  "description": "Ceiling fan repair and installation",
  "basePrice": 300,
  "estimatedDuration": 60
}

## 11. Update Service

PUT /services/:id

Access: Authenticated

Header

Authorization: Bearer <JWT_TOKEN>

12. Delete / Deactivate Service

DELETE /services/:id

Access: Authenticated

Header

Authorization: Bearer <JWT_TOKEN>
# Health Check

## 13. Check Backend Status

GET /health

This endpoint checks whether the backend is running.