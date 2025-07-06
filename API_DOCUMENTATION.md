# TaskLoad API Documentation

## 🔗 Base URL
```
http://localhost:3001/api
```

## 🔐 Authentication

All project endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

---

## 👤 Authentication Endpoints

### POST `/auth/signup`
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

### POST `/auth/login`
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

### GET `/auth/me`
Get current user information (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

---

## 📋 Project Endpoints

### GET `/projects`
Get all projects with advanced filtering, pagination, and search.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `status` (optional): Filter by status (`current` or `completed`)
- `priority` (optional): Filter by priority (`Easy`, `Medium`, or `Hard`)
- `from` (optional): Filter projects from this date (ISO format)
- `to` (optional): Filter projects to this date (ISO format)
- `search` (optional): Search in title and description
- `sortBy` (optional): Sort field (`title`, `priority`, `status`, `deadline`, `createdAt`)
- `sortOrder` (optional): Sort order (`asc` or `desc`)

**Example Requests:**
```bash
# Get all projects (paginated)
GET /api/projects

# Get current projects only
GET /api/projects?status=current

# Get high priority projects
GET /api/projects?priority=Hard

# Search for projects
GET /api/projects?search=website

# Date range filtering
GET /api/projects?from=2024-01-01&to=2024-12-31

# Combined filters with pagination
GET /api/projects?status=current&priority=Medium&page=2&limit=5&sortBy=deadline&sortOrder=asc
```

**Response:**
```json
{
  "success": true,
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
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "filters": {
    "status": "current",
    "priority": "Medium",
    "from": null,
    "to": null,
    "search": null,
    "sortBy": "createdAt",
    "sortOrder": "desc"
  }
}
```

### POST `/projects`
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

### GET `/projects/:id`
Get a specific project by ID.

### PUT `/projects/:id`
Update an existing project.

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Project Title",
  "status": "completed"
}
```

### DELETE `/projects/:id`
Delete a project.

### GET `/projects/status/:status`
Get projects filtered by status (`current` or `completed`).

### GET `/projects/priority/:priority`
Get projects filtered by priority (`Easy`, `Medium`, or `Hard`).

### GET `/projects/stats/summary`
Get project statistics summary.

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 25,
    "current": 18,
    "completed": 7,
    "easy": 8,
    "medium": 12,
    "hard": 5
  }
}
```

---

## 🔍 Advanced Filtering Examples

### 1. Search and Filter
```bash
# Search for "website" projects that are current and medium priority
GET /api/projects?search=website&status=current&priority=Medium
```

### 2. Date Range Filtering
```bash
# Projects due between January and March 2024
GET /api/projects?from=2024-01-01&to=2024-03-31
```

### 3. Pagination with Sorting
```bash
# Get page 2 of projects, sorted by deadline (earliest first)
GET /api/projects?page=2&limit=5&sortBy=deadline&sortOrder=asc
```

### 4. Complex Filtering
```bash
# High priority current projects due this month, sorted by creation date
GET /api/projects?priority=Hard&status=current&from=2024-01-01&to=2024-01-31&sortBy=createdAt&sortOrder=desc
```

---

## 📊 Project Data Structure

Each project contains:

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

---

## 🚨 Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "type": "field",
      "value": "invalid_email",
      "msg": "Please enter a valid email",
      "path": "email",
      "location": "body"
    }
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Access denied. No token provided."
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Project not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Server error while fetching projects"
}
```

---

## 🧪 Testing Examples

### Using curl:

```bash
# 1. Register a user
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 2. Login and get token
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Create a project (replace TOKEN with your JWT token)
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

# 4. Get projects with filtering
curl -X GET "http://localhost:3001/api/projects?status=current&priority=Medium&page=1&limit=5" \
  -H "Authorization: Bearer TOKEN"

# 5. Get project statistics
curl -X GET http://localhost:3001/api/projects/stats/summary \
  -H "Authorization: Bearer TOKEN"
```

### Using JavaScript/Fetch:

```javascript
// Login and get token
const loginResponse = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
});

const { data: { token } } = await loginResponse.json();

// Get projects with advanced filtering
const projectsResponse = await fetch(
  'http://localhost:3001/api/projects?status=current&priority=Hard&page=1&limit=10&sortBy=deadline&sortOrder=asc',
  {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  }
);

const projects = await projectsResponse.json();
console.log(projects);
```

---

## 🎯 Frontend Integration Tips

1. **Store JWT Token**: Use localStorage or secure cookies
2. **Handle Token Expiry**: Implement automatic logout on 401 errors
3. **Pagination**: Use the pagination object for navigation
4. **Real-time Updates**: Implement polling or WebSocket for live updates
5. **Error Handling**: Show user-friendly error messages
6. **Loading States**: Show loading indicators during API calls

---

## 🔧 Rate Limiting & Security

- JWT tokens expire after 7 days
- Passwords are hashed with bcryptjs
- Input validation on all endpoints
- CORS enabled for cross-origin requests
- User-specific data isolation 