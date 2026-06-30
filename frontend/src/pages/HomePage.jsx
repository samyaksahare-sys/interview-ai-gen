import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Upload, FileText, Briefcase, Sparkles, ChevronRight, Zap, Shield, TrendingUp } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const API = import.meta.env.VITE_API_BASE_URL;

const features = [
  { icon: Zap,        label: 'Resume Analysis',      desc: 'Get an AI-powered match score instantly' },
  { icon: TrendingUp, label: 'Skill Gap Detection',  desc: 'Know exactly what skills to learn next'   },
  { icon: Shield,     label: 'Interview Prep',        desc: '8+ tailored questions with hints'         },
];

export default function HomePage() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [file, setFile]         = useState(null);
  const [jd, setJd]             = useState('');
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]   = useState(false);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f?.type === 'application/pdf') setFile(f);
    else toast.error('Please drop a PDF file');
  }, []);

  const onFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file)              return toast.error('Please upload your resume PDF');
    if (jd.trim().length < 50) return toast.error('Job description must be at least 50 characters');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('jobDescription', jd);
    formData.append('userId', user?.id || 'anonymous');

    setLoading(true);
    const toastId = toast.loading('🤖 Analyzing your resume with Gemini AI...');

    try {
      const { data } = await axios.post(`${API}/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
      });

      toast.success('Analysis complete!', { id: toastId });
      navigate('/report', { state: { analysis: data.analysis, id: data.id } });
    } catch (err) {
      toast.error(err.response?.data?.error || 'Analysis failed. Please try again.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', padding: '60px 0 100px' }}>
      <div className="container">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '64px' }}
        >
          <div className="badge badge-purple" style={{ marginBottom: '20px', display: 'inline-flex' }}>
            <Sparkles size={12} />
            Powered by Google Gemini AI
          </div>

          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', lineHeight: 1.15, marginBottom: '20px' }}>
            Land Your Dream Job<br />
            <span className="gradient-text">with AI-Powered Prep</span>
          </h1>

          <p style={{ fontSize: '18px', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto' }}>
            Upload your resume, paste a job description, and get a comprehensive analysis with interview questions, skill gaps, and a tailored resume — in seconds.
          </p>
        </motion.div>

        {/* Feature Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}
        >
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="glass-card" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', minWidth: '220px' }}>
              <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={18} color="#a5b4fc" />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '2px' }}>{label}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{desc}</div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
        >
          <div className="glass-card" style={{ padding: '48px', maxWidth: '860px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                {/* Left: Resume Upload */}
                <div>
                  <label style={{ textTransform: 'none', marginBottom: '12px', fontSize: '16px', color: 'var(--text-primary)' }}>
                    📄 Your Resume
                  </label>
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={onDrop}
                    onClick={() => document.getElementById('resume-input').click()}
                    style={{
                      border: `2px dashed ${dragging ? 'var(--accent-primary)' : file ? 'var(--accent-green)' : 'var(--border)'}`,
                      borderRadius: 'var(--radius-lg)',
                      padding: '40px 24px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      background: dragging
                        ? 'rgba(99,102,241,0.06)'
                        : file
                        ? 'rgba(16,185,129,0.05)'
                        : 'rgba(255,255,255,0.02)',
                      minHeight: '220px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '12px',
                    }}
                  >
                    <input
                      id="resume-input"
                      type="file"
                      accept=".pdf"
                      style={{ display: 'none' }}
                      onChange={onFileChange}
                    />
                    {file ? (
                      <>
                        <div style={{ width: 52, height: 52, borderRadius: '12px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={24} color="#10b981" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, color: '#6ee7b7', fontSize: '14px' }}>{file.name}</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            {(file.size / 1024).toFixed(0)} KB · Click to change
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div style={{ width: 52, height: 52, borderRadius: '12px', background: 'rgba(99,102,241,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Upload size={24} color="#a5b4fc" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                            Drop your PDF here
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                            or click to browse
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Right: Job Description */}
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <label style={{ textTransform: 'none', marginBottom: '12px', fontSize: '16px', color: 'var(--text-primary)' }}>
                    💼 Job Description
                  </label>
                  <textarea
                    className="textarea"
                    style={{ flex: 1, minHeight: '220px' }}
                    value={jd}
                    onChange={(e) => setJd(e.target.value)}
                    placeholder="Paste the full job description here...

Include requirements, responsibilities, and any preferred qualifications for the most accurate analysis."
                  />
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px', textAlign: 'right' }}>
                    {jd.length} characters {jd.length < 50 && '(min. 50)'}
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div style={{ marginTop: '36px', textAlign: 'center' }}>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                  style={{ minWidth: '240px', justifyContent: 'center' }}
                >
                  {loading ? (
                    <>
                      <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={18} />
                      Analyze My Resume
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
                <p style={{ marginTop: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Takes 10–20 seconds · Powered by Gemini 1.5 Flash
                </p>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
