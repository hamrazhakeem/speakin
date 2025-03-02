# 🌟 SpeakIn - Language Learning Platform

<div align="center">

[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)](https://github.com/yourusername/speakin)

[![Tech Stack](https://img.shields.io/badge/Frontend-React-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tech Stack](https://img.shields.io/badge/Backend-Django-green?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![Tech Stack](https://img.shields.io/badge/Database-PostgreSQL-blue?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)
[![Tech Stack](https://img.shields.io/badge/Architecture-Microservices-orange?style=for-the-badge&logo=kubernetes)](https://microservices.io/)

</div>

## 📸 Project Screenshots

[Landing.png, Home.png, Profile.png]

## 🎯 About SpeakIn

SpeakIn is a robust language learning platform that connects learners with expert tutors through 1-on-1 video sessions. Our platform ensures quality education by verifying native speakers through government ID and non-native tutors through their language certifications.

### 🌟 Key Features

- **Video Learning Platform**
  - Seamless 1-on-1 video sessions with WebRTC
  - Real-time chat during sessions
  - Session scheduling and management

- **Tutor Verification System**
  - Native speaker government ID verification
  - Language certification validation for non-native tutors
  - Detailed tutor profiles and ratings

- **User Management**
  - Secure authentication system
  - User profiles and progress tracking
  - Session history and bookings

- **Payment Integration**
  - Secure payment processing
  - Session-based billing
  - Payment history

## 🗂️ Project Structure

```
speakin/
├── client/                 # Frontend React Application
│   ├── src/               # Source files
│   └── package.json       # Frontend dependencies
│
├── server/                # Backend Microservices
│   ├── api_gateway/       # API Gateway Service
│   ├── user_service/      # User Management Service
│   ├── session_service/   # Video Session Service
│   ├── message_service/   # Chat Service
│   ├── payment_service/   # Payment Processing Service
│   └── docker-compose.yml # Docker composition file
```

## 🚀 Getting Started

1. Pull the images:
```bash
docker pull speakin/api-gateway:latest
docker pull speakin/user-service:latest
docker pull speakin/session-service:latest
docker pull speakin/message-service:latest
docker pull speakin/payment-service:latest
docker pull speakin/client:latest
```

2. Start the services:
```bash
cd server
docker-compose up -d
```

3. Access the application:
- Frontend: http://localhost:3000
- API Gateway: http://localhost:8000

### Local Development Setup

1. Frontend:
```bash
cd client
npm install
npm run dev
```

2. Backend Services:
```bash
cd server
docker-compose up -d
```

## 🔧 Tech Stack

- **Frontend**
  - React with Vite
  - TailwindCSS
  - Redux Toolkit

- **Backend**
  - Django REST Framework
  - PostgreSQL
  - Redis Cache
  - Celery

- **Infrastructure**
  - Docker
  - Kubernetes
  - Nginx
  - AWS Services

## 👥 Contributing

We welcome contributions! Here's how you can help:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and development process.

## 📬 Contact

For support or queries, reach out to us at [support@speakin.com](mailto:support@speakin.com)

---

<div align="center">
  <sub>Built with ❤️ for language learners worldwide</sub>
</div>