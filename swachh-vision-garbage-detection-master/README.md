# 🧹 Swachh Vision - AI Garbage Detection System

A comprehensive full-stack web application that leverages AI and computer vision to detect garbage in images and videos, contributing to the Swachh Bharat Mission's goal of a cleaner India.

## 🌟 Features

### 🤖 AI-Powered Detection
- **Image Detection**: Upload images for instant garbage detection using YOLOv8
- **Video Processing**: Analyze videos for garbage detection with background processing
- **Live Webcam Detection**: Real-time garbage detection using webcam feed
- **Smart Classification**: Classifies cleanliness levels (LOW, MEDIUM, HIGH)

### 📊 Analytics & Dashboard
- **Real-time Statistics**: Track detection metrics and trends
- **Interactive Charts**: Visualize data with Recharts
- **Timeline Analysis**: Daily, weekly, and monthly detection patterns
- **Heatmap Insights**: Hourly and weekly detection patterns
- **Garbage Type Analysis**: Breakdown of detected garbage categories

### 🚨 Alert System
- **Email Notifications**: Automatic alerts for high garbage levels
- **Alert Management**: View, filter, and manage alert history
- **Customizable Thresholds**: Set alert levels and cooldown periods
- **Test Functionality**: Send test emails to verify configuration

### 👤 User Management
- **Secure Authentication**: JWT-based login system
- **Profile Management**: Update user information and password
- **Role-Based Access**: Admin and user roles
- **Session Management**: Secure token handling with refresh support

## 🏗️ Architecture

### Backend (Flask)
- **Framework**: Flask with Flask-RESTful
- **Database**: PostgreSQL with SQLAlchemy ORM
- **Authentication**: JWT with Flask-JWT-Extended
- **Background Tasks**: Celery with Redis
- **ML Integration**: YOLOv8 via Ultralytics
- **Email Service**: SMTP-based notifications

### Frontend (React)
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with Swachh Bharat theme
- **Charts**: Recharts for data visualization
- **Animations**: Framer Motion
- **Icons**: Heroicons
- **State Management**: React Context API

### ML Pipeline
- **Model**: YOLOv8 (pre-trained and custom)
- **Processing**: OpenCV for image/video handling
- **Detection**: Real-time and batch processing
- **Results**: JSON output with bounding boxes and confidence scores

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker & Docker Compose (optional)

### Using Docker Compose (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd swachh-vision
   ```

2. **Start all services**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health: http://localhost:5000/api/health

### Manual Setup

#### Backend Setup

1. **Install Python dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Initialize database**
   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

4. **Start the backend**
   ```bash
   python app.py
   ```

#### Frontend Setup

1. **Install Node.js dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```

#### Database Setup

1. **Install PostgreSQL**
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib
   
   # On macOS
   brew install postgresql
   ```

2. **Create database**
   ```sql
   CREATE DATABASE swachh_vision;
   CREATE USER swachh_user WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE swachh_vision TO swachh_user;
   ```

#### Redis Setup

1. **Install Redis**
   ```bash
   # On Ubuntu/Debian
   sudo apt-get install redis-server
   
   # On macOS
   brew install redis
   ```

2. **Start Redis**
   ```bash
   redis-server
   ```

## 📁 Project Structure

```
swachh-vision/
├── backend/                    # Flask backend application
│   ├── app.py                 # Main Flask application
│   ├── config.py              # Configuration settings
│   ├── models/                # Database models
│   ├── routes/                # API endpoints
│   ├── services/              # Business logic
│   ├── extensions.py          # Flask extensions
│   ├── requirements.txt       # Python dependencies
│   └── Dockerfile            # Backend Docker configuration
├── frontend/                  # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── pages/            # Page components
│   │   ├── contexts/         # React contexts
│   │   ├── services/         # API services
│   │   └── App.jsx           # Main App component
│   ├── public/               # Static assets
│   ├── package.json          # Node.js dependencies
│   └── Dockerfile           # Frontend Docker configuration
├── garbage_detection/        # Existing ML implementation
│   ├── scripts/              # Detection scripts
│   ├── models/               # Trained models
│   └── yolov8n.pt           # YOLO model
├── docker-compose.yml        # Docker Compose configuration
└── README.md                # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/swachh_vision

# Redis
REDIS_URL=redis://localhost:6379/0

# JWT
SECRET_KEY=your-secret-key
JWT_SECRET_KEY=your-jwt-secret-key

# Email
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000
```

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Detection
- `POST /api/detect/image` - Detect garbage in image
- `POST /api/detect/video` - Process video for detection
- `GET /api/detect/detections` - Get detection history
- `POST /api/detect/live` - Start live detection
- `POST /api/detect/frame` - Process single frame

### Alerts
- `GET /api/alerts` - Get alerts
- `DELETE /api/alerts/:id` - Delete alert
- `POST /api/alerts/test` - Send test email
- `GET /api/alerts/stats` - Get alert statistics

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/timeline` - Get timeline data
- `GET /api/dashboard/heatmap` - Get heatmap data
- `GET /api/dashboard/garbage-types` - Get garbage type statistics

## 🎨 Design System

### Colors (Swachh Bharat Inspired)
- **Saffron**: #FF9933
- **White**: #FFFFFF  
- **Green**: #138808
- **Navy Blue**: #000080

### Typography
- **Font Family**: Inter
- **Headings**: Bold weight
- **Body**: Regular weight
- **UI Elements**: Medium weight

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 📈 Performance

### Optimization Features
- **Lazy Loading**: Components and routes
- **Image Optimization**: WebP support
- **Caching**: Redis for session and task storage
- **Background Processing**: Celery for video processing
- **Database Indexing**: Optimized queries

### Monitoring
- **Health Checks**: Docker health checks
- **Logging**: Structured logging
- **Error Tracking**: Comprehensive error handling
- **Performance Metrics**: Request timing

## 🔒 Security

### Implemented Measures
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Werkzeug security
- **CORS Protection**: Flask-CORS
- **Input Validation**: Marshmallow schemas
- **SQL Injection Prevention**: SQLAlchemy ORM
- **File Upload Security**: Type and size validation

## 🚀 Deployment

### Production Deployment

1. **Build Docker images**
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
   ```

2. **Deploy with production profile**
   ```bash
   docker-compose --profile production up -d
   ```

3. **Set up SSL certificates**
   ```bash
   # Place SSL certificates in nginx/ssl/
   ```

### Environment-Specific Configs
- **Development**: Hot reload, debug mode
- **Testing**: In-memory database, test data
- **Production**: Optimized builds, SSL, monitoring

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Swachh Bharat Mission** - Inspiration for this project
- **Ultralytics** - YOLOv8 implementation
- **Flask Community** - Excellent web framework
- **React Team** - Amazing UI library
- **Open Source Community** - Tools and libraries

## 📞 Support

For support, please email support@swachhvision.com or create an issue on GitHub.

---

**🧹 Made with ❤️ for a cleaner India**
