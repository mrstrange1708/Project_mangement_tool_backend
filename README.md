# TaskLoad - Project Management System

A full-stack project management system built with Node.js, Express, MongoDB, and JWT authentication.

## 🚀 Features

- **Complete Authentication System**
  - User registration and login
  - JWT token-based authentication
  - Password hashing with bcryptjs
  - Protected routes

- **Project Management**
  - Create, read, update, and delete projects
  - User-specific projects (each user sees only their projects)
  - Project filtering by status and priority
  - Comprehensive project data structure

- **Data Structure**
  - Projects with title, description, priority, status
  - Start/end dates and times
  - Deadline tracking
  - User association

## 🛠 Tech Stack

- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **CORS**: Cross-origin resource sharing enabled

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaskLoad_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start MongoDB**
   - Local MongoDB: `mongod`
   - Or use MongoDB Atlas (cloud)

4. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The server will start on `http://localhost:3001`

## 📚 API Documentation

### Authentication Endpoints

#### POST `/api/auth/signup`
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

#### POST `/api/auth/login`
Login with existing credentials.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user_id",
      "email": "user@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

#### GET `/api/auth/me`
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

### Project Endpoints

All project endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

#### GET `/api/projects`
Get all projects for the authenticated user.

**Response:**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "project_id",
      "id": "uuid_string",
      "title": "Project Title",
      "description": "Project Description",
      "priority": "Medium",
      "status": "current",
      "start": "2024-01-01T00:00:00.000Z",
      "starttime": "09:00",
      "end": "2024-01-02T00:00:00.000Z",
      "endtime": "17:00",
      "deadline": "2024-01-15",
      "user": "user_id",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST `/api/projects`
Create a new project.

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description",
  "priority": "Medium",
  "status": "current",
  "start": "2024-01-01T00:00:00.000Z",
  "starttime": "09:00",
  "end": "2024-01-02T00:00:00.000Z",
  "endtime": "17:00",
  "deadline": "2024-01-15"
}
```

#### PUT `/api/projects/:id`
Update an existing project.

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Project Title",
  "status": "completed"
}
```

#### DELETE `/api/projects/:id`
Delete a project.

#### GET `/api/projects/status/:status`
Get projects filtered by status (`current` or `completed`).

#### GET `/api/projects/priority/:priority`
Get projects filtered by priority (`Easy`, `Medium`, or `Hard`).

## 🔐 Authentication

The API uses JWT tokens for authentication. After login/signup, you'll receive a token that must be included in the Authorization header for all protected routes:

```
Authorization: Bearer <your_jwt_token>
```

## 📊 Project Data Structure

Each project contains the following fields:

```json
{
  "id": "string (uuid)",
  "title": "string (max 100 chars)",
  "description": "string (max 500 chars)",
  "priority": "Easy | Medium | Hard",
  "status": "current | completed",
  "start": "ISO Date String",
  "starttime": "string (HH:MM format)",
  "end": "ISO Date String",
  "endtime": "string (HH:MM format)",
  "deadline": "YYYY-MM-DD string",
  "user": "ObjectId (references User)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 🧪 Testing the API

You can test the API using tools like Postman, curl, or any HTTP client.

### Example curl commands:

1. **Register a user:**
   ```bash
       curl -X POST http://localhost:3001/api/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

2. **Login:**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Create a project (replace TOKEN with your JWT token):**
   ```bash
   curl -X POST http://localhost:3001/api/projects \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TOKEN" \
     -d '{
       "title":"My First Project",
       "description":"This is a test project",
       "priority":"Medium",
       "status":"current",
       "start":"2024-01-01T00:00:00.000Z",
       "starttime":"09:00",
       "end":"2024-01-02T00:00:00.000Z",
       "endtime":"17:00",
       "deadline":"2024-01-15"
     }'
   ```

4. **Get all projects:**
   ```bash
   curl -X GET http://localhost:3001/api/projects \
     -H "Authorization: Bearer TOKEN"
   ```

## 🚨 Error Handling

The API returns consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Validation errors (if any)
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not Found
- `500`: Internal Server Error

## 🔧 Development

### Project Structure
```
TaskLoad_backend/
├── models/
│   ├── User.js
│   └── Project.js
├── routes/
│   ├── auth.js
│   └── projects.js
├── middleware/
│   └── auth.js
├── server.js
├── package.json
├── config.env
└── README.md
```

### Available Scripts
- `npm start`: Start the production server
- `npm run dev`: Start the development server with nodemon

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication
- Input validation and sanitization
- CORS enabled for cross-origin requests
- User-specific data isolation

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository. 
