import React from 'react';
import { Compass, Ship, User, HelpCircle } from 'lucide-react';

export default function Navbar({ onNavigate, activeTab }) {
  return (
    <header style={styles.header} className="glass animate-slideup">
      <div style={styles.container}>
        <div style={styles.logoContainer} onClick={() => onNavigate('home')}>
          <div style={styles.iconCircle}>
            <Compass size={24} color="#00f2fe" style={styles.logoIcon} />
          </div>
          <span style={styles.logoText}>ADVENTURE <span style={styles.logoHighlight}>TRANSIT</span></span>
        </div>

        <nav style={styles.nav}>
          <button 
            style={{...styles.navLink, ...(activeTab === 'home' ? styles.activeNavLink : {})}} 
            onClick={() => onNavigate('home')}
          >
            Explore
          </button>
          <button 
            style={{...styles.navLink, ...(activeTab === 'planner' ? styles.activeNavLink : {})}} 
            onClick={() => onNavigate('planner')}
          >
            Itinerary Planner
          </button>
          <button 
            style={{...styles.navLink, ...(activeTab === 'fleet' ? styles.activeNavLink : {})}} 
            onClick={() => onNavigate('fleet')}
          >
            Our Fleet
          </button>
        </nav>

        <div style={styles.actions}>
          <button style={styles.actionBtn} onClick={() => onNavigate('planner')}>
            Plan a Trip
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: '1rem',
    zIndex: 100,
    margin: '1rem 2rem',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
  },
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.75rem 2rem',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
  },
  iconCircle: {
    background: 'rgba(0, 242, 254, 0.1)',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(0, 242, 254, 0.2)',
  },
  logoIcon: {
    filter: 'drop-shadow(0 0 8px rgba(0, 242, 254, 0.4))',
  },
  logoText: {
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    fontSize: '1.25rem',
    letterSpacing: '0.05em',
    color: '#ffffff',
  },
  logoHighlight: {
    background: 'var(--grad-backpacker)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  navLink: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.95rem',
    fontWeight: '500',
    fontFamily: 'var(--font-body)',
    cursor: 'pointer',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
  },
  activeNavLink: {
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.05)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  actionBtn: {
    background: 'var(--grad-backpacker)',
    color: '#020617',
    border: 'none',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    fontSize: '0.9rem',
    padding: '0.6rem 1.25rem',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: 'var(--glow-cyan)',
    transition: 'all 0.2s ease',
  },
};
