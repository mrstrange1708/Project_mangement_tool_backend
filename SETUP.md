# TaskLoad Setup Guide

## 🚀 Quick Start

Your TaskLoad backend is now running on `http://localhost:3001`! 

✅ **Server Status**: Running  
✅ **Health Check**: Working  
✅ **API Structure**: Complete  
❌ **Database**: MongoDB needed

## 📊 Current Status

- **Server**: ✅ Running on port 3001
- **Health Endpoint**: ✅ `http://localhost:3001/api/health`
- **Authentication Routes**: ✅ Ready
- **Project Routes**: ✅ Ready
- **Database**: ❌ MongoDB connection needed

## 🗄️ MongoDB Setup Options

### Option 1: Install MongoDB Locally (Recommended)

#### On macOS (using Homebrew):
```bash
# Install Homebrew if you don't have it
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install MongoDB
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb/brew/mongodb-community

# Verify installation
mongod --version
```

#### On Windows:
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Run the installer
3. Start MongoDB service

#### On Linux (Ubuntu/Debian):
```bash
# Import MongoDB public GPG key
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -

# Create list file for MongoDB
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Update package database
sudo apt-get update

# Install MongoDB
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

### Option 2: Use MongoDB Atlas (Cloud - Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster (free tier)
4. Get your connection string
5. Update `config.env`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskload
   ```

### Option 3: Use Docker

```bash
# Pull MongoDB image
docker pull mongo

# Run MongoDB container
docker run -d -p 27017:27017 --name taskload-mongo mongo

# Verify it's running
docker ps
```

## 🔧 After MongoDB Setup

Once MongoDB is running, restart your server:

```bash
# Stop current server
pkill -f nodemon

# Start server again
npm run dev
```

## 🧪 Test Your Setup

After MongoDB is connected, test the complete API:

```bash
# Run the test suite
npm test
```

Or test manually:

```bash
# 1. Register a user
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 2. Login
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
```

## 📋 API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Projects (All Protected)
- `GET /api/projects` - Get all user projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get specific project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/status/:status` - Filter by status
- `GET /api/projects/priority/:priority` - Filter by priority

## 🔍 Troubleshooting

### Server won't start
- Check if port 3001 is available
- Verify all dependencies are installed: `npm install`

### MongoDB connection errors
- Ensure MongoDB is running
- Check connection string in `config.env`
- Verify MongoDB is accessible on port 27017

### Authentication errors
- Check JWT_SECRET in `config.env`
- Ensure token is included in Authorization header
- Verify token format: `Bearer <token>`

### Validation errors
- Check request body format
- Ensure all required fields are provided
- Verify data types and formats

## 🎯 Next Steps

1. **Install MongoDB** using one of the options above
2. **Test the API** with `npm test`
3. **Build Frontend** to connect to this backend
4. **Deploy** to production (update environment variables)

## 📞 Support

If you encounter any issues:
1. Check the server logs for error messages
2. Verify MongoDB connection
3. Test individual endpoints
4. Check the README.md for detailed API documentation 