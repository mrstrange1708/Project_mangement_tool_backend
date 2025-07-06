# MongoDB Atlas Quick Setup Guide

## 🚀 Get MongoDB Atlas Running in 5 Minutes

### Step 1: Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Click "Try Free" or "Sign Up"
3. Create account with email/password

### Step 2: Create Your First Cluster
1. Choose "FREE" tier (M0)
2. Select your preferred cloud provider (AWS/Google Cloud/Azure)
3. Choose a region close to you
4. Click "Create Cluster"

### Step 3: Set Up Database Access
1. In the left sidebar, click "Database Access"
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Create username: `taskload_user`
5. Create password: `TaskLoad2024!` (or your own secure password)
6. Select "Read and write to any database"
7. Click "Add User"

### Step 4: Set Up Network Access
1. In the left sidebar, click "Network Access"
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Your Connection String
1. Go back to "Database" in the sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string

### Step 6: Update Your Config
Replace the connection string in `config.env`:

```env
MONGODB_URI=mongodb+srv://taskload_user:TaskLoad2024!@cluster0.xxxxx.mongodb.net/taskload?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
NODE_ENV=development
```

**Important**: Replace `cluster0.xxxxx.mongodb.net` with your actual cluster URL from Step 5.

### Step 7: Restart Your Server
```bash
# Stop current server
pkill -f nodemon

# Start server again
npm run dev
```

### Step 8: Test It Works
```bash
# Test the API
npm test
```

## 🎯 What You'll See After Setup

✅ **Server logs will show**: "Connected to MongoDB"  
✅ **API calls will work**: No more timeout errors  
✅ **Database will be created**: `taskload` database with `users` and `projects` collections  

## 🔧 Troubleshooting

### Connection String Issues
- Make sure to replace `<password>` with your actual password
- Ensure the username and password match what you created
- Check that you've allowed network access from anywhere

### Still Getting Timeout Errors?
- Verify your cluster is fully deployed (takes 2-3 minutes)
- Check that your IP is allowed in Network Access
- Ensure the connection string is correct

## 📊 Your Database Structure

After setup, you'll have:
- **Database**: `taskload`
- **Collections**: 
  - `users` (email, hashed password, timestamps)
  - `projects` (all project fields with user reference)

## 🚀 Next Steps After Atlas Setup

1. **Test the API**: `npm test`
2. **Build Frontend**: Connect to your backend
3. **Deploy**: Push to production

Need help with any of these steps? Just let me know! 