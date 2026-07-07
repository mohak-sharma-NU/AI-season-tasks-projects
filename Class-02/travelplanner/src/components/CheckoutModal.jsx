import React, { useState } from 'react';
import { X, CheckCircle, Ticket, CreditCard, ShieldCheck } from 'lucide-react';

export default function CheckoutModal({ bookingDetails, onClose }) {
  const [step, setStep] = useState('pay'); // 'pay' or 'success'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');

  const handleConfirm = (e) => {
    e.preventDefault();
    if (!name || !email) {
      alert('Please enter your name and email.');
      return;
    }
    setStep('success');
  };

  const getSeatNumbers = (count) => {
    let seats = [];
    for (let i = 1; i <= count; i++) {
      seats.push(`${Math.floor(Math.random() * 10) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`);
    }
    return seats.join(', ');
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} className="glass animate-slideup">
        <button onClick={onClose} style={styles.closeBtn}>
          <X size={20} />
        </button>

        {step === 'pay' ? (
          <div>
            <div style={styles.header}>
              <CreditCard size={24} color="#00f2fe" />
              <h3 style={styles.title}>Direct Direct Booking Simulator</h3>
            </div>
            
            <p style={styles.intro}>
              Complete this simulated payment to generate your travel tickets and transit passes.
            </p>

            <div style={styles.summaryBox}>
              <h4 style={styles.summaryTitle}>Itinerary Summary</h4>
              <div style={styles.summaryRow}>
                <span>Destination Loop:</span>
                <span style={styles.summaryVal}>{bookingDetails.destination ? bookingDetails.destination.toUpperCase() : 'Custom Loop'}</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Travel Duration:</span>
                <span style={styles.summaryVal}>{bookingDetails.days} Days Transit</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Passenger Count:</span>
                <span style={styles.summaryVal}>{bookingDetails.passengers} Guests</span>
              </div>
              <div style={styles.totalRow}>
                <span>Total Amount:</span>
                <span style={styles.totalVal}>${bookingDetails.total}</span>
              </div>
            </div>

            <form onSubmit={handleConfirm} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Lead Traveler Name</label>
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
                  placeholder="e.g. john@example.com"
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Simulated Card Number</label>
                <input 
                  type="text" 
                  value={cardNumber} 
                  onChange={(e) => setCardNumber(e.target.value)} 
                  style={styles.input} 
                  placeholder="xxxx xxxx xxxx xxxx"
                />
              </div>

              <button type="submit" className="btn-cyan" style={styles.payBtn}>
                Confirm Simulated Payment
              </button>
            </form>
          </div>
        ) : (
          <div style={styles.successArea}>
            <CheckCircle size={56} color="#22c55e" style={styles.successIcon} />
            <h3 style={styles.successTitle}>Booking Confirmed!</h3>
            <p style={styles.successSub}>
              Your simulated payment was processed. We have generated your boarding passes.
            </p>

            <div style={styles.ticketsContainer}>
              {Array.from({ length: bookingDetails.passengers || 1 }).map((_, idx) => {
                const seat = `${Math.floor(Math.random() * 12) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 4))}`;
                return (
                  <div key={idx} style={styles.ticketCard}>
                    <div style={styles.ticketLeft}>
                      <div style={styles.ticketBrand}>ADVENTURE TRANSIT</div>
                      <h4 style={styles.ticketRoute}>
                        {bookingDetails.destination ? bookingDetails.destination.toUpperCase() : 'COASTAL'} LOOP
                      </h4>
                      <div style={styles.ticketDetails}>
                        <div>
                          <div style={styles.ticketLabel}>PASSENGER</div>
                          <div style={styles.ticketVal}>{idx === 0 ? name : `Guest ${idx + 1}`}</div>
                        </div>
                        <div>
                          <div style={styles.ticketLabel}>SEAT</div>
                          <div style={styles.ticketVal}>{seat}</div>
                        </div>
                        <div>
                          <div style={styles.ticketLabel}>CLASS</div>
                          <div style={styles.ticketVal}>Standard Pass</div>
                        </div>
                      </div>
                    </div>
                    
                    <div style={styles.ticketRight}>
                      <Ticket size={24} style={styles.ticketIcon} />
                      <div style={styles.barcode}>
                        ||||| | || ||| || ||
                      </div>
                      <div style={styles.ticketLabel}>GATE PASS</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={onClose} style={styles.closeDoneBtn} className="btn-secondary">
              Close & Return to Planner
            </button>
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
    maxWidth: '520px',
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
  summaryBox: {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid var(--border-color)',
    padding: '1.25rem',
    borderRadius: '12px',
    marginBottom: '1.5rem',
  },
  summaryTitle: {
    fontSize: '0.95rem',
    color: '#ffffff',
    marginBottom: '0.75rem',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.8rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.4rem',
  },
  summaryVal: {
    fontWeight: '600',
    color: '#ffffff',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '0.75rem',
    marginTop: '0.75rem',
  },
  totalVal: {
    fontSize: '1.25rem',
    fontWeight: '800',
    color: '#00f2fe',
    fontFamily: 'var(--font-display)',
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
  payBtn: {
    width: '100%',
    padding: '0.9rem',
    marginTop: '0.5rem',
  },
  successArea: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: '1rem',
  },
  successTitle: {
    fontSize: '1.6rem',
    color: '#ffffff',
    marginBottom: '0.5rem',
  },
  successSub: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginBottom: '2rem',
  },
  ticketsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    width: '100%',
    maxHeight: '300px',
    overflowY: 'auto',
    marginBottom: '2rem',
    paddingRight: '0.25rem',
  },
  ticketCard: {
    background: 'linear-gradient(90deg, #1e293b 70%, #0f172a 70%)',
    borderRadius: '12px',
    border: '1px dashed rgba(255,255,255,0.15)',
    display: 'flex',
    color: '#ffffff',
    overflow: 'hidden',
  },
  ticketLeft: {
    flex: '1',
    padding: '1rem',
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  ticketBrand: {
    fontSize: '0.65rem',
    fontWeight: '800',
    color: '#00f2fe',
    letterSpacing: '0.05em',
  },
  ticketRoute: {
    fontSize: '1.1rem',
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    letterSpacing: '-0.01em',
  },
  ticketDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '0.25rem',
    gap: '1rem',
  },
  ticketLabel: {
    fontSize: '0.55rem',
    color: 'var(--text-secondary)',
    textTransform: 'uppercase',
  },
  ticketVal: {
    fontSize: '0.8rem',
    fontWeight: '600',
  },
  ticketRight: {
    width: '30%',
    borderLeft: '1px dashed rgba(255, 255, 255, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.5rem',
    gap: '0.4rem',
  },
  ticketIcon: {
    color: '#ff8c00',
  },
  barcode: {
    fontFamily: 'monospace',
    fontSize: '8px',
    letterSpacing: '1px',
    color: 'var(--text-secondary)',
  },
  closeDoneBtn: {
    width: '100%',
    padding: '0.8rem',
  },
};
