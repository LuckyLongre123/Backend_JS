# 🎥 Backend Chai or Code - YouTube Clone API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Status](https://img.shields.io/badge/status-In%20Development-orange.svg)

*A robust backend API for a YouTube-like video streaming platform built with modern JavaScript technologies*

</div>

---

## 📋 Table of Contents

- [🌟 Features](#-features)
- [🏗️ Project Structure](#️-project-structure)
- [🚀 Getting Started](#-getting-started)
- [⚙️ Installation](#️-installation)
- [🔧 Configuration](#-configuration)
- [📊 Database Models](#-database-models)
- [🔐 Authentication](#-authentication)
- [📡 API Endpoints](#-api-endpoints)
- [🛠️ Technologies Used](#️-technologies-used)
- [📝 Environment Variables](#-environment-variables)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)
- [👨‍💻 Author](#-author)

---

## 🌟 Features

### ✅ Current Features
- 🔐 **User Authentication** - JWT-based secure authentication system
- 👤 **User Management** - Complete user profile management
- 🎬 **Video Management** - Video upload, storage, and metadata handling
- 📊 **Database Integration** - MongoDB with Mongoose ODM
- 🔒 **Security** - Password hashing with bcrypt
- 🍪 **Session Management** - Cookie-based session handling
- 🌐 **CORS Support** - Cross-origin resource sharing enabled

### 🚧 Upcoming Features (In Development)
- 📹 Video streaming and playback
- 💬 Comments and likes system
- 🔔 Subscription management
- 📱 Mobile API optimization
- 🔍 Advanced search functionality
- 📈 Analytics and reporting

---

## 🏗️ Project Structure

```
backend-chai-or-code/
├── 📁 public/                    # Static files
│   └── 📁 temp/                  # Temporary file storage
├── 📁 src/                       # Source code
│   ├── 📁 controllers/           # Route controllers (Coming Soon)
│   ├── 📁 db/                    # Database configuration
│   │   └── 📄 index.js           # MongoDB connection
│   ├── 📁 middlewares/           # Custom middlewares (Coming Soon)
│   ├── 📁 models/                # Database models
│   │   ├── 📄 user.model.js      # User schema
│   │   └── 📄 video.model.js     # Video schema
│   ├── 📁 routes/                # API routes (Coming Soon)
│   ├── 📁 utils/                 # Utility functions
│   ├── 📄 app.js                 # Express app configuration
│   ├── 📄 constants.js           # Application constants
│   └── 📄 index.js               # Application entry point
├── 📄 .env.sample                # Environment variables template
├── 📄 .gitignore                 # Git ignore rules
├── 📄 package.json               # Dependencies and scripts
└── 📄 README.md                  # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed on your system:

- 📦 **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- 🗄️ **MongoDB** - [Download here](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://cloud.mongodb.com/)
- 📝 **Git** - [Download here](https://git-scm.com/)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd backend-chai-or-code
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.sample .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **🎉 You're ready to go!** The server will start on `http://localhost:8000`

---

## ⚙️ Installation

### Step-by-Step Installation Guide

1. **Clone the Repository**
   ```bash
   git clone <your-repository-url>
   cd backend-chai-or-code
   ```

2. **Install Node.js Dependencies**
   ```bash
   npm install
   ```

3. **Set Up MongoDB**
   - **Option A: Local MongoDB**
     - Install MongoDB Community Edition
     - Start MongoDB service
     - Use connection string: `mongodb://localhost:27017`
   
   - **Option B: MongoDB Atlas (Recommended)**
     - Create account at [MongoDB Atlas](https://cloud.mongodb.com/)
     - Create a new cluster
     - Get your connection string

4. **Configure Environment Variables**
   ```bash
   cp .env.sample .env
   ```
   Edit the `.env` file with your settings (see [Environment Variables](#-environment-variables) section)

5. **Start Development Server**
   ```bash
   npm run dev
   ```

---

## 🔧 Configuration

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=8000

# Database Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net

# CORS Configuration
CORS_ORIGIN=*

# JWT Configuration
ACCESS_TOKEN_SECRET=your-super-secret-access-token
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token
REFRESH_TOKEN_EXPIRY=10d
```

---

## 📊 Database Models

### 👤 User Model
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  fullName: String (required),
  avatar: String (required), // Cloudinary URL
  coverImage: String,        // Cloudinary URL
  watchHistory: [ObjectId],  // References to Video
  password: String (required, hashed),
  refreshToken: String,
  timestamps: true
}
```

### 🎬 Video Model
```javascript
{
  videoFile: String (required),    // Cloudinary URL
  thumbnail: String (required),    // Cloudinary URL
  title: String (required),
  description: String (required),
  duration: Number (required),
  views: Number (default: 0),
  isPublic: Boolean (default: true),
  owner: ObjectId (ref: User),
  timestamps: true
}
```

---

## 🔐 Authentication

This project uses **JWT (JSON Web Tokens)** for authentication:

- 🔑 **Access Tokens**: Short-lived tokens for API access (1 day)
- 🔄 **Refresh Tokens**: Long-lived tokens for token renewal (10 days)
- 🔒 **Password Security**: Bcrypt hashing with salt rounds
- 🍪 **Cookie Storage**: Secure cookie-based token storage

### Authentication Flow
1. User registers/logs in with credentials
2. Server generates access & refresh tokens
3. Tokens stored in secure HTTP-only cookies
4. Client includes tokens in subsequent requests
5. Server validates tokens for protected routes

---

## 📡 API Endpoints

> 🚧 **Note**: API endpoints are currently under development. This section will be updated as routes are implemented.

### Planned Endpoints

#### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token

#### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/avatar` - Upload avatar
- `GET /api/users/:id/videos` - Get user's videos

#### Videos
- `GET /api/videos` - Get all videos
- `POST /api/videos` - Upload new video
- `GET /api/videos/:id` - Get video by ID
- `PUT /api/videos/:id` - Update video
- `DELETE /api/videos/:id` - Delete video

---

## 🛠️ Technologies Used

### Backend Technologies
| Technology | Version | Purpose |
|------------|---------|---------|
| ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=flat&logo=node.js&logoColor=white) | Latest | Runtime Environment |
| ![Express](https://img.shields.io/badge/Express.js-404D59?style=flat&logo=express&logoColor=white) | ^5.1.0 | Web Framework |
| ![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat&logo=mongodb&logoColor=white) | ^8.18.0 | Database |
| ![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=JSON%20web%20tokens) | ^9.0.2 | Authentication |

### Key Dependencies
- **🔐 bcrypt** (^6.0.0) - Password hashing
- **🍪 cookie-parser** (^1.4.7) - Cookie parsing middleware
- **🌐 cors** (^2.8.5) - Cross-origin resource sharing
- **⚙️ dotenv** (^17.2.2) - Environment variable management
- **📄 mongoose-aggregate-paginate-v2** (^1.1.4) - Advanced pagination

### Development Tools
- **🔄 nodemon** (^3.1.10) - Development server auto-restart
- **💅 prettier** (^3.6.2) - Code formatting

---

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `8000` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.net` |
| `CORS_ORIGIN` | Allowed CORS origins | `*` or `http://localhost:3000` |
| `ACCESS_TOKEN_SECRET` | JWT access token secret | `your-secret-key` |
| `ACCESS_TOKEN_EXPIRY` | Access token expiration | `1d` |
| `REFRESH_TOKEN_SECRET` | JWT refresh token secret | `your-refresh-secret` |
| `REFRESH_TOKEN_EXPIRY` | Refresh token expiration | `10d` |

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Getting Started
1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💻 Make your changes
4. ✅ Test your changes
5. 📝 Commit your changes (`git commit -m 'Add amazing feature'`)
6. 📤 Push to the branch (`git push origin feature/amazing-feature`)
7. 🔄 Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write clear commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting

### Code Style
This project uses Prettier for code formatting. Run `npm run format` before committing.

---

## 📄 License

This project is licensed under the **ISC License**.

```
ISC License

Copyright (c) 2024 Backend Chai or Code

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
```

---

## 👨‍💻 Author

**Lucky Longre**
- 🌐 GitHub: [@LuckyLongre123](https://github.com/LuckyLongre123)
- 🌍 Portfolio: [lucky-longre.onrender.com](https://lucky-longre.onrender.com)
- 📧 Email: [officialluckylongre@gmail.com](mailto:officialluckylongre@gmail.com)

---

## 🙏 Acknowledgments

- 🎓 **Chai aur Code** - For the amazing backend development tutorials
- 🚀 **Node.js Community** - For the excellent ecosystem
- 📚 **MongoDB** - For the powerful database solution
- 🔧 **Express.js** - For the minimal and flexible web framework

---

## 📞 Support

If you have any questions or need help, feel free to:

- 🐛 [Open an issue](https://github.com/your-username/backend-chai-or-code/issues)
- 💬 [Start a discussion](https://github.com/your-username/backend-chai-or-code/discussions)
- 📧 Send an email to [officialluckylongre@gmail.com](mailto:officialluckylongre@gmail.com)

---

<div align="center">

**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Lucky Longre](https://github.com/LuckyLongre123)

</div>