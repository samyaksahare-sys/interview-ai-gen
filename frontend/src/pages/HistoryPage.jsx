import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { History, FileText, Clock, TrendingUp, ChevronRight } from 'lucide-react';
import axios from 'axios';

const API = import.meta.env.VITE_API_BASE_URL;

export default function HistoryPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    axios.get(`${API}/history/${user.id}`)
      .then(({ data }) => setAnalyses(data.analyses || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?.id]);

  const scoreColor = (s) =>
    s >= 80 ? '#10b981' : s >= 60 ? '#6366f1' : s >= 40 ? '#f59e0b' : '#ef4444';

  return (
    <div style={{ padding: '48px 0 100px' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
            <div style={{ width: 44, height: 44, borderRadius: '12px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <History size={22} color="#a5b4fc" />
            </div>
            <div>
              <h1 style={{ fontSize: '24px' }}>Analysis History</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Your past resume analyses</p>
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }} />
              <p style={{ color: 'var(--text-secondary)' }}>Loading history...</p>
            </div>
          ) : analyses.length === 0 ? (
            <div className="glass-card" style={{ padding: '60px', textAlign: 'center' }}>
              <FileText size={48} color="var(--text-muted)" style={{ marginBottom: '16px' }} />
              <h3 style={{ marginBottom: '8px' }}>No analyses yet</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Upload your first resume to get started</p>
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Start Analyzing
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {analyses.map((item, i) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <div
                    className="glass-card"
                    style={{ padding: '24px', cursor: 'pointer' }}
                    onClick={() => navigate('/report', { state: { analysis: item.analysis } })}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                        {/* Score bubble */}
                        <div style={{
                          width: 56, height: 56, borderRadius: '14px',
                          background: `${scoreColor(item.analysis?.matchScore)}20`,
                          border: `2px solid ${scoreColor(item.analysis?.matchScore)}40`,
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                        }}>
                          <span style={{ fontWeight: 800, fontSize: '18px', color: scoreColor(item.analysis?.matchScore), fontFamily: 'Space Grotesk, sans-serif' }}>
                            {item.analysis?.matchScore ?? '--'}
                          </span>
                        </div>

                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontWeight: 600, marginBottom: '4px', fontSize: '15px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.filename || 'Resume'}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)' }}>
                              <Clock size={12} />
                              {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: 'var(--text-muted)' }}>
                              <TrendingUp size={12} />
                              {item.analysis?.skillGaps?.length ?? 0} skill gaps
                            </div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={18} color="var(--text-muted)" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
