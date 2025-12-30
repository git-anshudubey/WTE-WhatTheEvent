# Event Booking System - Quick Start Guide

## 🚀 Setup Instructions

### 1. Server Setup
```bash
cd server
npm install

# Add to server/.env:
PORT=5000
DB_URI=mongodb://localhost:27017/event-booking
JWT_SECRET=your_jwt_secret_here_change_in_production
STRIPE_SECRET_KEY=sk_test_your_stripe_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
CLIENT_URL=http://localhost:5173
EMAIL_USER=your_email@ethereal.email
EMAIL_PASS=your_password

# Create admin user
node create-admin.js

# Start server
npm run dev
```

### 2. Client Setup
```bash
cd client
npm install

# Add to client/.env:
VITE_API_URL=http://localhost:5000/api

# Start client
npm run dev
```

## 👤 Admin Access

**Admin Credentials**:
- Email: `admin@eventhub.com`
- Password: `admin123`

**Admin Features**:
- Create Events: Click "Manage Events" → "Create Event"
- View Dashboard: Analytics and statistics
- Manage Users: View all registered users

## 💳 Stripe Payment Testing

1. Get test keys from: https://dashboard.stripe.com/test/apikeys
2. Add to `server/.env`:
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET (for webhooks)

**Test Card Numbers**:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Expiry: Any future date (e.g., 12/34)
- CVC: Any 3 digits (e.g., 123)

## 📋 All Implemented Features

✅ User Authentication (Login/Register)
✅ Browse Events (Public)
✅ Event Details
✅ Book Tickets
✅ Stripe Payment Integration
✅ Email Confirmations with QR Codes
✅ My Bookings Page
✅ Admin Dashboard with Analytics
✅ Admin Event Management (Create/Edit/Delete)
✅ User Management
✅ Event Reminders (Cron Job)
✅ Responsive Design
✅ Docker Support
✅ API Documentation (Swagger at /api-docs)
