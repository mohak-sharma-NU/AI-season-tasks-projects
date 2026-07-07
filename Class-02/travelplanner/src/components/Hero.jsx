import React, { useState } from 'react';
import { Compass, Users, MapPin, Calendar, Heart, Shield } from 'lucide-react';

export default function Hero({ onStartPlan }) {
  const [vibe, setVibe] = useState('backpacker');
  const [days, setDays] = useState(5);
  const [destination, setDestination] = useState('coastal');

  const handleGenerate = () => {
    onStartPlan({ vibe, days, destination });
  };

  return (
    <section style={styles.heroSection} className="animate-slideup">
      <div style={styles.gridContainer}>
        {/* Left Side: Copywriting and Pitch */}
        <div style={styles.contentColumn}>
          <div style={styles.badgeWrapper}>
            <span style={styles.enterpriseBadge}>Tourism Wing of Adventure Enterprise</span>
          </div>
          
          <h1 style={styles.headline}>
            Your Journey. <br />
            Our Premium <span style={vibe === 'backpacker' ? styles.cyanText : styles.orangeText}>Transit.</span>
          </h1>
          
          <p style={styles.subhead}>
            Whether you are a solo backpacker chasing sunsets or a family creating lifelong memories, our luxury coaches and private cars are ready to transport you to your next destination.
          </p>

          <div style={styles.pathwayToggle}>
            <button 
              style={{...styles.toggleBtn, ...(vibe === 'backpacker' ? styles.activeBackpacker : {})}} 
              onClick={() => setVibe('backpacker')}
            >
              <Compass size={18} />
              Solo & Backpacker
            </button>
            <button 
              style={{...styles.toggleBtn, ...(vibe === 'family' ? styles.activeFamily : {})}} 
              onClick={() => setVibe('family')}
            >
              <Users size={18} />
              Family & Group
            </button>
          </div>

          <div style={styles.statsRow}>
            <div style={styles.statCard} className="glass">
              <span style={styles.statVal}>150+</span>
              <span style={styles.statLabel}>Tour Routes</span>
            </div>
            <div style={styles.statCard} className="glass">
              <span style={styles.statVal}>99.4%</span>
              <span style={styles.statLabel}>On-Time Transit</span>
            </div>
            <div style={styles.statCard} className="glass">
              <span style={styles.statVal}>4.9★</span>
              <span style={styles.statLabel}>Traveler Rating</span>
            </div>
          </div>
        </div>

        {/* Right Side: Quick Planner Widget */}
        <div style={styles.widgetColumn}>
          <div style={{...styles.widgetCard, ...(vibe === 'backpacker' ? styles.glowCyan : styles.glowOrange)}} className="glass">
            <div style={styles.widgetHeader}>
              <h3 style={styles.widgetTitle}>InstaPlan™ Generator</h3>
              <p style={styles.widgetSub}>Generate an transport-integrated trip in seconds</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Where to?</label>
              <div style={styles.selectWrapper}>
                <MapPin size={16} color="#64748b" style={styles.inputIcon} />
                <select 
                  value={destination} 
                  onChange={(e) => setDestination(e.target.value)} 
                  style={styles.select}
                >
                  <option value="coastal">The Wild Coastal Loop (Beaches & Surfing)</option>
                  <option value="highland">Alpine Highland Pass (Mountains & Hikes)</option>
                  <option value="heritage">Heritage Trail (Historical Cities & Castles)</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Duration</label>
              <div style={styles.selectWrapper}>
                <Calendar size={16} color="#64748b" style={styles.inputIcon} />
                <select 
                  value={days} 
                  onChange={(e) => setDays(Number(e.target.value))} 
                  style={styles.select}
                >
                  <option value={3}>3 Days (Weekend Trip)</option>
                  <option value={5}>5 Days (Standard Explorer)</option>
                  <option value={7}>7 Days (Deep Journey)</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Travel Style</label>
              <div style={styles.gridStyleToggle}>
                <div 
                  onClick={() => setVibe('backpacker')}
                  style={{
                    ...styles.styleCard, 
                    ...(vibe === 'backpacker' ? styles.styleCardActiveCyan : {})
                  }}
                >
                  <div style={styles.styleCardHeader}>
                    <span className="badge-backpacker">Coach Pass</span>
                  </div>
                  <span style={styles.styleCardText}>Budget-friendly, high social vibe, premium coach seating.</span>
                </div>

                <div 
                  onClick={() => setVibe('family')}
                  style={{
                    ...styles.styleCard, 
                    ...(vibe === 'family' ? styles.styleCardActiveOrange : {})
                  }}
                >
                  <div style={styles.styleCardHeader}>
                    <span className="badge-family">Private SUV</span>
                  </div>
                  <span style={styles.styleCardText}>Maximum comfort, kids-friendly, custom schedules.</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              className={vibe === 'backpacker' ? 'btn-cyan' : 'btn-orange'} 
              style={styles.submitBtn}
            >
              Generate Transit Itinerary
            </button>

            <div style={styles.widgetFooter}>
              <div style={styles.footerItem}>
                <Shield size={14} color="#64748b" />
                <span>Secure Simulated Booking</span>
              </div>
              <div style={styles.footerItem}>
                <Heart size={14} color="#64748b" />
                <span>Flexible Routes</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  heroSection: {
    padding: '4rem 2rem 2rem 2rem',
    maxWidth: '1280px',
    margin: '0 auto',
  },
  gridContainer: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '4rem',
    alignItems: 'center',
  },
  contentColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  badgeWrapper: {
    marginBottom: '1.5rem',
  },
  enterpriseBadge: {
    fontSize: '0.85rem',
    fontWeight: '600',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    color: '#00f2fe',
    border: '1px solid rgba(0, 242, 254, 0.2)',
    padding: '0.4rem 1rem',
    borderRadius: '9999px',
    background: 'rgba(0, 242, 254, 0.05)',
  },
  headline: {
    fontSize: '3.75rem',
    lineHeight: '1.1',
    marginBottom: '1.5rem',
    color: '#ffffff',
  },
  cyanText: {
    background: 'var(--grad-backpacker)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  orangeText: {
    background: 'var(--grad-family)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subhead: {
    fontSize: '1.15rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '2.5rem',
  },
  pathwayToggle: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '3rem',
    background: 'rgba(255, 255, 255, 0.03)',
    padding: '0.4rem',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '0.6rem 1.25rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    transition: 'all 0.2s ease',
  },
  activeBackpacker: {
    background: 'var(--grad-backpacker)',
    color: '#020617',
    boxShadow: 'var(--glow-cyan)',
  },
  activeFamily: {
    background: 'var(--grad-family)',
    color: '#020617',
    boxShadow: 'var(--glow-orange)',
  },
  statsRow: {
    display: 'flex',
    gap: '2rem',
    width: '100%',
  },
  statCard: {
    flex: 1,
    padding: '1.25rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  statVal: {
    display: 'block',
    fontSize: '1.75rem',
    fontWeight: '800',
    fontFamily: 'var(--font-display)',
    color: '#ffffff',
    marginBottom: '0.25rem',
  },
  statLabel: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  widgetColumn: {
    display: 'flex',
    justifyContent: 'center',
  },
  widgetCard: {
    width: '100%',
    maxWidth: '460px',
    padding: '2rem',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  glowCyan: {
    animation: 'pulse-cyan 4s infinite ease-in-out',
  },
  glowOrange: {
    animation: 'pulse-orange 4s infinite ease-in-out',
  },
  widgetHeader: {
    marginBottom: '1.5rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '1rem',
  },
  widgetTitle: {
    fontSize: '1.35rem',
    color: '#ffffff',
    marginBottom: '0.25rem',
  },
  widgetSub: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  formGroup: {
    marginBottom: '1.25rem',
  },
  label: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
  },
  selectWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '1rem',
    pointerEvents: 'none',
  },
  select: {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    color: '#ffffff',
    padding: '0.8rem 1rem 0.8rem 2.75rem',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    appearance: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    outline: 'none',
  },
  gridStyleToggle: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '0.75rem',
  },
  styleCard: {
    border: '1px solid var(--border-color)',
    borderRadius: '10px',
    padding: '0.75rem',
    cursor: 'pointer',
    background: 'rgba(255,255,255,0.01)',
    transition: 'all 0.2s ease',
  },
  styleCardHeader: {
    marginBottom: '0.5rem',
  },
  styleCardText: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
    lineHeight: '1.3',
    display: 'block',
  },
  styleCardActiveCyan: {
    borderColor: '#00f2fe',
    background: 'rgba(0, 242, 254, 0.05)',
  },
  styleCardActiveOrange: {
    borderColor: '#ff8c00',
    background: 'rgba(255, 140, 0, 0.05)',
  },
  submitBtn: {
    width: '100%',
    marginTop: '0.5rem',
    padding: '0.9rem',
    fontSize: '0.95rem',
  },
  widgetFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1.25rem',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  footerItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
};
