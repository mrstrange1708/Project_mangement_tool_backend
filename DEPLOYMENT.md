# TaskLoad Deployment Guide

## 🚀 Production Deployment Options

### Option 1: Render (Recommended - Easy & Free)

#### Step 1: Prepare Your Code
1. Ensure your `package.json` has the correct start script:
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     }
   }
   ```

2. Create a `render.yaml` file for easy deployment:
   ```yaml
   services:
     - type: web
       name: taskload-backend
       env: node
       buildCommand: npm install
       startCommand: npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: MONGODB_URI
           sync: false
         - key: JWT_SECRET
           sync: false
         - key: PORT
           value: 10000
   ```

#### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) and sign up
2. Connect your GitHub repository
3. Create a new Web Service
4. Configure environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A strong secret key (generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`)
   - `NODE_ENV`: `production`
   - `PORT`: `10000` (Render's default)

#### Step 3: Deploy
- Render will automatically deploy your app
- Your API will be available at: `https://your-app-name.onrender.com`

### Option 2: Railway (Fast & Simple)

#### Step 1: Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Connect your GitHub repository
3. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`

#### Step 2: Deploy
- Railway will auto-deploy your app
- Get your production URL from the dashboard

### Option 3: Vercel (Serverless)

#### Step 1: Create `vercel.json`
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

#### Step 2: Deploy on Vercel
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Configure environment variables in Vercel dashboard

### Option 4: Heroku (Classic)

#### Step 1: Create `Procfile`
```
web: node server.js
```

#### Step 2: Deploy on Heroku
```bash
# Install Heroku CLI
brew install heroku/brew/heroku

# Login to Heroku
heroku login

# Create app
heroku create your-taskload-app

# Set environment variables
heroku config:set MONGODB_URI="your_mongodb_atlas_uri"
heroku config:set JWT_SECRET="your_jwt_secret"
heroku config:set NODE_ENV="production"

# Deploy
git push heroku main
```

---

## 🔧 Environment Variables for Production

### Required Variables
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskload?retryWrites=true&w=majority
JWT_SECRET=your-super-secure-jwt-secret-key-here
NODE_ENV=production
PORT=10000
```

### Generate Secure JWT Secret
```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🗄️ MongoDB Atlas Production Setup

### Step 1: Create Production Cluster
1. Go to MongoDB Atlas
2. Create a new cluster (M0 Free or paid tier)
3. Choose a region close to your deployment

### Step 2: Configure Security
1. **Database Access**: Create a dedicated user for production
2. **Network Access**: Allow access from anywhere (0.0.0.0/0) or specific IPs
3. **VPC Peering**: For advanced setups

### Step 3: Get Connection String
```
mongodb+srv://username:password@cluster.mongodb.net/taskload?retryWrites=true&w=majority
```

---

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit secrets to Git
- Use strong, unique secrets for each environment
- Rotate secrets regularly

### 2. CORS Configuration
Update your server.js for production:
```javascript
// Production CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));
```

### 3. Rate Limiting
Add rate limiting to prevent abuse:
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 4. Helmet for Security Headers
```bash
npm install helmet
```

```javascript
const helmet = require('helmet');
app.use(helmet());
```

---

## 📊 Monitoring & Logging

### 1. Add Logging
```bash
npm install winston
```

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}
```

### 2. Health Check Endpoint
```javascript
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});
```

---

## 🚀 Frontend Deployment

### Vercel (Recommended)
1. Push your frontend code to GitHub
2. Connect to Vercel
3. Set environment variables:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

### Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `build` or `dist`

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to Render
        uses: johnbeynon/render-deploy-action@v1.0.0
        with:
          service-id: ${{ secrets.RENDER_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
```

---

## 📈 Performance Optimization

### 1. Database Indexing
```javascript
// Add to your Project model
projectSchema.index({ user: 1, status: 1 });
projectSchema.index({ user: 1, priority: 1 });
projectSchema.index({ user: 1, deadline: 1 });
```

### 2. Compression
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### 3. Caching
```bash
npm install redis
```

```javascript
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

// Cache frequently accessed data
app.get('/api/projects/stats/summary', async (req, res) => {
  const cached = await client.get(`stats:${req.user._id}`);
  if (cached) {
    return res.json(JSON.parse(cached));
  }
  
  // ... fetch stats
  await client.setex(`stats:${req.user._id}`, 300, JSON.stringify(stats));
});
```

---

## 🎯 Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify MongoDB connection
- [ ] Check CORS configuration
- [ ] Test authentication flow
- [ ] Monitor error logs
- [ ] Set up monitoring/alerting
- [ ] Update frontend API URL
- [ ] Test in production environment

---

## 🆘 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string
   - Verify network access in Atlas
   - Check user credentials

2. **CORS Errors**
   - Update CORS origin in production
   - Check frontend URL

3. **JWT Token Issues**
   - Verify JWT_SECRET is set
   - Check token expiration

4. **Port Issues**
   - Use `process.env.PORT` in production
   - Don't hardcode port numbers

### Debug Commands
```bash
# Check environment variables
echo $MONGODB_URI

# Test MongoDB connection
node -e "
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected'))
  .catch(err => console.error(err));
"
```

---

## 📞 Support

If you encounter deployment issues:
1. Check platform-specific logs
2. Verify environment variables
3. Test locally with production config
4. Check MongoDB Atlas status
5. Review security group settings 