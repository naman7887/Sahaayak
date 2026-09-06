\# Sahaayak ML Service



AI/ML component of the Sahaayak platform for SIH26089.



\## Features



\- Demand forecasting

\- Workforce allocation

\- Combined workforce planning

\- FastAPI ML service

\- Integration with the Sahaayak Node.js backend



\## Models



\### Demand Forecasting



File:



`demand\_forecasting\_model.pkl`



Predicts expected service bookings using factors such as:



\- City

\- State

\- Service

\- Day of week

\- Weekend

\- Month

\- Worker availability

\- Worker assignment

\- Current bookings

\- Completed jobs

\- Cancelled jobs

\- Pending jobs

\- Average response time



\### Workforce Allocation



File:



`workforce\_allocation\_model.pkl`



Recommends workforce requirements based on predicted demand and operational data.



\## Training Scripts



\### Demand Forecasting



```bash

python train\_demand\_model.py

