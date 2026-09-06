8c7441b99ffe27352d44719ce36bddb9df71cba8.webarchive
File
I m interrupting u, i want you to check that do we have covered all things that is described in this PS, as i m providing u the description of the PS



Absolutely. Below is the complete updated API documentation, keeping the same structure, formatting, numbering, and level of detail as the file you gave me. You can copy-paste the entire thing directly over your existing documentation file.

# Sahaayak API Documentation

## Base URL

http://localhost:5000/api

---

# Authentication APIs

## 1. Register

POST /auth/register

Access: Public

### Body

```json
{
  "name": "Naman",
  "email": "naman@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "worker",
  "language": "hi"
}
2. Login

POST /auth/login

Access: Public

Body
{
  "email": "naman@example.com",
  "password": "password123"
}
3. Get Current User

GET /auth/me

Access: Authenticated

Header

Authorization: Bearer <JWT_TOKEN>

Worker APIs

All worker APIs require:

Authorization: Bearer <JWT_TOKEN>

Role required: worker

4. Create Worker Profile

POST /workers/profile

Access: Authenticated Worker

Body
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
5. Get My Worker Profile

GET /workers/profile

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

6. Update Worker Profile

PUT /workers/profile

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Body
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
7. Update Worker Availability

PATCH /workers/availability

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "availability": true
}
Service APIs
8. Get All Services

GET /services

Access: Public

9. Get Service By ID

GET /services/:id

Access: Public

10. Create Service

POST /services

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "name": "Electrical Repair",
  "category": "Electrical",
  "description": "Home electrical repair service",
  "basePrice": 500,
  "estimatedDuration": 60
}
11. Update Service

PUT /services/:id

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "name": "Electrical Repair",
  "category": "Electrical",
  "description": "Home electrical repair service",
  "basePrice": 600,
  "estimatedDuration": 90
}
12. Delete / Deactivate Service

DELETE /services/:id

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Booking APIs

All booking APIs require:

Authorization: Bearer <JWT_TOKEN>

13. Create Booking

POST /bookings

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "service": "<SERVICE_ID>",
  "scheduledDate": "2026-09-10T10:00:00.000Z",
  "address": "123 Main Street, Delhi",
  "location": {
    "type": "Point",
    "coordinates": [77.1025, 28.7041]
  },
  "description": "Need electrical repair at home",
  "price": 500,
  "isEmergency": false,
  "priority": "normal"
}
Emergency Booking

Emergency and on-demand bookings can be created using the same endpoint.

Set:

{
  "isEmergency": true,
  "priority": "urgent"
}

Possible priority values:

normal
high
urgent
14. Get My Bookings

GET /bookings/my

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

15. Get Worker Bookings

GET /bookings/worker

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

16. Get Booking By ID

GET /bookings/:id

Access: Authenticated

Header

Authorization: Bearer <JWT_TOKEN>

17. Accept Booking

PATCH /bookings/:id/accept

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

18. Reject Booking

PATCH /bookings/:id/reject

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

19. Update Booking Status

PATCH /bookings/:id/status

Access: Authenticated

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "status": "in-progress"
}

Possible status values:

accepted
in-progress
completed
cancelled
20. Cancel Booking

PATCH /bookings/:id/cancel

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

Payment APIs

All payment APIs require:

Authorization: Bearer <JWT_TOKEN>

21. Create Payment

POST /payments

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "booking": "<BOOKING_ID>",
  "paymentMethod": "upi"
}
22. Get My Payments

GET /payments/my

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

23. Get Payment By ID

GET /payments/:id

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

24. Update Payment Status

PATCH /payments/:id/status

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
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
Welfare APIs
25. Get All Welfare Schemes

GET /welfare

Access: Public

Query Parameter

category

Example:

GET /welfare?category=health

26. Get Welfare Scheme By ID

GET /welfare/:id

Access: Public

27. Create Welfare Scheme

POST /welfare

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
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
28. Update Welfare Scheme

PUT /welfare/:id

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "title": "Updated Health Insurance Scheme",
  "description": "Updated healthcare support scheme",
  "benefits": "Updated benefits",
  "eligibility": "Updated eligibility"
}
29. Delete / Deactivate Welfare Scheme

DELETE /welfare/:id

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Scheme APIs
30. Get All Schemes

GET /schemes

Access: Public

Query Parameter

category

Example:

GET /schemes?category=health

31. Get Scheme By ID

GET /schemes/:id

Access: Public

32. Create Scheme

POST /schemes

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
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
33. Update Scheme

PUT /schemes/:id

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "title": "Updated Health Insurance Scheme",
  "description": "Updated eligibility-based scheme",
  "benefits": "Updated benefits",
  "eligibility": "Updated eligibility"
}
34. Delete / Deactivate Scheme

DELETE /schemes/:id

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Smart Scheme Eligibility Fields

Schemes can optionally contain the following fields for smart worker recommendations:

targetOccupations — occupations targeted by the scheme
minimumAge — minimum eligible age
maximumAge — maximum eligible age
maximumIncome — maximum income allowed
eligibleStates — states where the scheme applies
requiredSkills — skills relevant to the scheme
eligibleWorkerTypes — worker, customer, or all

The recommendation system uses the worker's profile information to calculate an eligibility score and return matching schemes.

Admin APIs

All Admin APIs require:

Authorization: Bearer <JWT_TOKEN>

Access: Authenticated Admin

35. Get Admin Dashboard Statistics

GET /admin/dashboard

Header

Authorization: Bearer <JWT_TOKEN>

Response
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
36. Get Workers For Admin

GET /admin/workers

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Query Parameter

status

Possible values:

pending
verified
rejected

Example:

GET /admin/workers?status=pending

37. Update Worker Verification Status

PATCH /admin/workers/:id/verification

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "verificationStatus": "verified"
}

Possible verification statuses:

pending
verified
rejected

When a worker is rejected or moved back to pending, their availability is automatically set to false.

Review & Rating APIs
38. Create Review

POST /reviews

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "booking": "<BOOKING_ID>",
  "rating": 5,
  "comment": "Excellent service and very professional."
}
Rules
Only the customer who owns the booking can create the review.
The booking must have status completed.
The booking must have an assigned worker.
Only one review can be created per booking.
Rating must be an integer from 1 to 5.
39. Get Worker Reviews

GET /reviews/worker/:workerId

Access: Public

Example

GET /reviews/worker/<WORKER_ID>

Returns the reviews and ratings submitted for the specified worker.

Insurance APIs
40. Get All Insurance Plans

GET /insurance

Access: Public

Returns all active insurance plans available on the platform.

41. Get Insurance Plan By ID

GET /insurance/:id

Access: Public

Returns details of a specific active insurance plan.

42. Create Insurance Plan

POST /insurance

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
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
43. Update Insurance Plan

PUT /insurance/:id

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "planName": "Updated Worker Protection Plan",
  "premiumAmount": 1300,
  "benefits": [
    "Accidental coverage",
    "Medical assistance",
    "Emergency support"
  ]
}
44. Delete / Deactivate Insurance Plan

DELETE /insurance/:id

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

This deactivates the insurance plan instead of permanently deleting it.

User Profile APIs
45. Get My Profile

GET /users/profile

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Response
{
  "success": true,
  "user": {
    "id": "<USER_ID>",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "9876543210",
    "role": "customer",
    "language": "en",
    "isVerified": false
  }
}
46. Update My Profile

PATCH /users/profile

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "name": "Updated Name",
  "phone": "9876543210",
  "language": "hi"
}
Updatable Fields
name
phone
language

Users cannot change their role, verification status, email or password through this endpoint.

Worker Profile Fields

Worker users can also have:

occupation
skills
certifications
age
income
location.state
location.city
location.address
cooperative

These fields are used by features such as smart scheme recommendations, worker training, and cooperative management.

Notification APIs
47. Get My Notifications

GET /notifications

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Returns all notifications belonging to the currently logged-in user.

48. Mark Notification As Read

PATCH /notifications/:id/read

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Marks a specific notification as read.

49. Mark All Notifications As Read

PATCH /notifications/read-all

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Marks all unread notifications belonging to the current user as read.

Health Check
50. Check Backend Status

GET /health

Access: Public

This endpoint checks whether the backend is running.

Worker Salary & Income Security APIs

These APIs implement the worker income-security system.

The system provides:

Guaranteed base salary for eligible workers.
A monthly job limit.
Overtime/incentive pay for jobs completed above the monthly limit.
Performance bonus and administrative adjustment support.
Salary history and payment status tracking.

The base salary is not reduced when platform demand is low.

51. Get My Current Salary

GET /worker-salary/my

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Response

Returns the current month's salary record, including:

baseSalary
monthlyJobLimit
completedJobs
extraJobs
overtimeRate
overtimePay
performanceBonus
adjustment
finalSalary
status
52. Get My Salary History

GET /worker-salary/my/history

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Returns the worker's salary records for previous and current months.

53. Get All Worker Salaries

GET /worker-salary

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Returns salary records for workers for admin management.

54. Recalculate Worker Salary

PUT /worker-salary/:id/recalculate

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Recalculates salary using:

Final Salary = Base Salary + Overtime Pay + Performance Bonus + Adjustment

Overtime Pay = Extra Jobs × Overtime Rate

Extra Jobs = max(0, Completed Jobs - Monthly Job Limit)

55. Mark Worker Salary As Paid

PUT /worker-salary/:id/pay

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Marks the selected salary record as paid and records the payment timestamp.

Automatic Job Count Update

When a booking changes to completed, the worker's current-month salary record is automatically updated.

The system:

Increments completedJobs.
Calculates extraJobs after the monthly job limit.
Calculates overtime pay.
Updates finalSalary.
Sends the worker an earnings notification.
Training Program APIs
56. Get Active Training Programs

GET /training

Access: Authenticated User

Returns active training programs available on the platform.

57. Get Training Program By ID

GET /training/:id

Access: Authenticated User

Returns details of a specific training program.

58. Create Training Program

POST /training

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "title": "Advanced Electrical Safety",
  "description": "Training program focused on electrical safety and modern repair practices.",
  "provider": "Sahaayak Training Center",
  "skills": [
    "Electrical Safety",
    "Advanced Wiring"
  ],
  "duration": "4 weeks",
  "eligibility": "Registered electricians",
  "certification": "Advanced Electrical Safety Certificate",
  "applicationUrl": "https://example.gov.in/training",
  "isFree": true
}
59. Update Training Program

PUT /training/:id

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "title": "Updated Electrical Safety Training",
  "description": "Updated training description",
  "duration": "6 weeks",
  "isFree": true
}
60. Delete / Deactivate Training Program

DELETE /training/:id

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

This deactivates the training program instead of permanently deleting it.

Worker Training APIs
61. Enroll In Training

POST /worker-training/:trainingId/enroll

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Enrolls the currently logged-in worker in the selected training program.

62. Get My Training Enrollments

GET /worker-training/my

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Returns the worker's training enrollments with program details.

63. Get My Training Enrollment By ID

GET /worker-training/my/:id

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Returns a specific training enrollment belonging to the logged-in worker.

64. Update My Training Status

PUT /worker-training/my/:id/status

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "status": "completed",
  "certificateUrl": "https://example.com/certificate.pdf"
}

Possible statuses:

enrolled
in-progress
completed
cancelled

When a worker completes training:

The completion date is recorded.
The certificate URL can be stored.
Training skills are added to the worker profile.
The training certification is added to the worker profile.
A training-completion notification is sent.
65. Cancel My Training Enrollment

DELETE /worker-training/my/:id

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Cancels the worker's training enrollment. Completed training cannot be cancelled.

Smart Scheme Recommendation API
66. Get My Recommended Schemes

GET /schemes/recommended

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Returns active schemes ranked according to the logged-in worker's profile.

The recommendation system considers available profile information such as:

Worker type
Age
Income
State
Occupation
Skills

Each recommendation includes an eligibility result, score, reasons, and warnings.

The recommendation is an informational matching system. Final eligibility is determined by the official scheme authority.

Invoice APIs

These APIs provide digital invoice generation and payment-status tracking for completed bookings.

All Invoice APIs require:

Authorization: Bearer <JWT_TOKEN>

67. Generate Invoice

POST /invoices

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "booking": "<BOOKING_ID>"
}

Generates an invoice for a completed booking.

The booking must have status completed.

The invoice contains:

Invoice number
Booking
Customer
Worker
Service
Amount
Payment status
Invoice date
Payment date
68. Get My Invoices

GET /invoices/my

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

Returns invoices belonging to the currently logged-in customer.

69. Get Invoice By ID

GET /invoices/:id

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Returns details of a specific invoice.

Users can only access invoices associated with their booking unless they are administrators.

70. Get All Invoices

GET /invoices

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Returns all invoices for administrative management.

71. Update Invoice Payment Status

PATCH /invoices/:id/payment-status

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "paymentStatus": "paid"
}

Possible payment statuses:

pending
paid
failed
refunded

When an invoice is marked as paid, the payment timestamp is recorded.

Cooperative & Federation APIs

These APIs provide cooperative society and federation management for the cooperative-owned service marketplace.

All Cooperative APIs require:

Authorization: Bearer <JWT_TOKEN>

Administrative management APIs require the admin role.

72. Create Cooperative

POST /cooperatives

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "name": "Delhi Electrical Workers Cooperative",
  "registrationNumber": "COOP-DL-001",
  "type": "society",
  "description": "Cooperative society for electrical service workers",
  "state": "Delhi",
  "city": "New Delhi",
  "address": "New Delhi, Delhi",
  "contactEmail": "coop@example.com",
  "contactPhone": "9876543210"
}

Possible cooperative types:

federation
society
73. Get All Cooperatives

GET /cooperatives

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Returns all registered cooperatives and federations.

74. Get Cooperative By ID

GET /cooperatives/:id

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Returns details of a specific cooperative.

75. Update Cooperative

PUT /cooperatives/:id

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "name": "Updated Electrical Workers Cooperative",
  "description": "Updated cooperative description",
  "contactEmail": "updated@example.com",
  "contactPhone": "9876543210"
}

Updates cooperative information.

76. Deactivate Cooperative

DELETE /cooperatives/:id

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Deactivates the cooperative instead of permanently deleting it.

77. Get Federation Societies

GET /cooperatives/:id/societies

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Returns the societies belonging to the selected federation.

This endpoint is useful for federation-level administration.

78. Get Cooperative Workers

GET /cooperatives/:id/workers

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Returns workers assigned to the selected cooperative.

79. Assign Worker To Cooperative

PATCH /cooperatives/:id/workers/:workerId

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Assigns a worker to a cooperative.

80. Remove Worker From Cooperative

DELETE /cooperatives/:id/workers/:workerId

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Removes a worker from the selected cooperative.

AI / ML APIs

These APIs connect the Node.js backend with the separate Python ML service.

The ML service is responsible for:

AI-based demand forecasting
Workforce allocation

All ML APIs require:

Authorization: Bearer <JWT_TOKEN>

Access: Authenticated Admin

The Node.js backend communicates with the ML service using the configured ML_SERVICE_URL.

81. Check ML Service Health

GET /ml/health

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Checks whether the Python ML service is available.

82. Forecast Service Demand

POST /ml/forecast

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "city": "Delhi",
  "state": "Delhi",
  "service": "Electrical",
  "date": "2026-09-11"
}

Returns a demand forecast from the ML service.

The forecast can support:

Worker planning
Service availability planning
Demand forecasting
Workforce allocation
83. Allocate Workforce

POST /ml/allocate

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "city": "Delhi",
  "state": "Delhi",
  "service": "Electrical",
  "requiredWorkers": 8,
  "availableWorkers": 12
}

Returns a workforce allocation recommendation based on demand and worker availability.

API Summary
Module	APIs
Authentication	3
Worker	4
Services	5
Booking	8
Payments	4
Welfare	5
Schemes	5
Admin	3
Reviews & Ratings	2
Insurance	5
User Profile	2
Notifications	3
Health	1
Worker Salary & Income Security	5
Training Programs	5
Worker Training	5
Smart Scheme Recommendation	1
Invoices	5
Cooperative & Federation	9
AI / ML	3
Total	83
SIH26089 Feature Coverage

The Sahaayak backend provides API support for the major requirements of SIH26089:

Worker registration and verification
Worker skill profiling and certification
Customer booking and scheduling
Geo-location based worker matching
Digital payments
Digital invoicing
Rating and feedback
Worker welfare schemes
Worker insurance integration
Emergency and on-demand booking
Cooperative and federation administration
Multilingual support foundation
Worker income security
Worker training and certification
Smart welfare-scheme recommendations
AI-based demand forecasting integration
AI-based workforce allocation integration

The AI/ML endpoints provide the integration layer for the Python machine-learning service. Actual demand forecasting and workforce allocation predictions depend on the deployed ML service and trained models.


**Small correction I made:** your original health endpoint says `GET /api/health`, but because the **Base URL is already `/api`**, the documented endpoint should be **`GET /health`**. Otherwise you'd accidentally describe `/api/api/health`.
i cant copy it put all the api into the single file

Yes — you want one complete file, not separate code blocks.

I can create the actual .md documentation file for you so you can directly replace your existing API documentation file.

I’ll make it contain all 83 APIs in a single file, with the same structure you provided, including the newly added:

Invoice APIs
Cooperative/Federation APIs
Emergency booking fields
AI/ML APIs
Updated API summary
SIH26089 feature coverage
yeah give it to me

Done. I created the complete updated API documentation as one single Markdown file, with all 83 APIs.

Download Sahaayak_API_Documentation_Updated.md

Just replace your existing API documentation file with this one. 

Sahaayak_API_Documentation_Updated.md
Document

Library
/
Sih
/
Sahaayak_API_Documentation_Updated.md
Sahaayak API Documentation
Base URL

http://localhost:5000/api

Authentication APIs
1. Register

POST /auth/register

Access: Public

Body
{
  "name": "Naman",
  "email": "naman@example.com",
  "phone": "9876543210",
  "password": "password123",
  "role": "worker",
  "language": "hi"
}
2. Login

POST /auth/login

Access: Public

Body
{
  "email": "naman@example.com",
  "password": "password123"
}
3. Get Current User

GET /auth/me

Access: Authenticated

Header

Authorization: Bearer <JWT_TOKEN>

Worker APIs

All worker APIs require:

Authorization: Bearer <JWT_TOKEN>

Role required: worker

4. Create Worker Profile

POST /workers/profile

Access: Authenticated Worker

Body
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
5. Get My Worker Profile

GET /workers/profile

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

6. Update Worker Profile

PUT /workers/profile

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Body
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
7. Update Worker Availability

PATCH /workers/availability

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "availability": true
}
Service APIs
8. Get All Services

GET /services

Access: Public

9. Get Service By ID

GET /services/

Access: Public

10. Create Service

POST /services

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "name": "Electrical Repair",
  "category": "Electrical",
  "description": "Home electrical repair service",
  "basePrice": 500,
  "estimatedDuration": 60
}
11. Update Service

PUT /services/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "name": "Electrical Repair",
  "category": "Electrical",
  "description": "Home electrical repair service",
  "basePrice": 600,
  "estimatedDuration": 90
}
12. Delete / Deactivate Service

DELETE /services/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Booking APIs

All booking APIs require:

Authorization: Bearer <JWT_TOKEN>

13. Create Booking

POST /bookings

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "service": "<SERVICE_ID>",
  "scheduledDate": "2026-09-10T10:00:00.000Z",
  "address": "123 Main Street, Delhi",
  "location": {
    "type": "Point",
    "coordinates": [77.1025, 28.7041]
  },
  "description": "Need electrical repair at home",
  "price": 500,
  "isEmergency": false,
  "priority": "normal"
}
Emergency Booking

Emergency and on-demand bookings use the same endpoint.

For an emergency request:

{
  "isEmergency": true,
  "priority": "urgent"
}

Possible priority values:

normal
high
urgent
14. Get My Bookings

GET /bookings/my

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

15. Get Worker Bookings

GET /bookings/worker

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

16. Get Booking By ID

GET /bookings/

Access: Authenticated

Header

Authorization: Bearer <JWT_TOKEN>

17. Accept Booking

PATCH /bookings//accept

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

18. Reject Booking

PATCH /bookings//reject

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

19. Update Booking Status

PATCH /bookings//status

Access: Authenticated

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "status": "in-progress"
}

Possible status values:

accepted
in-progress
completed
cancelled
20. Cancel Booking

PATCH /bookings//cancel

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

Payment APIs

All payment APIs require:

Authorization: Bearer <JWT_TOKEN>

21. Create Payment

POST /payments

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "booking": "<BOOKING_ID>",
  "paymentMethod": "upi"
}
22. Get My Payments

GET /payments/my

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

23. Get Payment By ID

GET /payments/

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

24. Update Payment Status

PATCH /payments//status

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
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
Welfare APIs
25. Get All Welfare Schemes

GET /welfare

Access: Public

Query Parameter

category

Example:

GET /welfare?category=health

26. Get Welfare Scheme By ID

GET /welfare/

Access: Public

27. Create Welfare Scheme

POST /welfare

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
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
28. Update Welfare Scheme

PUT /welfare/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "title": "Updated Health Insurance Scheme",
  "description": "Updated healthcare support scheme",
  "benefits": "Updated benefits",
  "eligibility": "Updated eligibility"
}
29. Delete / Deactivate Welfare Scheme

DELETE /welfare/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Scheme APIs
30. Get All Schemes

GET /schemes

Access: Public

Query Parameter

category

Example:

GET /schemes?category=health

31. Get Scheme By ID

GET /schemes/

Access: Public

32. Create Scheme

POST /schemes

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
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
33. Update Scheme

PUT /schemes/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "title": "Updated Health Insurance Scheme",
  "description": "Updated eligibility-based scheme",
  "benefits": "Updated benefits",
  "eligibility": "Updated eligibility"
}
34. Delete / Deactivate Scheme

DELETE /schemes/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Smart Scheme Eligibility Fields

Schemes can optionally contain the following fields for smart worker recommendations:

targetOccupations — occupations targeted by the scheme
minimumAge — minimum eligible age
maximumAge — maximum eligible age
maximumIncome — maximum income allowed
eligibleStates — states where the scheme applies
requiredSkills — skills relevant to the scheme
eligibleWorkerTypes — worker, customer, or all

The recommendation system uses the worker's profile information to calculate an eligibility score and return matching schemes.

Admin APIs

All Admin APIs require:

Authorization: Bearer <JWT_TOKEN>

Access: Authenticated Admin

35. Get Admin Dashboard Statistics

GET /admin/dashboard

Header

Authorization: Bearer <JWT_TOKEN>

Response
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
36. Get Workers For Admin

GET /admin/workers

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Query Parameter

status

Possible values:

pending
verified
rejected

Example:

GET /admin/workers?status=pending

37. Update Worker Verification Status

PATCH /admin/workers//verification

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "verificationStatus": "verified"
}

Possible verification statuses:

pending
verified
rejected

When a worker is rejected or moved back to pending, their availability is automatically set to false.

Review & Rating APIs
38. Create Review

POST /reviews

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "booking": "<BOOKING_ID>",
  "rating": 5,
  "comment": "Excellent service and very professional."
}
Rules
Only the customer who owns the booking can create the review.
The booking must have status completed.
The booking must have an assigned worker.
Only one review can be created per booking.
Rating must be an integer from 1 to 5.
39. Get Worker Reviews

GET /reviews/worker/

Access: Public

Example

GET /reviews/worker/<WORKER_ID>

Returns the reviews and ratings submitted for the specified worker.

Insurance APIs
40. Get All Insurance Plans

GET /insurance

Access: Public

Returns all active insurance plans available on the platform.

41. Get Insurance Plan By ID

GET /insurance/

Access: Public

Returns details of a specific active insurance plan.

42. Create Insurance Plan

POST /insurance

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
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
43. Update Insurance Plan

PUT /insurance/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "planName": "Updated Worker Protection Plan",
  "premiumAmount": 1300,
  "benefits": [
    "Accidental coverage",
    "Medical assistance",
    "Emergency support"
  ]
}
44. Delete / Deactivate Insurance Plan

DELETE /insurance/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

This deactivates the insurance plan instead of permanently deleting it.

User Profile APIs
45. Get My Profile

GET /users/profile

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Response
{
  "success": true,
  "user": {
    "id": "<USER_ID>",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "9876543210",
    "role": "customer",
    "language": "en",
    "isVerified": false
  }
}
46. Update My Profile

PATCH /users/profile

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "name": "Updated Name",
  "phone": "9876543210",
  "language": "hi"
}
Updatable Fields
name
phone
language

Users cannot change their role, verification status, email or password through this endpoint.

Worker Profile Fields

Worker users can also have:

occupation
skills
certifications
age
income
location.state
location.city
location.address
cooperative

These fields are used by features such as smart scheme recommendations, worker training, and cooperative management.

Notification APIs
47. Get My Notifications

GET /notifications

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Returns all notifications belonging to the currently logged-in user.

48. Mark Notification As Read

PATCH /notifications//read

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Marks a specific notification as read.

49. Mark All Notifications As Read

PATCH /notifications/read-all

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Marks all unread notifications belonging to the current user as read.

Health Check
50. Check Backend Status

GET /health

Access: Public

This endpoint checks whether the backend is running.

Worker Salary & Income Security APIs

These APIs implement the worker income-security system.

The system provides:

Guaranteed base salary for eligible workers.
A monthly job limit.
Overtime/incentive pay for jobs completed above the monthly limit.
Performance bonus and administrative adjustment support.
Salary history and payment status tracking.

The base salary is not reduced when platform demand is low.

51. Get My Current Salary

GET /worker-salary/my

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Response

Returns the current month's salary record, including:

baseSalary
monthlyJobLimit
completedJobs
extraJobs
overtimeRate
overtimePay
performanceBonus
adjustment
finalSalary
status
52. Get My Salary History

GET /worker-salary/my/history

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Returns the worker's salary records for previous and current months.

53. Get All Worker Salaries

GET /worker-salary

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Returns salary records for workers for admin management.

54. Recalculate Worker Salary

PUT /worker-salary//recalculate

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Recalculates salary using:

Final Salary = Base Salary + Overtime Pay + Performance Bonus + Adjustment

Overtime Pay = Extra Jobs × Overtime Rate

Extra Jobs = max(0, Completed Jobs - Monthly Job Limit)

55. Mark Worker Salary As Paid

PUT /worker-salary//pay

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Marks the selected salary record as paid and records the payment timestamp.

Automatic Job Count Update

When a booking changes to completed, the worker's current-month salary record is automatically updated.

The system:

Increments completedJobs.
Calculates extraJobs after the monthly job limit.
Calculates overtime pay.
Updates finalSalary.
Sends the worker an earnings notification.
Training Program APIs
56. Get Active Training Programs

GET /training

Access: Authenticated User

Returns active training programs available on the platform.

57. Get Training Program By ID

GET /training/

Access: Authenticated User

Returns details of a specific training program.

58. Create Training Program

POST /training

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "title": "Advanced Electrical Safety",
  "description": "Training program focused on electrical safety and modern repair practices.",
  "provider": "Sahaayak Training Center",
  "skills": [
    "Electrical Safety",
    "Advanced Wiring"
  ],
  "duration": "4 weeks",
  "eligibility": "Registered electricians",
  "certification": "Advanced Electrical Safety Certificate",
  "applicationUrl": "https://example.gov.in/training",
  "isFree": true
}
59. Update Training Program

PUT /training/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "title": "Updated Electrical Safety Training",
  "description": "Updated training description",
  "duration": "6 weeks",
  "isFree": true
}
60. Delete / Deactivate Training Program

DELETE /training/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

This deactivates the training program instead of permanently deleting it.

Worker Training APIs
61. Enroll In Training

POST /worker-training//enroll

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Enrolls the currently logged-in worker in the selected training program.

62. Get My Training Enrollments

GET /worker-training/my

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Returns the worker's training enrollments with program details.

63. Get My Training Enrollment By ID

GET /worker-training/my/

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Returns a specific training enrollment belonging to the logged-in worker.

64. Update My Training Status

PUT /worker-training/my//status

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "status": "completed",
  "certificateUrl": "https://example.com/certificate.pdf"
}

Possible statuses:

enrolled
in-progress
completed
cancelled

When a worker completes training:

The completion date is recorded.
The certificate URL can be stored.
Training skills are added to the worker profile.
The training certification is added to the worker profile.
A training-completion notification is sent.
65. Cancel My Training Enrollment

DELETE /worker-training/my/

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Cancels the worker's training enrollment. Completed training cannot be cancelled.

Smart Scheme Recommendation API
66. Get My Recommended Schemes

GET /schemes/recommended

Access: Authenticated Worker

Header

Authorization: Bearer <JWT_TOKEN>

Returns active schemes ranked according to the logged-in worker's profile.

The recommendation system considers available profile information such as:

Worker type
Age
Income
State
Occupation
Skills

Each recommendation includes an eligibility result, score, reasons, and warnings.

The recommendation is an informational matching system. Final eligibility is determined by the official scheme authority.

Invoice APIs

These APIs provide digital invoice generation and payment-status tracking for completed bookings.

All Invoice APIs require:

Authorization: Bearer <JWT_TOKEN>

67. Generate Invoice

POST /invoices

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "booking": "<BOOKING_ID>"
}

Generates an invoice for a completed booking.

The booking must have status completed.

The invoice contains:

Invoice number
Booking
Customer
Worker
Service
Amount
Payment status
Invoice date
Payment date
68. Get My Invoices

GET /invoices/my

Access: Authenticated Customer

Header

Authorization: Bearer <JWT_TOKEN>

Returns invoices belonging to the currently logged-in customer.

69. Get Invoice By ID

GET /invoices/

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Returns details of a specific invoice.

Users can only access invoices associated with their booking unless they are administrators.

70. Get All Invoices

GET /invoices

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Returns all invoices for administrative management.

71. Update Invoice Payment Status

PATCH /invoices//payment-status

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "paymentStatus": "paid"
}

Possible payment statuses:

pending
paid
failed
refunded

When an invoice is marked as paid, the payment timestamp is recorded.

Cooperative & Federation APIs

These APIs provide cooperative society and federation management for the cooperative-owned service marketplace.

All Cooperative APIs require:

Authorization: Bearer <JWT_TOKEN>

Administrative management APIs require the admin role.

72. Create Cooperative

POST /cooperatives

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "name": "Delhi Electrical Workers Cooperative",
  "registrationNumber": "COOP-DL-001",
  "type": "society",
  "description": "Cooperative society for electrical service workers",
  "state": "Delhi",
  "city": "New Delhi",
  "address": "New Delhi, Delhi",
  "contactEmail": "coop@example.com",
  "contactPhone": "9876543210"
}

Possible cooperative types:

federation
society
73. Get All Cooperatives

GET /cooperatives

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Returns all registered cooperatives and federations.

74. Get Cooperative By ID

GET /cooperatives/

Access: Authenticated User

Header

Authorization: Bearer <JWT_TOKEN>

Returns details of a specific cooperative.

75. Update Cooperative

PUT /cooperatives/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "name": "Updated Electrical Workers Cooperative",
  "description": "Updated cooperative description",
  "contactEmail": "updated@example.com",
  "contactPhone": "9876543210"
}

Updates cooperative information.

76. Deactivate Cooperative

DELETE /cooperatives/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Deactivates the cooperative instead of permanently deleting it.

77. Get Federation Societies

GET /cooperatives//societies

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Returns the societies belonging to the selected federation.

This endpoint is useful for federation-level administration.

78. Get Cooperative Workers

GET /cooperatives//workers

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Returns workers assigned to the selected cooperative.

79. Assign Worker To Cooperative

PATCH /cooperatives//workers/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Assigns a worker to a cooperative.

80. Remove Worker From Cooperative

DELETE /cooperatives//workers/

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Removes a worker from the selected cooperative.

AI / ML APIs

These APIs connect the Node.js backend with the separate Python ML service.

The ML service is responsible for:

AI-based demand forecasting
Workforce allocation

All ML APIs require:

Authorization: Bearer <JWT_TOKEN>

Access: Authenticated Admin

The Node.js backend communicates with the ML service using the configured ML_SERVICE_URL.

81. Check ML Service Health

GET /ml/health

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Checks whether the Python ML service is available.

82. Forecast Service Demand

POST /ml/forecast

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "city": "Delhi",
  "state": "Delhi",
  "service": "Electrical",
  "date": "2026-09-11"
}

Returns a demand forecast from the ML service.

The forecast can support:

Worker planning
Service availability planning
Demand forecasting
Workforce allocation
83. Allocate Workforce

POST /ml/allocate

Access: Authenticated Admin

Header

Authorization: Bearer <JWT_TOKEN>

Body
{
  "city": "Delhi",
  "state": "Delhi",
  "service": "Electrical",
  "requiredWorkers": 8,
  "availableWorkers": 12
}

Returns a workforce allocation recommendation based on demand and worker availability.

API Summary
Module	APIs
Authentication	3
Worker	4
Services	5
Booking	8
Payments	4
Welfare	5
Schemes	5
Admin	3
Reviews & Ratings	2
Insurance	5
User Profile	2
Notifications	3
Health	1
Worker Salary & Income Security	5
Training Programs	5
Worker Training	5
Smart Scheme Recommendation	1
Invoices	5
Cooperative & Federation	9
AI / ML	3
Total	83
SIH26089 Feature Coverage

The Sahaayak backend provides API support for the major requirements of SIH26089:

Worker registration and verification
Worker skill profiling and certification
Customer booking and scheduling
Geo-location based worker matching
Digital payments
Digital invoicing
Rating and feedback
Worker welfare schemes
Worker insurance integration
Emergency and on-demand booking
Cooperative and federation administration
Multilingual support foundation
Worker income security
Worker training and certification
Smart welfare-scheme recommendations
AI-based demand forecasting integration
AI-based workforce allocation integration

The AI/ML endpoints provide the integration layer for the Python machine-learning service. Actual demand forecasting and workforce allocation predictions depend on the deployed ML service and trained models.

### 84. Combined Workforce Planning

**POST /api/ml/workforce-plan**

Access: Authenticated Admin

#### Body

```json
{
  "city": "Delhi",
  "state": "Delhi",
  "service": "Electrical",
  "date": "2026-09-11",
  "available_workers": 15,
  "workers_per_booking": 1
}