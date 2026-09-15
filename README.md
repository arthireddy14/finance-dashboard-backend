# Finance Dashboard Backend

## 📌 Overview

A role-based backend system for a finance dashboard that enables organizations to manage, view, and analyze financial records securely.

The application uses **JWT authentication** and **Role-Based Access Control (RBAC)** to control access to financial operations and analytics.

---

## 🚀 Features

### 🔐 Authentication

* User registration
* User login with JWT authentication
* Password hashing using bcrypt
* Protected API routes
* JWT token validation
* Secure role-based authorization

### 👥 Role-Based Access Control

The system supports three roles:

| Role        | Access                                                         |
| ----------- | -------------------------------------------------------------- |
| **Viewer**  | View financial records and dashboard summary                   |
| **Analyst** | View records, summary, and advanced analytics                  |
| **Admin**   | Full access including creating, updating, and deleting records |

---

## 💰 Financial Records

* Create financial records — **Admin only**
* View financial records — **All authenticated users**
* Update financial records — **Admin only**
* Delete financial records — **Admin only**
* Filter records by type and category
* Pagination support
* Record sorting by date
* Track the user who created each record

Financial records are organization-wide. The `createdBy` field is used for audit and attribution purposes.

---

## 📊 Dashboard & Analytics APIs

### Dashboard Summary

* Total income
* Total expense
* Net balance
* Total records
* Income record count
* Expense record count

### Advanced Analytics

Available to **Analyst and Admin** roles:

* Monthly income and expense analysis
* Expense/income breakdown by category
* Aggregation-based financial analysis using MongoDB

---

## 🛠️ Tech Stack

* **Node.js**
* **Express.js**
* **MongoDB**
* **Mongoose**
* **JWT**
* **bcrypt**
* **REST APIs**
* **Render** — Deployment

---

## 🏗️ Project Structure

```text
finance-dashboard-backend/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── analyticsController.js
│   ├── recordController.js
│   └── userController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── authorizeRoles.js
│
├── models/
│   ├── Record.js
│   └── User.js
│
├── routes/
│   ├── analyticsRoutes.js
│   ├── recordRoutes.js
│   └── userRoutes.js
│
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/arthireddy14/finance-dashboard-backend.git
cd finance-dashboard-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```env
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
PORT=5000
```

> Never commit the `.env` file to GitHub.

### 4. Start the server

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

The local server runs on:

```text
http://localhost:5000
```

---

## 📡 API Endpoints

### 🔐 Authentication

| Method | Endpoint               | Access              |
| ------ | ---------------------- | ------------------- |
| POST   | `/api/users/register`  | Public              |
| POST   | `/api/users/login`     | Public              |
| GET    | `/api/users/protected` | Authenticated users |
| GET    | `/api/users/admin`     | Admin only          |

### 💰 Financial Records

| Method | Endpoint               | Access                   |
| ------ | ---------------------- | ------------------------ |
| POST   | `/api/records`         | Admin                    |
| GET    | `/api/records`         | Viewer / Analyst / Admin |
| PUT    | `/api/records/:id`     | Admin                    |
| DELETE | `/api/records/:id`     | Admin                    |
| GET    | `/api/records/summary` | Viewer / Analyst / Admin |

### 📊 Analytics

| Method | Endpoint                  | Access          |
| ------ | ------------------------- | --------------- |
| GET    | `/api/analytics/monthly`  | Analyst / Admin |
| GET    | `/api/analytics/category` | Analyst / Admin |

---

## 🔑 Authorization

Protected endpoints require a valid JWT token.

Pass the token in the request header:

```text
Authorization: Bearer <your_jwt_token>
```

Example:

```text
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
```

---

## 🔄 RBAC Access Flow

```text
Client
   │
   ▼
JWT Authentication
   │
   ▼
Role Authorization
   │
   ├── Viewer
   │     └── Read records + summary
   │
   ├── Analyst
   │     └── Read records + summary + analytics
   │
   └── Admin
         └── Full CRUD + summary + analytics
```

---

## 🔒 Security

* Passwords are hashed using bcrypt before storage.
* JWT tokens are used for authentication.
* Protected routes require valid authentication.
* Role-based middleware restricts sensitive operations.
* Users cannot assign themselves Admin or Analyst roles during registration.
* `.env` is excluded from version control.
* Input validation is applied to user and financial record data.

---

## 📌 Important Notes

* Financial records are organization-wide rather than restricted to the user who created them.
* `createdBy` identifies the user responsible for creating a record and provides audit attribution.
* Viewer users have read-only access.
* Analysts can access financial analytics but cannot modify records.
* Admin users can create, update, and delete financial records.
* Analytics are implemented using MongoDB aggregation pipelines.

---

## 🌐 Deployment

The backend is deployed using **Render**.

### Live API

```text
https://finance-dashboard-backend-1xqu.onrender.com
```

### Health Check

```text
https://finance-dashboard-backend-1xqu.onrender.com/api/health
```

The health endpoint confirms that the deployed backend is running successfully.

---

## 👩‍💻 Author

**Arthi Reddy**
