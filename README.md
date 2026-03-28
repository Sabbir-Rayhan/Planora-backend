# 🎉 Planora — Backend API

**A secure, scalable REST API for the Planora Event Management Platform**

[Live API](https://planora-backend-production-d7e8.up.railway.app/api/v1) • [Frontend Repo](https://github.com/Sabbir-Rayhan/Planora-frontend) • [Live Site](https://planora-frontend-orpin.vercel.app)

---

## 📌 Project Overview

Planora is a full-stack event management platform where users can create, manage, and participate in events. This repository contains the **backend REST API** built with Node.js, Express, Prisma ORM, and PostgreSQL.

---

## 🔗 Live URLs

| Service | URL |
|---------|-----|
| 🌐 Frontend Live | https://planora-frontend-orpin.vercel.app |
| 🚀 Backend API | https://planora-backend-production-d7e8.up.railway.app/api/v1 |
| 📁 Frontend Repo | https://github.com/Sabbir-Rayhan/Planora-frontend |
| 📁 Backend Repo | https://github.com/Sabbir-Rayhan/Planora-backend |

---

## 🔐 Admin Credentials
Email    : admin@planora.com
Password : Mahee@123


---

## 🛠️ Technology Stack

| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| TypeScript | Type safety |
| Express.js | REST API framework |
| Prisma ORM | Database management |
| PostgreSQL | Relational database |
| JWT | Authentication & authorization |
| Bcrypt | Password hashing |
| SSLCommerz | Payment gateway |
| Zod | Request validation |
| Neon | Cloud PostgreSQL hosting |
| Railway | Backend deployment |

---

## ✨ Features

### 🔐 Authentication
- User registration and login
- JWT access & refresh token system
- Password hashing with bcrypt
- Role-based access control (Admin / User)
- Cookie-based refresh token

### 📅 Event Management
- Create, read, update, delete events
- Public and Private event types
- Free and Paid events
- Featured event selection (Admin)
- Event status management (Upcoming, Ongoing, Completed, Cancelled)
- Search and filter events

### 👥 Participation System
- Join public free events instantly
- Pay to join public paid events
- Request to join private events
- Host approval/rejection system
- Participant banning system
- Leave event functionality

### 💌 Invitation System
- Organizers can invite users to events
- Accept/decline invitations
- Pay & accept for paid events

### ⭐ Review System
- Rate events (1-5 stars)
- Write, edit, delete reviews
- Average rating calculation

### 💳 Payment Integration
- SSLCommerz payment gateway
- Sandbox testing support
- Payment success/fail/cancel handling
- Payment history tracking

### 👑 Admin Features
- Manage all users (block/activate)
- Manage all events (feature/delete)
- View all payments and revenue
- Role management

---

## 📁 Project Structure

planora-backend/
├── prisma/
│   ├── schema/
│   │   ├── base.prisma       # Generator & datasource
│   │   ├── enums.prisma      # All enums
│   │   ├── user.prisma       # User model
│   │   ├── event.prisma      # Event model
│   │   ├── participation.prisma
│   │   ├── invitation.prisma
│   │   ├── review.prisma
│   │   └── payment.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── config/
│   │   │   └── env.ts        # Environment variables
│   │   ├── errorHelpers/
│   │   │   ├── AppError.ts   # Custom error class
│   │   │   └── handlePrismaErrors.ts
│   │   ├── lib/
│   │   │   └── prisma.ts     # Prisma client
│   │   ├── middleware/
│   │   │   ├── checkAuth.ts      # JWT auth middleware
│   │   │   ├── globalErrorHandler.ts
│   │   │   ├── notFound.ts
│   │   │   └── validateRequest.ts # Zod validation
│   │   ├── module/
│   │   │   ├── auth/         # Register, Login, Logout
│   │   │   ├── user/         # Profile, Admin user management
│   │   │   ├── event/        # Event CRUD
│   │   │   ├── participation/ # Join, Approve, Reject, Ban
│   │   │   ├── invitation/   # Send, Accept, Decline
│   │   │   ├── review/       # Create, Edit, Delete reviews
│   │   │   └── payment/      # SSLCommerz payment flow
│   │   ├── shared/
│   │   │   ├── catchAsync.ts # Async error wrapper
│   │   │   └── sendResponse.ts # Standardized response
│   │   └── utils/
│   │       ├── jwt.ts        # Token generation/verification
│   │       ├── cookie.ts     # Cookie utilities
│   │       └── seed.ts       # Admin seeder
│   ├── Routes/
│   │   └── index.ts          # All route registrations
│   ├── app.ts                # Express app setup
│   └── server.ts             # Server entry point
├── .env.example
├── package.json
└── tsconfig.json


---

## 🚀 API Endpoints

### Auth

POST   /api/v1/auth/register     Register new user
POST   /api/v1/auth/login        Login user
POST   /api/v1/auth/logout       Logout user


### Users

GET    /api/v1/users/me          Get my profile
PATCH  /api/v1/users/me          Update my profile
GET    /api/v1/users             Get all users (Admin)
PATCH  /api/v1/users/:id/status  Change user status (Admin)


### Events

GET    /api/v1/events            Get all events (with filters)
GET    /api/v1/events/:id        Get single event
POST   /api/v1/events            Create event
PATCH  /api/v1/events/:id        Update event
DELETE /api/v1/events/:id        Delete event
GET    /api/v1/events/my/events  Get my events
PATCH  /api/v1/events/:id/featured  Toggle featured (Admin)


### Participations

POST   /api/v1/participations/join/:eventId    Join event
DELETE /api/v1/participations/leave/:eventId   Leave event
GET    /api/v1/participations/my               My participations
GET    /api/v1/participations/event/:eventId   Event participants
PATCH  /api/v1/participations/approve/:id      Approve participant
PATCH  /api/v1/participations/reject/:id       Reject participant
PATCH  /api/v1/participations/ban/:id          Ban participant


### Invitations

POST   /api/v1/invitations                    Send invitation
GET    /api/v1/invitations/my                 My invitations
PATCH  /api/v1/invitations/accept/:id         Accept invitation
PATCH  /api/v1/invitations/decline/:id        Decline invitation


### Reviews

POST   /api/v1/reviews                  Create review
GET    /api/v1/reviews/event/:eventId   Get event reviews
GET    /api/v1/reviews/my               My reviews
PATCH  /api/v1/reviews/:id              Update review
DELETE /api/v1/reviews/:id              Delete review


### Payments

POST   /api/v1/payments/initiate   Initiate payment
POST   /api/v1/payments/success    Payment success callback
POST   /api/v1/payments/fail       Payment fail callback
POST   /api/v1/payments/cancel     Payment cancel callback
GET    /api/v1/payments/my         My payment history
GET    /api/v1/payments/all        All payments (Admin)


---

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js 18+
- PostgreSQL installed locally
- Git

### Step 1 — Clone the repository
bash
git clone https://github.com/Sabbir-Rayhan/Planora-backend.git
cd planora-backend


### Step 2 — Install dependencies
bash
npm install


### Step 3 — Setup environment variables

Create a `.env` file in the root:
env
PORT=5000
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/planora"
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12
NODE_ENV=development
SSL_STORE_ID=testbox
SSL_STORE_PASSWORD=qwerty
SSL_IS_LIVE=false
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000


### Step 4 — Run database migrations
bash
npx prisma migrate dev


### Step 5 — Generate Prisma client
bash
npx prisma generate


### Step 6 — Seed admin user
bash
npm run seed


### Step 7 — Start development server
bash
npm run dev


Server runs at: `http://localhost:5000`

### Admin Login Credentials

Email    : admin@planora.com
Password : admin123


---

## 🌍 Deployment

The backend is deployed on **Railway** with:
- **Database**: Neon PostgreSQL (cloud)
- **Environment**: Production Node.js

---

## 📝 Error Handling

All API responses follow a consistent format:
json
// Success
{
  "success": true,
  "message": "Operation successful",
  "data": { }
}

// Error
{
  "success": false,
  "message": "Error description"
}


---

Thank You

