# EcoConnect Backend - Neighborhood Energy Tracker

A robust backend system for tracking neighborhood energy consumption, providing AI-powered recommendations, and fostering community engagement through gamification.

## 🚀 Features

### Core Functionality
- **Real-time Energy Data Integration** - OAuth-based utility API connections with smart meter data ingestion
- **AI Recommendation Engine** - Personalized energy-saving suggestions based on usage patterns
- **Gamification System** - Points, achievements, challenges, and community leaderboards
- **Data Processing Pipeline** - Real-time data normalization, anomaly detection, and trend analysis
- **Caching System** - Redis-based caching for improved performance

### Key Components
- **Authentication & Authorization** - JWT-based auth with OAuth integration
- **Energy Data Management** - Comprehensive energy consumption tracking and analysis
- **Recommendation System** - AI-driven personalized recommendations
- **Community Features** - Neighborhood management and social features
- **Analytics & Reporting** - Carbon footprint tracking and energy efficiency metrics

## 🏗️ Architecture

```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   ├── models/              # Database models
│   ├── routes/              # API routes
│   ├── services/            # Business logic
│   ├── middlewares/         # Custom middlewares
│   ├── utils/               # Utility functions
│   └── db/                  # Database configuration
├── mock-utility-api.js      # Mock utility API server
└── package.json
```

## 🛠️ Technology Stack

- **Runtime**: Node.js with ES6+ modules
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Cache**: Redis
- **Authentication**: JWT with Passport.js
- **File Upload**: Cloudinary
- **Security**: Helmet, CORS, Rate Limiting
- **Monitoring**: Morgan logging
- **Scheduling**: Node-cron

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd EcoConnect/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Start required services**
   ```bash
   # Start MongoDB
   mongod
   
   # Start Redis (optional but recommended)
   redis-server
   ```

5. **Start the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Start Mock Utility API (for testing)**
   ```bash
   node mock-utility-api.js
   ```

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `env.example`:

```env
# Server
NODE_ENV=development
PORT=8000
CORS_ORIGIN=http://localhost:3000

# Database
MONGO_URI=mongodb://localhost:27017
DB_NAME=eco

# JWT
ACCESS_TOKEN_SECRET=your_secret_here
REFRESH_TOKEN_SECRET=your_refresh_secret_here

# Redis (optional)
REDIS_URL=redis://localhost:6379

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Database Models

- **User** - User accounts with gamification data
- **EnergyData** - Energy consumption records
- **Neighborhood** - Community management
- **Challenge** - Gamification challenges
- **Achievement** - User achievements
- **Recommendation** - AI-generated recommendations

## 📡 API Endpoints

### Authentication
```
POST /api/v1/auth/register     - User registration
POST /api/v1/auth/login        - User login
POST /api/v1/auth/logout       - User logout
POST /api/v1/auth/refresh-token - Refresh access token
GET  /api/v1/auth/current-user - Get current user
```

### Energy Data
```
GET  /api/v1/energy/consumption - Get energy consumption data
GET  /api/v1/energy/summary     - Get energy summary
GET  /api/v1/energy/carbon-footprint - Get carbon footprint
GET  /api/v1/energy/trends      - Get energy trends
POST /api/v1/energy/sync        - Sync utility data
POST /api/v1/energy/manual-entry - Add manual energy entry
```

### Recommendations
```
POST /api/v1/recommendations/generate - Generate AI recommendations
GET  /api/v1/recommendations          - Get user recommendations
GET  /api/v1/recommendations/stats    - Get recommendation statistics
PATCH /api/v1/recommendations/:id/view - Mark as viewed
PATCH /api/v1/recommendations/:id/start - Start implementation
```

## 🔄 Data Flow

1. **Data Ingestion**
   - Utility APIs → Data Normalization → Database Storage
   - Manual Entry → Validation → Database Storage

2. **Processing Pipeline**
   - Real-time Processing → Anomaly Detection → Cache Update
   - Scheduled Jobs → Statistics Calculation → Neighborhood Updates

3. **AI Recommendations**
   - User Data Analysis → Pattern Recognition → Personalized Suggestions
   - Feedback Loop → Model Improvement → Better Recommendations

4. **Gamification**
   - User Actions → Points Calculation → Achievement Checks
   - Community Challenges → Progress Tracking → Leaderboard Updates

## 🧪 Testing

### Mock Utility API

The included mock utility API provides realistic energy consumption data for testing:

```bash
# Start mock API on port 8001
node mock-utility-api.js

# Test endpoints
curl http://localhost:8001/health
curl http://localhost:8001/usage?start_date=2024-01-01&end_date=2024-01-07
```

### API Testing

```bash
# Health check
curl http://localhost:8000/health

# Register user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","fullName":"Test User"}'
```

## 📊 Monitoring & Performance

- **Logging**: Morgan for HTTP request logging
- **Caching**: Redis for frequently accessed data
- **Rate Limiting**: Prevents API abuse
- **Health Checks**: Built-in health monitoring
- **Error Handling**: Comprehensive error management

## 🔒 Security Features

- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based access control
- **Input Validation**: Request validation and sanitization
- **Rate Limiting**: API rate limiting
- **CORS**: Cross-origin resource sharing configuration
- **Helmet**: Security headers

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set all required environment variables
2. **Database**: Use MongoDB Atlas or dedicated MongoDB instance
3. **Cache**: Use Redis Cloud or dedicated Redis instance
4. **File Storage**: Configure Cloudinary for production
5. **SSL**: Enable HTTPS in production
6. **Monitoring**: Set up application monitoring

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the API endpoints

---

**EcoConnect Backend** - Empowering communities to track, analyze, and reduce their energy consumption through technology and gamification.
