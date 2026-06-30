import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Target, TrendingUp, MessageSquare, Lightbulb,
  Tag, CheckCircle, AlertTriangle, Info, ChevronDown, ChevronUp
} from 'lucide-react';
import { useState } from 'react';

function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? '#10b981'
    : score >= 60 ? '#6366f1'
    : score >= 40 ? '#f59e0b'
    : '#ef4444';

  const label =
    score >= 80 ? 'Excellent'
    : score >= 60 ? 'Good'
    : score >= 40 ? 'Average'
    : 'Needs Work';

  return (
    <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto' }}>
      <svg width={140} height={140} viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={70} cy={70} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={10} />
        <circle
          cx={70} cy={70} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.5s ease', filter: `drop-shadow(0 0 6px ${color}66)` }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '32px', fontWeight: 800, color, fontFamily: 'Space Grotesk, sans-serif' }}>{score}</span>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
      </div>
    </div>
  );
}

function AccordionItem({ title, icon: Icon, iconColor, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="glass-card" style={{ marginBottom: '12px', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '20px 24px',
          background: 'none', border: 'none', cursor: 'pointer', color: 'inherit',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 36, height: 36, borderRadius: '8px', background: `${iconColor}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={18} color={iconColor} />
          </div>
          <span style={{ fontWeight: 600, fontSize: '16px' }}>{title}</span>
        </div>
        {open ? <ChevronUp size={18} color="var(--text-secondary)" /> : <ChevronDown size={18} color="var(--text-secondary)" />}
      </button>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          style={{ padding: '0 24px 24px' }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}

export default function ReportPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { analysis } = state || {};

  if (!analysis) {
    navigate('/');
    return null;
  }

  const { matchScore, summary, strengths, skillGaps, interviewQuestions, improvements, keywordsToAdd } = analysis;

  const importanceBadge = (imp) => {
    if (imp === 'high')   return <span className="badge badge-red">High Priority</span>;
    if (imp === 'medium') return <span className="badge badge-amber">Medium</span>;
    return                       <span className="badge badge-teal">Low</span>;
  };

  const typeBadge = (type) => {
    if (type === 'technical')    return <span className="badge badge-purple">Technical</span>;
    if (type === 'behavioral')   return <span className="badge badge-teal">Behavioral</span>;
    return                              <span className="badge badge-amber">Situational</span>;
  };

  return (
    <div style={{ padding: '48px 0 100px' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/')}
          className="btn btn-secondary btn-sm"
          style={{ marginBottom: '32px' }}
        >
          <ArrowLeft size={15} /> Back to Analyzer
        </motion.button>

        {/* Header + Score Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card"
          style={{ padding: '40px', marginBottom: '24px' }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '32px', alignItems: 'center' }}>
            <div>
              <div className="badge badge-purple" style={{ marginBottom: '12px' }}>Analysis Complete</div>
              <h1 style={{ fontSize: '28px', marginBottom: '16px' }}>Resume Match Report</h1>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{summary}</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <ScoreRing score={matchScore} />
              <div style={{ marginTop: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>Match Score</div>
            </div>
          </div>

          {/* Strengths chips */}
          <div className="divider" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Your Strengths
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {strengths?.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '100px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', fontSize: '13px', color: '#6ee7b7' }}>
                  <CheckCircle size={13} /> {s}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Accordion Sections */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>

          {/* Skill Gaps */}
          <AccordionItem title="Skill Gaps" icon={TrendingUp} iconColor="#f59e0b" defaultOpen={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {skillGaps?.map((gap, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                  <AlertTriangle size={18} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 600, fontSize: '15px' }}>{gap.skill}</span>
                      {importanceBadge(gap.importance)}
                    </div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{gap.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionItem>

          {/* Interview Questions */}
          <AccordionItem title="Interview Questions" icon={MessageSquare} iconColor="#6366f1" defaultOpen={true}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {interviewQuestions?.map((q, i) => (
                <div key={i} style={{ padding: '20px', borderRadius: '12px', background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.15)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', flex: 1 }}>
                      <span style={{ fontSize: '22px', fontWeight: 800, color: 'rgba(99,102,241,0.4)', fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1 }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p style={{ fontWeight: 600, fontSize: '15px', lineHeight: 1.5 }}>{q.question}</p>
                    </div>
                    {typeBadge(q.type)}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', marginTop: '8px' }}>
                    <Info size={14} color="#a5b4fc" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{q.hint}</p>
                  </div>
                </div>
              ))}
            </div>
          </AccordionItem>

          {/* Improvements */}
          <AccordionItem title="Resume Improvements" icon={Lightbulb} iconColor="#8b5cf6">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {improvements?.map((imp, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)' }}>
                  <div style={{ width: 24, height: 24, borderRadius: '6px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#a78bfa' }}>{i + 1}</span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{imp}</p>
                </div>
              ))}
            </div>
          </AccordionItem>

          {/* Keywords */}
          <AccordionItem title="Keywords to Add" icon={Tag} iconColor="#14b8a6">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {keywordsToAdd?.map((kw, i) => (
                <span key={i} className="badge badge-teal" style={{ fontSize: '13px', padding: '6px 14px' }}>
                  <Tag size={11} /> {kw}
                </span>
              ))}
            </div>
          </AccordionItem>

        </motion.div>
      </div>
    </div>
  );
}
