require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { analyzeResume, generateTailoredResume } = require("./services/ai.service");
const { saveAnalysis, getUserAnalyses, getAnalysisById } = require("./services/db.service");

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));

// Multer setup (memory storage for PDF uploads)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"));
    }
  },
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Interview AI Backend is running 🚀" });
});

// ─── ROUTE: Analyze Resume ────────────────────────────────────────────────────
app.post("/api/analyze", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const { jobDescription, userId } = req.body;

    if (!jobDescription || jobDescription.trim().length < 50) {
      return res.status(400).json({ error: "Please provide a detailed job description (at least 50 characters)" });
    }

    // Parse PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.trim().length < 100) {
      return res.status(400).json({ error: "Could not extract text from PDF. Please ensure it is not a scanned image." });
    }

    // Analyze with Gemini
    const analysis = await analyzeResume(resumeText, jobDescription);

    // Save to MongoDB if userId provided
    let savedId = null;
    if (userId) {
      try {
        const docId = await saveAnalysis(userId, {
          resumeText,
          jobDescription,
          analysis,
          filename: req.file.originalname,
        });
        savedId = docId.toString();
      } catch (dbErr) {
        console.error("MongoDB Save Error (non-fatal):", dbErr.message);
        // We continue so the user still gets their report even if DB fails
      }
    }

    res.json({
      success: true,
      id: savedId,
      analysis,
    });
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: err.message || "Analysis failed. Please try again." });
  }
});

// ─── ROUTE: Generate Tailored Resume ─────────────────────────────────────────
app.post("/api/generate-resume", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const { jobDescription } = req.body;

    // Parse PDF
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    const tailored = await generateTailoredResume(resumeText, jobDescription);

    res.json({ success: true, tailoredResume: tailored });
  } catch (err) {
    console.error("Generate resume error:", err);
    res.status(500).json({ error: err.message || "Resume generation failed." });
  }
});

// ─── ROUTE: Get User Analyses History ────────────────────────────────────────
app.get("/api/history/:userId", async (req, res) => {
  try {
    const analyses = await getUserAnalyses(req.params.userId);
    res.json({ success: true, analyses });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Failed to fetch history." });
  }
});

// ─── ROUTE: Get Single Analysis ───────────────────────────────────────────────
app.get("/api/analysis/:id", async (req, res) => {
  try {
    const analysis = await getAnalysisById(req.params.id);
    if (!analysis) return res.status(404).json({ error: "Analysis not found" });
    res.json({ success: true, analysis });
  } catch (err) {
    console.error("Get analysis error:", err);
    res.status(500).json({ error: "Failed to fetch analysis." });
  }
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
