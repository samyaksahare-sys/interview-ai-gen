# 🤖 InterviewAI — Gen AI Job Prep Platform

A full-stack AI-powered resume analyzer and interview prep tool using **Google Gemini**, **React**, **Express**, **Clerk**, and **MongoDB**.

## 🚀 Quick Start

### 1. Start the Backend
```bash
cd backend
node server.js
```
Backend runs at **http://localhost:3001**

### 2. Start the Frontend (in a new terminal)
```bash
cd frontend
npm run dev
```
Frontend runs at **http://localhost:5173**

## 📁 Project Structure

```
interview-ai-gen/
├── backend/
│   ├── server.js              # Express API server
│   ├── services/
│   │   ├── ai.service.js      # Gemini AI prompts
│   │   └── db.service.js      # MongoDB operations
│   ├── .env                   # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx   # Upload form
│   │   │   ├── ReportPage.jsx # Analysis results
│   │   │   └── HistoryPage.jsx
│   │   ├── components/
│   │   │   └── Navbar.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css          # Design system
│   ├── .env
│   └── package.json
└── README.md
```

## 🔑 Environment Variables

### Backend (`backend/.env`)
```
GEMINI_API_KEY=your_key
MONGODB_URI=your_connection_string
DB_NAME=interview_ai
PORT=3001
```

### Frontend (`frontend/.env`)
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_API_BASE_URL=http://localhost:3001/api
```

## ✨ Features
- 📄 PDF Resume Upload (drag & drop)
- 🤖 AI Match Score (0-100)
- 🎯 Skill Gap Analysis with suggestions
- 💬 8+ tailored interview questions
- 📝 Resume improvement tips
- 🔑 Keywords to add
- 📜 Analysis history per user
- 🔐 Clerk authentication
