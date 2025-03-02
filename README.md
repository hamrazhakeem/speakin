# 🌟 SpeakIn - Language Learning Platform

<div align="center">

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)](https://github.com/yourusername/speakin)

[![Tech Stack](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tech Stack](https://img.shields.io/badge/Backend-Django-green?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![Tech Stack](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tech Stack](https://img.shields.io/badge/Architecture-Microservices-orange?style=for-the-badge&logo=kubernetes)](https://microservices.io/)

</div>

## 📸 Project Screenshots

<div align="center" style="display: flex; justify-content: space-between;">
  <img src="./assets/images/landing.png" alt="Landing Page" width="32%" style="margin-right: 1%;"/>
  <img src="./assets/images/home.png" alt="Home Page" width="32%" style="margin-right: 1%;"/>
  <img src="./assets/images/profile.png" alt="Profile Page" width="32%"/>
</div>

## 🎯 About SpeakIn

SpeakIn is a robust language learning platform that connects learners with expert tutors through 1-on-1 video sessions. Our platform ensures quality education by verifying native speakers through government ID and non-native tutors through their language certifications.

### 🌟 Key Features

- **Video Learning Platform**
  - 1-on-1 video sessions powered by Daily.co
  - Session scheduling and management
  - Interactive learning environment

- **Real-time Communication**
  - Instant messaging between students and tutors
  - Real-time notifications for messages

- **Authentication & Security**
  - Secure Google OAuth 2.0 integration
  - Email/Password authentication
  - JWT-based session management

- **Tutor Verification System**
  - Native speaker government ID verification
  - Language certification validation for non-native tutors
  - Detailed tutor profiles

- **User Management**
  - Secure authentication system
  - User profiles and progress tracking
  - Session history and bookings

- **Payment System**
  - Secure payment processing with Stripe
  - Tutor payouts via Stripe Connect
  - Complete payment history

## 🗂️ Project Structure

```
speakin/
├── client/                          # Frontend React Application
│   ├── src/                         # Source directory
│   │   ├── api/                     # API services
│   │   ├── assets/                  # Static assets
│   │   ├── components/              # Reusable components
│   │   ├── hooks/                   # Custom hooks
│   │   ├── pages/                   # Page components
│   │   ├── providers/               # React providers
│   │   ├── redux/                   # Redux Store
│   │   ├── routes/                  # Route configurations
│   │   ├── App.jsx                  # Root component with router setup
│   │   ├── index.css                # Global styles
│   │   └── main.jsx                 # Application entry point
│   ├── .gitignore                   # Git ignore rules
│   ├── README.md                    # Frontend documentation
│   ├── eslint.config.js             # ESLint configuration
│   ├── index.html                   # Entry HTML file
│   ├── package-lock.json            # Locked dependencies
│   ├── package.json                 # Project dependencies and scripts
│   ├── postcss.config.js            # PostCSS configuration
│   ├── tailwind.config.js           # Tailwind CSS configuration
│   └── vite.config.js               # Vite bundler configuration
│
├── server/                          # Backend Microservices
│   ├── api_gateway/                 # API Gateway Service
│   │   ├── api_gateway/             # Main project directory
│   │   │   ├── __init__.py
│   │   │   ├── asgi.py
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   └── wsgi.py
│   │   ├── auth/                    # Authentication Module
│   │   │   └── authentication.py
│   │   ├── message/                 # Message Routing Module
│   │   ├── payment/                 # Payment Routing Module
│   │   ├── session/                 # Video Session Routing Module
│   │   ├── user/                    # User Routing Module
│   │   ├── .dockerignore            # Docker ignore rules
│   │   ├── Dockerfile               # Container configuration
│   │   ├── db.sqlite3               # SQLite database (for development)
│   │   ├── manage.py                # Django management script
│   │   └── requirements.txt         # Python dependencies
│   │
│   ├── k8s/                         # Kubernetes Manifests
│   │   ├── development/             # Development environment
│   │   │   ├── configmaps/          # Environment configurations
│   │   │   ├── deployments/         # Service deployments
│   │   │   ├── statefulsets/        # StatefulSets
│   │   │   ├── ingress.yaml         # Ingress rules
│   │   │   └── namespace.yaml       # Namespace
│   │   └── production/              # Production environment
│   │       ├── configmaps/          # Environment configurations
│   │       ├── deployments/         # Service deployments
│   │       ├── hpa/                 # Horizontal Pod Autoscaler
│   │       ├── statefulsets/        # StatefulSets
│   │       ├── ebs-sc.yaml          # EBS Storage Class
│   │       ├── ingress.yaml         # Ingress rules
│   │       └── namespace.yaml       # Namespace
│   │
│   ├── message_service/             # Message Service
│   │   ├── message/                 # Message app 
│   │   ├── message_service/         # Main project directory
│   │   │   ├── __init__.py
│   │   │   ├── asgi.py
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   └── wsgi.py
│   │   ├── .dockerignore            # Docker ignore rules
│   │   ├── Dockerfile               # Container configuration
│   │   ├── __init__.py              # init file
│   │   ├── manage.py                # Django management script
│   │   └── requirements.txt         # Python dependencies
│   │
│   ├── payment_service/             # Payment Service
│   │   ├── payment/                 # Payment app 
│   │   ├── payment_service/         # Main project directory
│   │   │   ├── __init__.py
│   │   │   ├── asgi.py
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   └── wsgi.py
│   │   ├── .dockerignore            # Docker ignore rules
│   │   ├── Dockerfile               # Container configuration
│   │   ├── manage.py                # Django management script
│   │   └── requirements.txt         # Python dependencies
│   │
│   ├── session_service/             # Session Service
│   │   ├── bookings/                # Bookings app 
│   │   ├── protos/                  # Grpc protos
│   │   ├── services/                # RabbitMQ Module
│   │   ├── session_service/         # Main project directory
│   │   │   ├── __init__.py
│   │   │   ├── asgi.py
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   └── wsgi.py
│   │   ├── .dockerignore            # Docker ignore rules
│   │   ├── Dockerfile               # Container configuration
│   │   ├── manage.py                # Django management script
│   │   └── requirements.txt         # Python dependencies
│   │
│   ├── user_service/                # User Service
│   │   ├── protos/                  # Grpc protos
│   │   ├── user_service/            # Main project directory
│   │   │   ├── __init__.py
│   │   │   ├── asgi.py
│   │   │   ├── settings.py
│   │   │   ├── urls.py
│   │   │   └── wsgi.py
│   │   ├── users/                   # Users app 
│   │   ├── .dockerignore            # Docker ignore rules
│   │   ├── db.sqlite3               # SQLite database (for development)
│   │   ├── Dockerfile               # Container configuration
│   │   ├── manage.py                # Django management script
│   │   └── requirements.txt         # Python dependencies
│   │
│   ├── .gitignore                   # Git ignore rules
│   └── docker-compose.yml           # Docker composition file
```

## 🚀 Getting Started

### Prerequisites
- Docker
- Docker Compose
- Django (for local development)

### Running Backend Services

1. Pull the microservice images:
```powershell
docker pull hamrazhakeem/speakin-api-gateway:latest
docker pull hamrazhakeem/speakin-user-service:latest
docker pull hamrazhakeem/speakin-session-service:latest
docker pull hamrazhakeem/speakin-message-service:latest
docker pull hamrazhakeem/speakin-payment-service:latest
```

2. Start the services:
```powershell
cd server
docker-compose up -d
```

### Running Frontend Locally

1. Clone the repository and install dependencies:
```powershell
git clone <repository-url>
cd client
npm install
```

2. Start the development server:
```powershell
npm run dev
```

3. Access the application:
- Frontend: http://localhost:5173
- API Gateway: http://localhost:8000

## 🔧 Tech Stack

- **Frontend**
  - React with Vite
  - TailwindCSS
  - Redux Toolkit
  - Daily.co SDK
  - Socket.IO Client (for real-time features)

- **Backend**
  - Django REST Framework
  - PostgreSQL
  - Redis Cache
  - Celery
  - Django Channels

- **Infrastructure**
  - Docker
  - Kubernetes
  - AWS Application Load Balancer
  - AWS Services

## 👥 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📬 Contact

For support or queries, reach out to us at [support@speakin.com](mailto:support@speakin.com)

---

<div align="center">
  <sub>Built with ❤️ for language learners worldwide</sub>
</div>