# Inventory & Order API

A RESTful Inventory and Order Management API built with **Node.js, Express.js, MongoDB, and Mongoose**.

The project provides secure user authentication, product management, product search/filtering, order creation, stock management, validation, centralized error handling, and protection against concurrent stock overselling.

---

## 1. Overview

This project implements a simple backend system for managing products and customer orders.

The API supports:

- User registration and login
- JWT-based authentication
- JWT storage using secure HttpOnly cookies
- Product creation, retrieval, updating, and deletion
- Product search and filtering
- Pagination
- Authenticated order creation
- Automatic stock deduction
- Multi-product orders
- Transaction-safe stock management
- Protection against overselling during concurrent orders
- User-specific order history
- Request validation using Zod
- Centralized API error handling
- Security headers using Helmet
- CORS configuration
- Postman API testing

The implementation follows a layered architecture separating:

- Routes
- Controllers
- Services
- Models
- Validators
- Middleware
- Utilities
- Configuration

---

## 2. Tech Stack

| Technology    | Purpose                       |
| ------------- | ----------------------------- |
| Node.js       | JavaScript runtime            |
| Express.js    | REST API framework            |
| MongoDB       | Database                      |
| Mongoose      | MongoDB ODM                   |
| JWT           | Authentication                |
| bcryptjs      | Password hashing              |
| Zod           | Request validation            |
| cookie-parser | Cookie parsing                |
| Helmet        | Security headers              |
| CORS          | Cross-origin request handling |
| Postman       | API testing                   |
| Nodemon       | Development server            |

---

## 3. Requirements

Before running the project, make sure the following are installed:

- Node.js 18+
- npm
- MongoDB Atlas or a MongoDB instance configured as a replica set
- Postman (recommended for API testing)

MongoDB transactions require a replica set. MongoDB Atlas supports transactions by default.

---

## 4. Project Structure

```text
inventory-order-api/
│
├── src/
│   ├── config/
│   │   └── env.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   └── order.controller.js
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   └── validate.middleware.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   └── order.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── product.routes.js
│   │   └── order.routes.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── product.service.js
│   │   └── order.service.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── product.validator.js
│   │   └── order.validator.js
│   │
│   ├── utils/
│   │   ├── api-error.js
│   │   ├── async-handler.js
│   │   └── jwt.js
│   │
│   ├── app.js
│   └── server.js
│
├── postman/
│   └── Inventory-Order-API.postman_collection.json
│
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

## 5. Architecture

The application follows a layered architecture:

```text
Client / Postman
       │
       ▼
    Routes
       │
       ▼
  Middleware
       │
       ├── Authentication
       ├── Validation
       └── Error Handling
       │
       ▼
  Controllers
       │
       ▼
   Services
       │
       ▼
    Models
       │
       ▼
    MongoDB
```

### Routes

Define API endpoints and attach the required middleware.

### Middleware

Responsible for cross-cutting concerns such as:

- Authentication
- Request validation
- Error handling

### Controllers

Handle HTTP-specific responsibilities:

- Reading request data
- Calling services
- Returning HTTP responses

### Services

Contain the application's business logic.

Examples:

- Creating products
- Searching products
- Creating orders
- Calculating order totals
- Updating stock

### Models

Define MongoDB/Mongoose schemas.

### Validators

Validate request bodies, parameters, and query strings using Zod.

---

## 6. Installation

Clone the repository:

```bash
git clone https://github.com/Saadmehmood1234/inventory-order-api
```

Navigate into the project:

```bash
cd inventory-order-api
```

Install dependencies:

```bash
npm install
```

---

## 7. Environment Variables

Create a `.env` file in the project root:

```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_db
PORT=5000
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

---

## 8. Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm start
```

The server will start at:

```text
http://localhost:5000
```
---

## 9. Authentication Flow

```text
POST /auth/login
       │
       ▼
Validate credentials
       │
       ▼
Find user
       │
       ▼
Compare password hash
       │
       ▼
Generate JWT
       │
       ▼
Set HttpOnly cookie
       │
       ▼
Return user information
```

For a protected request:

```text
Client
  │
  │ accessToken cookie
  ▼
Express
  │
  ▼
cookie-parser
  │
  ▼
Authentication Middleware
  │
  ├── No cookie → 401
  │
  ├── Invalid token → 401
  │
  └── Valid token
          │
          ▼
      req.user
          │
          ▼
      Controller
```

---

## 10. Order Creation Flow

```text
POST /orders
      │
      ▼
Authenticate User
      │
      ▼
Validate Request
      │
      ▼
Normalize Duplicate Products
      │
      ▼
Start MongoDB Transaction
      │
      ├── Find Product
      │
      ├── Validate Stock
      │
      ├── Atomically Decrease Stock
      │
      ├── Calculate Subtotal
      │
      └── Calculate Total
      │
      ▼
Create Order
      │
      ▼
Commit Transaction
      │
      ▼
Return Order
```

If any step fails, the transaction is rolled back.

---

## 11. Handling Two Users Ordering the Last Item (Question)

I would prevent this using an **atomic stock update or a locking mechanism**. The important part is that checking the stock and reducing it must happen atomically. If two users try to purchase the last available item at the same time, only one request can successfully decrement the stock; the other request will fail because the stock is no longer available. This guarantees that the stock never becomes negative and both orders cannot be confirmed.

---

## 12. AI Tools Used

| AI Tool | What I Used It For |
| ------- | ------------------ |
| ChatGPT | Used for generating and refining testing data, creating sample API request payloads, validating test scenarios, debugging development issues, understanding error messages, and refining the API implementation. |  |

---

## 13. Future Improvements

For a production system, the following could be added:

- Refresh token rotation
- Logout endpoint with cookie clearing
- Rate limiting
- CSRF protection depending on deployment architecture
- Role-based authorization
- Product ownership/administrator permissions
- Order cancellation
- Order status workflow
- Audit logging
- Redis-based rate limiting/cache
- Automated tests using Jest/Vitest/Supertest
- API documentation using OpenAPI/Swagger
- Docker configuration
- CI/CD pipeline
- Structured logging
- Monitoring and health checks
- Inventory reservation system for high-volume commerce

---

# 14. Author

**Saad Mehmood**

Full-Stack Developer
