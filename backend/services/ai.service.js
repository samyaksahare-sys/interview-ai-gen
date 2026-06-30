const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes a resume against a job description.
 * Returns a structured JSON report.
 */
async function analyzeResume(resumeText, jobDescription) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert HR analyst and career coach. Analyze the following resume against the provided job description.

Resume:
---
${resumeText}
---

Job Description:
---
${jobDescription}
---

Provide a DETAILED analysis in the following JSON format ONLY (no markdown, no extra text):
{
  "matchScore": <number 0-100>,
  "summary": "<2-3 sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "skillGaps": [
    {
      "skill": "<missing skill name>",
      "importance": "<high|medium|low>",
      "suggestion": "<how to acquire this skill>"
    }
  ],
  "interviewQuestions": [
    {
      "question": "<interview question>",
      "type": "<technical|behavioral|situational>",
      "hint": "<what a good answer should cover>"
    }
  ],
  "improvements": ["<resume improvement suggestion 1>", "<improvement 2>", "<improvement 3>"],
  "keywordsToAdd": ["<keyword 1>", "<keyword 2>", "<keyword 3>"]
}

Generate at least 5 skillGaps, 8 interviewQuestions, and 5 improvements.
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();

  // Clean up and parse JSON
  const cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(cleanedText);
}

/**
 * Generates a tailored resume based on original resume and job description.
 */
async function generateTailoredResume(resumeText, jobDescription) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
You are an expert resume writer. Rewrite the following resume to better match the job description.

Original Resume:
---
${resumeText}
---

Job Description:
---
${jobDescription}
---

Rules:
- Keep all factual information accurate (do not invent experiences)
- Incorporate relevant keywords from the job description naturally
- Improve bullet points to show impact and quantifiable results
- Reorganize sections to highlight most relevant experience first
- Use strong action verbs

Return ONLY the rewritten resume in clean plain text format, ready to copy-paste.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

module.exports = { analyzeResume, generateTailoredResume };
