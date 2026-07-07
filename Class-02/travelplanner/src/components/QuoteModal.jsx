import React, { useState } from 'react';
import { X, ClipboardCheck, ArrowRight, ShieldCheck, Download, Award, FileText } from 'lucide-react';

export default function QuoteModal({ quoteDetails, onClose }) {
  const [step, setStep] = useState('form'); // 'form' or 'proposal'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [childSeats, setChildSeats] = useState(false);
  const [extraLuggage, setExtraLuggage] = useState(false);
  const [routeDeviation, setRouteDeviation] = useState(false);
  const [notes, setNotes] = useState('');

  const handleRequest = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please enter your name and email.');
      return;
    }
    setStep('proposal');
  };

  // Dynamic pricing for quote calculations
  const baseTotal = quoteDetails.total;
  const addonCost = (childSeats ? 15 : 0) + (extraLuggage ? 25 : 0) + (routeDeviation ? 80 : 0);
  const finalQuoteTotal = baseTotal + addonCost;
  const quoteRef = `QT-2026-${Math.floor(100000 + Math.random() * 900000)}`;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} className="glass animate-slideup">
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={20} />
        </button>

        {step === 'form' ? (
          <div>
            <div style={styles.header}>
              <ClipboardCheck size={24} color="#ff8c00" />
              <h3 style={styles.title}>Custom Tourism Quote Request</h3>
            </div>
            
            <p style={styles.intro}>
              Customize your transit schedule and route. Ideal for families requiring child safety seats or backpacker groups carrying extra gear.
            </p>

            <form onSubmit={handleRequest} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  style={styles.input} 
                  placeholder="e.g. John Doe"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  style={styles.input} 
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone Number</label>
                <input 
                  type="text" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  style={styles.input} 
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div style={styles.checkboxGroup}>
                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={childSeats} 
                    onChange={(e) => setChildSeats(e.target.checked)} 
                    style={styles.checkbox}
                  />
                  <div>
                    <span style={styles.checkboxText}>Add Child Safety Seats (+$15)</span>
                    <span style={styles.checkboxDesc}>Essential for infant or family travel safety.</span>
                  </div>
                </label>

                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={extraLuggage} 
                    onChange={(e) => setExtraLuggage(e.target.checked)} 
                    style={styles.checkbox}
                  />
                  <div>
                    <span style={styles.checkboxText}>Extra Outdoor/Backpack Bins (+$25)</span>
                    <span style={styles.checkboxDesc}>Safely store camping gear, surfboards, or oversized luggage.</span>
                  </div>
                </label>

                <label style={styles.checkboxLabel}>
                  <input 
                    type="checkbox" 
                    checked={routeDeviation} 
                    onChange={(e) => setRouteDeviation(e.target.checked)} 
                    style={styles.checkbox}
                  />
                  <div>
                    <span style={styles.checkboxText}>Flexible Route Deviation (+$80)</span>
                    <span style={styles.checkboxDesc}>Allows custom drop-offs at hotels, trails, or restaurants.</span>
                  </div>
                </label>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Additional Requirements / Tour Vibe Notes</label>
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)} 
                  style={styles.textarea} 
                  placeholder="Tell us about special stops, age ranges of kids, or specific transit timings..."
                />
              </div>

              <button type="submit" className="btn-orange" style={styles.submitBtn}>
                Generate Formal Proposal <ArrowRight size={16} />
              </button>
            </form>
          </div>
        ) : (
          <div style={styles.proposalArea}>
            <div style={styles.proposalHeader}>
              <Award size={36} color="#ff8c00" />
              <h3 style={styles.proposalTitle}>Custom Transit Proposal</h3>
              <span style={styles.refCode}>REF ID: {quoteRef}</span>
            </div>

            <p style={styles.proposalDesc}>
              A custom contract offer has been prepared for you. This reflects group transit pricing for your selected stops and active add-ons.
            </p>

            <div style={styles.docBorder}>
              <div style={styles.letterhead}>
                <div>
                  <h4 style={styles.companyName}>ADVENTURE ENTERPRISE</h4>
                  <span style={styles.department}>Tourism & Logistics Wing</span>
                </div>
                <div style={styles.dateStamp}>
                  Date: July 5, 2026
                </div>
              </div>

              <div style={styles.docDivider} />

              <div style={styles.clientSection}>
                <div style={styles.clientLabel}>PREPARED FOR:</div>
                <div style={styles.clientVal}>{name}</div>
                <div style={styles.clientVal}>{email} {phone ? `| ${phone}` : ''}</div>
              </div>

              <div style={styles.itinerarySummary}>
                <div style={styles.summaryGrid}>
                  <div>
                    <span style={styles.summaryLabel}>ROUTE TYPE</span>
                    <span style={styles.summaryText}>{quoteDetails.destination ? quoteDetails.destination.toUpperCase() : 'CUSTOM'} LOOP</span>
                  </div>
                  <div>
                    <span style={styles.summaryLabel}>GUESTS COUNT</span>
                    <span style={styles.summaryText}>{quoteDetails.passengers} Passengers</span>
                  </div>
                  <div>
                    <span style={styles.summaryLabel}>TOTAL TRANSIT</span>
                    <span style={styles.summaryText}>{quoteDetails.days} Days</span>
                  </div>
                </div>

                <div style={styles.stopsBlock}>
                  <span style={styles.summaryLabel}>ROUTE PATHWAY</span>
                  <div style={styles.stopsTimeline}>
                    {quoteDetails.stops && quoteDetails.stops.map((stop, idx) => (
                      <div key={idx} style={styles.stopTimelineItem}>
                        <span style={styles.timelineDot} />
                        <span style={styles.stopText}>Day {idx + 1}: {stop.name} ({stop.mode === 'coach' ? 'Coach Seat' : 'Private SUV'})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div style={styles.docDivider} />

              <div style={styles.costTable}>
                <div style={styles.tableRow}>
                  <span>Base Transport Service Fee</span>
                  <span>${baseTotal}</span>
                </div>
                {childSeats && (
                  <div style={styles.tableRow}>
                    <span>Add-on: Premium Infant/Child Safety Seats</span>
                    <span>$15</span>
                  </div>
                )}
                {extraLuggage && (
                  <div style={styles.tableRow}>
                    <span>Add-on: Dedicated Backpacker Equipment Storage</span>
                    <span>$25</span>
                  </div>
                )}
                {routeDeviation && (
                  <div style={styles.tableRow}>
                    <span>Add-on: Custom Route Drop-off Deviances</span>
                    <span>$80</span>
                  </div>
                )}
                <div style={{...styles.tableRow, ...styles.tableTotalRow}}>
                  <span>TOTAL ESTIMATED CONTRACT RATE</span>
                  <span style={styles.tableTotalVal}>${finalQuoteTotal}</span>
                </div>
              </div>
            </div>

            <div style={styles.btnRow}>
              <button 
                onClick={() => {
                  window.print();
                }} 
                className="btn-cyan" 
                style={styles.actionBtn}
              >
                <Download size={16} /> Print/Save Proposal
              </button>
              
              <button onClick={onClose} className="btn-secondary" style={styles.actionBtn}>
                Close Proposal
              </button>
            </div>

            <div style={styles.proposalFooter}>
              <ShieldCheck size={14} color="#22c55e" />
              <span>Quote reference lock-in period: 30 Days.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(2, 6, 23, 0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '2rem',
  },
  modal: {
    width: '100%',
    maxWidth: '560px',
    padding: '2.5rem',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    position: 'relative',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  closeBtn: {
    position: 'absolute',
    top: '1.25rem',
    right: '1.25rem',
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  title: {
    fontSize: '1.4rem',
    color: '#ffffff',
  },
  intro: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '1.5rem',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
  },
  label: {
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
  },
  input: {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: '#ffffff',
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
  },
  textarea: {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: '#ffffff',
    padding: '0.75rem 1rem',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    minHeight: '80px',
    resize: 'vertical',
  },
  checkboxGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    background: 'rgba(255,255,255,0.01)',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid var(--border-color)',
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.75rem',
    cursor: 'pointer',
  },
  checkbox: {
    marginTop: '0.2rem',
    cursor: 'pointer',
  },
  checkboxText: {
    display: 'block',
    fontSize: '0.85rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  checkboxDesc: {
    display: 'block',
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
  },
  submitBtn: {
    width: '100%',
    padding: '0.9rem',
    marginTop: '0.5rem',
  },
  proposalArea: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  proposalHeader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.25rem',
    marginBottom: '1rem',
  },
  proposalTitle: {
    fontSize: '1.5rem',
    color: '#ffffff',
    marginTop: '0.5rem',
  },
  refCode: {
    fontSize: '0.8rem',
    color: '#ff8c00',
    fontWeight: '700',
    letterSpacing: '0.05em',
  },
  proposalDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
  },
  docBorder: {
    border: '1px solid rgba(255,255,255,0.1)',
    background: '#0a0f1d',
    padding: '1.75rem',
    borderRadius: '12px',
    width: '100%',
    textAlign: 'left',
    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)',
    marginBottom: '1.5rem',
  },
  letterhead: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  companyName: {
    fontSize: '1.1rem',
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    color: '#ffffff',
  },
  department: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
  },
  dateStamp: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  docDivider: {
    height: '1px',
    background: 'rgba(255,255,255,0.06)',
    margin: '1.25rem 0',
  },
  clientSection: {
    marginBottom: '1.25rem',
  },
  clientLabel: {
    fontSize: '0.65rem',
    color: 'var(--text-secondary)',
    letterSpacing: '0.05em',
    marginBottom: '0.25rem',
  },
  clientVal: {
    fontSize: '0.85rem',
    color: '#ffffff',
  },
  itinerarySummary: {
    background: 'rgba(255,255,255,0.02)',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.04)',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '1rem',
    marginBottom: '1rem',
  },
  summaryLabel: {
    display: 'block',
    fontSize: '0.6rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.2rem',
  },
  summaryText: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  stopsBlock: {
    borderTop: '1px solid rgba(255,255,255,0.04)',
    paddingTop: '0.75rem',
  },
  stopsTimeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    marginTop: '0.4rem',
  },
  stopTimelineItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  timelineDot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: '#00f2fe',
  },
  stopText: {
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  costTable: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.6rem',
  },
  tableRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
  },
  tableTotalRow: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    paddingTop: '0.75rem',
    marginTop: '0.5rem',
    color: '#ffffff',
    fontWeight: '700',
  },
  tableTotalVal: {
    color: '#ff8c00',
    fontSize: '1.25rem',
  },
  btnRow: {
    display: 'flex',
    gap: '1rem',
    width: '100%',
    marginBottom: '1.5rem',
  },
  actionBtn: {
    flex: 1,
    padding: '0.8rem',
  },
  proposalFooter: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.4rem',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
};
