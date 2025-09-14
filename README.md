# 🌱 EcoTrack - Energy Management & Carbon Footprint Platform

A comprehensive full-stack application that empowers communities to track energy consumption, reduce carbon footprints, and engage in sustainable practices through gamification and AI-powered insights.

## 🚀 Features

### Core Functionality
- **Real-time Energy Monitoring**: Track household energy consumption with detailed analytics
- **Carbon Footprint Calculation**: Automatic CO₂ emissions tracking based on regional carbon intensity
- **AI-Powered Recommendations**: Personalized energy-saving tips using Google Gemini AI
- **Bill Upload & OCR**: Upload electricity bills for automatic data extraction using Tesseract.js
- **3D Energy Garden Visualization**: Interactive 3D representation of community energy efficiency
- **Gamification System**: Points, achievements, challenges, and leaderboards
- **Green Marketplace**: Local sustainable product and service recommendations
- **Community Dashboard**: Neighborhood-wide energy statistics and comparisons

### Advanced Features
- **Smart Meter Integration**: Real-time energy consumption monitoring
- **Heat Map Analytics**: Identify peak consumption hours and patterns
- **Historical Data Visualization**: Daily, weekly, and monthly usage trends
- **Cost Analysis**: Financial impact tracking and savings potential
- **Achievement System**: Unlock badges for eco-friendly milestones
- **Community Challenges**: Collaborative energy-saving competitions
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** components for accessibility
- **React Router** for navigation
- **React Query** for data fetching
- **Three.js** for 3D visualizations
- **React Hook Form** with Zod validation
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Google Gemini AI** for chatbot responses
- **Tesseract.js** for OCR processing
- **Cloudinary** for image storage
- **Socket.io** for real-time updates
- **Multer** for file uploads
- **Bcryptjs** for password hashing
- **CORS** and **Helmet** for security

## 📁 Project Structure

```
Hackoholics/
├── frontend/                 # React TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── ui/         # Radix UI components
│   │   │   ├── BillUpload.tsx
│   │   │   ├── CarbonFootprint.tsx
│   │   │   ├── Chatbot.tsx
│   │   │   ├── EnergyGarden3D.tsx
│   │   │   ├── HeatMap.tsx
│   │   │   ├── TreeVisualization.tsx
│   │   │   └── ...
│   │   ├── pages/          # Main application pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── EnergyGarden.tsx
│   │   │   ├── Gamification.tsx
│   │   │   ├── GreenMarketPlace.tsx
│   │   │   ├── Community.tsx
│   │   │   └── ...
│   │   ├── contexts/       # React contexts
│   │   ├── hooks/          # Custom hooks
│   │   ├── data/           # Mock data and types
│   │   └── lib/            # Utility functions
│   ├── package.json
│   └── vite.config.ts
├── backend/                 # Node.js Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middlewares/    # Custom middlewares
│   │   ├── utils/          # Utility functions
│   │   └── db/             # Database connection
│   ├── uploads/            # File upload directory
│   ├── package.json
│   └── app.js
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Hackoholics
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/ecotrack
   JWT_SECRET=your_jwt_secret_here
   GEMINI_API_KEY=your_gemini_api_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   CORS_ORIGIN=http://localhost:5173
   PORT=8000
   ```

5. **Start the Development Servers**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   npm run dev
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000

## 📊 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `POST /api/users/logout` - User logout

### Energy Management
- `GET /api/energy/consumption` - Get energy consumption data
- `POST /api/energy/consumption` - Add new consumption record
- `GET /api/energy/recommendations` - Get AI recommendations

### Household Management
- `GET /api/households` - Get household data
- `POST /api/households` - Create household
- `PUT /api/households/:id` - Update household

### OCR & Bill Processing
- `POST /api/ocr/upload` - Upload bill image for OCR processing
- `GET /api/ocr/results/:id` - Get OCR results

### Chatbot
- `POST /api/chatbot/message` - Send message to AI chatbot

### Marketplace
- `POST /api/marketplace/recommend` - Get vendor recommendations
- `GET /api/marketplace/insights` - Get AI insights
- `GET /api/marketplace/trending` - Get trending products

## 🎮 Gamification Features

### Points System
- Earn points for energy savings
- Bonus points for streaks and achievements
- Community challenges and competitions

### Achievements
- Energy Saver badges
- Carbon Footprint reduction milestones
- Community participation rewards

### Leaderboards
- Daily, weekly, and monthly rankings
- Neighborhood-wide competitions
- Personal progress tracking

## 🌍 Environmental Impact

### Carbon Footprint Tracking
- Real-time CO₂ emissions calculation
- Regional carbon intensity integration
- Historical impact visualization

### Community Benefits
- Neighborhood energy efficiency metrics
- Collective environmental impact
- Social engagement through challenges

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev          # Start with nodemon
npm start            # Start production server
```

### Database Management
The application uses MongoDB with the following main collections:
- `users` - User accounts and profiles
- `households` - Household information
- `energyconsumptions` - Energy usage records
- `achievements` - Gamification achievements
- `challenges` - Community challenges

## 🚀 Deployment

### Frontend Deployment (Vercel/Netlify)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting platform
3. Update API endpoints in production

### Backend Deployment (Railway/Heroku)
1. Set environment variables in your hosting platform
2. Deploy the backend directory
3. Ensure MongoDB connection is configured

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 🙏 Acknowledgments

- Google Gemini AI for intelligent recommendations
- Tesseract.js for OCR capabilities
- Three.js for 3D visualizations
- Radix UI for accessible components
- The open-source community for various libraries and tools

## 📞 Support

For support, email aayush.shah23@spit.ac.in or create an issue in the repository.

---

**Built with ❤️ by Team Hackoholics for a sustainable future** 🌱
