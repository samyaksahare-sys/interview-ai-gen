import { UserButton, SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, History, Home } from 'lucide-react';

export default function Navbar() {
  const { pathname } = useLocation();

  const links = [
    { to: '/',        label: 'Analyze',  Icon: Home    },
    { to: '/history', label: 'History',  Icon: History },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: 'rgba(5,8,16,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(99,102,241,0.4)',
          }}>
            <Brain size={20} color="white" />
          </div>
          <span style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', color: '#f1f5f9' }}>
            Interview<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <SignedIn>
            {links.map(({ to, label, Icon }) => (
              <Link
                key={to}
                to={to}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: pathname === to ? '#a5b4fc' : '#94a3b8',
                  background: pathname === to ? 'rgba(99,102,241,0.12)' : 'transparent',
                  border: pathname === to ? '1px solid rgba(99,102,241,0.25)' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            ))}

            <div style={{ marginLeft: '8px' }}>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <button className="btn btn-primary btn-sm">Sign In</button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
