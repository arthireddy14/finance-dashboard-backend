# Finance Dashboard Backend

## 📌 Overview
This project is a backend system for a finance dashboard where users can manage financial records based on their roles.

---

## 🚀 Features

### 🔐 Authentication
- User registration
- User login with JWT authentication

### 👥 Role-Based Access Control
- Viewer: Can view records and summary
- Analyst: Can view records and analytics
- Admin: Full access (create, update, delete records)

---

## 💰 Financial Records
- Create financial records (Admin only)
- View records (All users)
- Update records (Admin only)
- Delete records (Admin only)
- Filter records by type and category

---

## 📊 Dashboard APIs
- Total income
- Total expense
- Net balance
- Total records count

---

## 🛠️ Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

---

## ⚙️ Setup Instructions

1. Clone the repository
2. Install dependencies:
   npm install

3. Create `.env` file:
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_secret_key

4. Run the server:
   node server.js

---

## 📡 API Endpoints

### Auth
- POST /api/users/register
- POST /api/users/login

### Records
- POST /api/records (Admin)
- GET /api/records (All users)
- PUT /api/records/:id (Admin)
- DELETE /api/records/:id (Admin)
- GET /api/records/summary (All users)

---

## 🔐 Authorization
JWT token must be passed in headers:
Authorization: <token>

---

## 📌 Notes
- Each user can only access their own records
- Role-based access is enforced using middleware