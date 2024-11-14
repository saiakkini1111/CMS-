# 🎉 MERN Conference Management System

A full-featured conference management system that allows organizers to create events, manage attendees, handle registrations and payments, and collect feedback. This system provides secure authentication, role-based access, and smooth payment integration.

## 🌟 Features

- User Roles: Admin, Organizer, and Attendee with different access levels.
- Event Management: Create, edit, and delete events. View event details, manage attendees, and provide feedback.
- User Management: Manage user accounts (Admins only).
- Authentication: Secure login and signup with JWT-based authentication.
- Password Recovery: Forgot password, OTP verification, and password update flows.
- Notifications: Users receive event reminders and booking updates.
- Payment Integration: Stripe API for secure event bookings.
- Feedback System: Attendees can provide feedback for events.
- Mobile Responsive: Fully responsive design for all devices.
- Protected Routes: Access control based on user roles.

## 🛠 Tech Stack

Frontend: React, React Router, Axios, Tailwind CSS  
Backend: Node.js, Express  
Database: MongoDB  
Authentication: JWT, bcrypt.js  
Payment Gateway: Stripe API  
Testing: React Testing Library, Jest  

## ⚙️ Installation

Clone the repository and set up the environment variables:

```bash
git clone https://github.com/yourusername/CMSMern.git
cd CMSMern
```

Create a `.env` file in both the `frontend` and `backend` directories with the following content:

Backend `.env`:

```
MONGO_URI=your_mongodb_connection_string  
JWT_SECRET=your_jwt_secret_key  
STRIPE_SECRET_KEY=your_stripe_secret_key  
```

Frontend `.env`:

```
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key  
```

Install dependencies and run the application:

For frontend:

```bash
cd frontend  
npm install  
npm run dev  
```

For backend:

```bash
cd ../backend  
npm install  
npm run dev  
```

## 🔐 Authentication & Authorization

Public Routes: `/`, `/login`, `/signup`, `/forgot-password`, `/otp-verification`, `/update-password`

Protected Routes (Authenticated Users Only):

- `/all-users/dashboard`
- `/all-users/events`, `/all-users/events/:eventId`
- `/all-users/events/new`, `/all-users/events/edit/:eventId`
- `/all-users/attendee-management`
- `/all-users/myevents`
- `/all-users/notifications`
- `/all-users/users` (Admin only)
- `/all-users/booking-summary/:eventId`, `/all-users/payment/:bookingId`
- `/all-users/confirmation`
- `/all-users/events/feedback/:eventId`, `/all-users/events/view-feedback/:eventId`

## 🧪 Running Tests

To run the tests for the frontend:

```bash
cd frontend  
npm run test  
```

## 📂 Folder Structure

```
CMSMern  
├── frontend  
│   ├── public  
│   ├── src  
│   │   ├── components  
│   │   ├── pages  
│   │   ├── services  
│   │   ├── App.js  
│   │   ├── index.js  
│   └── .env  
├── backend  
│   ├── controllers  
│   ├── models  
│   ├── routes  
│   ├── middleware  
│   ├── utils  
│   ├── server.js  
│   └── .env  
├── .gitignore  
├── README.md  
└── package.json  
```



