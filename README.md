# 🤖 InterviewAI Gen — AI-Powered Job Prep Platform

> Upload your resume. Paste a job description. Get an instant AI-powered analysis, match score, skill gaps, interview questions, and a tailored resume — all in seconds.

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **PDF Resume Upload** | Drag & drop or click to upload your resume |
| 🎯 **AI Match Score** | Get a 0–100 score showing how well your resume fits the job |
| 🧠 **Skill Gap Analysis** | See exactly what skills you're missing for the role |
| 💬 **Interview Questions** | 8+ tailored questions based on your resume & the job |
| 📝 **Resume Tips** | Specific bullet-by-bullet improvement suggestions |
| 🔑 **Keyword Optimizer** | Keywords to add to pass ATS filters |
| 🪄 **Tailored Resume** | One-click rewrite of your resume to match the job |
| 📜 **History** | All your past analyses saved and accessible anytime |
| 🔐 **Authentication** | Secure sign-in/sign-up powered by Clerk |

---

## 🛠️ Tech Stack

**Frontend**
- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Clerk](https://clerk.com/) — authentication
- [Axios](https://axios-http.com/) — API calls
- Vanilla CSS with Glassmorphism design

**Backend**
- [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- [Google Gemini AI](https://ai.google.dev/) (`gemini-2.5-flash`) — analysis engine
- [MongoDB Atlas](https://www.mongodb.com/atlas) — database
- [Multer](https://github.com/expressjs/multer) — file upload
- [pdf-parse](https://www.npmjs.com/package/pdf-parse) — PDF text extraction

---

## 📁 Project Structure

```
interview-ai-gen/
├── backend/
│   ├── server.js              # Express API server
│   ├── services/
│   │   ├── ai.service.js      # Google Gemini AI integration
│   │   └── db.service.js      # MongoDB CRUD operations
│   ├── .env                   # 🔒 Environment variables (not committed)
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx   # Resume & JD upload page
│   │   │   ├── ReportPage.jsx # AI analysis results
│   │   │   └── HistoryPage.jsx# Past analyses
│   │   ├── components/
│   │   │   └── Navbar.jsx     # Navigation bar
│   │   ├── App.jsx            # Routing
│   │   └── index.css          # Global design system
│   ├── .env                   # 🔒 Environment variables (not committed)
│   └── package.json
│
└── README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- A [Google AI Studio](https://aistudio.google.com/app/apikey) API Key
- A [MongoDB Atlas](https://cloud.mongodb.com/) connection string
- A [Clerk](https://clerk.com/) publishable key

### 1. Clone the repository
```bash
git clone https://github.com/samyaksahare-sys/interview-ai-gen.git
cd interview-ai-gen
```

### 2. Set up the Backend
```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:
```env
GEMINI_API_KEY=your_google_ai_api_key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster
DB_NAME=interview_ai
PORT=3001
```

Start the backend:
```bash
node server.js
```
> Backend runs at **http://localhost:3001**

### 3. Set up the Frontend
```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key
VITE_API_BASE_URL=http://localhost:3001/api
```

Start the frontend:
```bash
npm run dev
```
> Frontend runs at **http://localhost:5173**

---

## 🚀 Deployment

| Service | Platform |
|---|---|
| **Frontend** | [Vercel](https://vercel.com) — set root dir to `frontend` |
| **Backend** | [Render](https://render.com) — set root dir to `backend`, start command `node server.js` |

> ⚠️ Remember to add your environment variables in both Render and Vercel dashboards, and update `VITE_API_BASE_URL` to your live Render backend URL.

---

## 📸 Screenshots

> Coming soon

---

## 📄 License

MIT © [samyak](https://github.com/samyaksahare-sys)
