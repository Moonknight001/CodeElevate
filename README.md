# CodeElevate 🚀

A full-stack personal coding practice platform — your own small-scale LeetCode. Practice problems, run code in multiple languages, track your progress, and prepare for technical interviews.

## Features

- 📋 **Problems Dashboard** — Browse and filter coding problems by difficulty (Easy, Medium, Hard)
- 🖥️ **Split-Screen Workspace** — Problem description alongside Monaco Editor in a resizable split view
- 💻 **Multi-Language Support** — JavaScript, Python, C++, and Java
- ⚡ **Code Execution** — Run code with real output, execution time, and memory usage via Judge0 API
- ✅ **Test Case Validation** — Submit and see which test cases pass or fail
- 👤 **Authentication** — Sign up and login with JWT-based auth and refresh tokens
- 📊 **User Dashboard** — Track solved problems, submission history, and stats by difficulty
- 🌙 **Dark / Light Mode** — Toggle between themes

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 18, Tailwind CSS, Monaco Editor, React Router, Axios |
| Backend | Express.js, MongoDB, Mongoose, bcrypt, JWT |
| Code Execution | Judge0 API (via RapidAPI) |

## Project Structure

```
CodeElevate/
├── frontend/              # React application
│   ├── src/
│   │   ├── api/           # Axios API client
│   │   ├── context/       # Auth and Theme context
│   │   ├── pages/         # Page components
│   │   │   ├── LandingPage.js
│   │   │   ├── AuthPage.js
│   │   │   ├── ProblemsPage.js
│   │   │   ├── ProblemWorkspace.js
│   │   │   └── UserDashboard.js
│   │   └── components/    # Reusable UI components
│   └── package.json
│
└── backend/               # Express REST API
    ├── config/            # Database configuration
    ├── models/            # Mongoose schemas (User, Problem, Submission)
    ├── controllers/       # Business logic
    ├── routes/            # API route handlers
    ├── middleware/        # JWT auth middleware
    ├── seeds/             # Sample problem seeder
    ├── server.js          # Entry point
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [Judge0 RapidAPI key](https://rapidapi.com/judge0-official/api/judge0-ce) (for code execution)

### Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your values:
# - MONGODB_URI: your MongoDB connection string
# - JWT_SECRET: random secret string
# - JWT_REFRESH_SECRET: another random secret string
# - JUDGE0_API_KEY: your RapidAPI key

# Seed sample problems
npm run seed

# Start development server
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Copy and configure environment variables
cp .env.example .env
# Set REACT_APP_API_URL=http://localhost:5000/api (default)

# Start development server
npm start
```

### Environment Variables

**Backend (`backend/.env`)**
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/codeelevate
JWT_SECRET=your_jwt_secret_change_in_production
JWT_REFRESH_SECRET=your_jwt_refresh_secret_change_in_production
CLIENT_URL=http://localhost:3000
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_rapidapi_key_here
```

**Frontend (`frontend/.env`)**
```
REACT_APP_API_URL=http://localhost:5000/api
```

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | No |
| POST | `/api/auth/refresh` | Refresh access token | No |
| GET | `/api/problems` | Get all problems (filter by difficulty, search) | No |
| GET | `/api/problems/:id` | Get single problem | No |
| POST | `/api/submissions/run` | Run code without saving | Yes |
| POST | `/api/submissions` | Submit code for a problem | Yes |
| GET | `/api/submissions` | Get user's submissions | Yes |
| GET | `/api/submissions/:id` | Get single submission | Yes |
| GET | `/api/user/profile` | Get user profile | Yes |
| GET | `/api/user/stats` | Get user statistics | Yes |

## Sample Problems

The seeder includes 8 coding problems:

1. **Two Sum** (Easy)
2. **Valid Parentheses** (Easy)
3. **Reverse Linked List** (Easy)
4. **Longest Substring Without Repeating Characters** (Medium)
5. **Merge Intervals** (Medium)
6. **Word Search** (Medium)
7. **Median of Two Sorted Arrays** (Hard)
8. **Trapping Rain Water** (Hard)

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT access tokens (15min expiry) + refresh tokens (7 days)
- Rate limiting on all API endpoints (100 req/15min, stricter on auth)
- CORS protection (configurable client URL)
- Input validation and sanitization
- HTTP-only refresh token handling
