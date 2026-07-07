import React, { useState } from 'react';
import { Wifi, BatteryCharging, Tv, Coffee, ShieldAlert, Award, ArrowRight, DollarSign } from 'lucide-react';

export default function FleetCatalog({ onBook, onRequestQuote, currency }) {
  const [vehicle, setVehicle] = useState('coach');
  const [passengers, setPassengers] = useState(2);
  const [days, setDays] = useState(3);

  const getRate = (type) => {
    if (currency === 'PKR') {
      return type === 'coach' ? 7000 : 42000;
    } else {
      return type === 'coach' ? 25 : 150;
    }
  };

  const formatPrice = (val) => {
    return currency === 'PKR' ? `₨ ${val.toLocaleString()}` : `$${val.toLocaleString()}`;
  };

  const vehicles = {
    coach: {
      name: 'Adventure Tour Coach',
      tag: 'Backpacker & Group Choice',
      badgeClass: 'badge-backpacker',
      description: 'Our modern touring coaches are designed for social, eco-friendly, and cost-effective travel across Pakistan. Perfect for solo backpackers, digital nomads, and large family outings.',
      priceText: currency === 'PKR' ? '₨ 7,000 / seat / day' : '$25 / seat / day',
      capacity: 45,
      amenities: [
        { icon: <Wifi size={16} />, label: 'Free High-Speed Wi-Fi' },
        { icon: <BatteryCharging size={16} />, label: 'USB Ports at Every Seat' },
        { icon: <Tv size={16} />, label: 'Entertainment Screens' },
        { icon: <Coffee size={16} />, label: 'On-Board Restrooms & Tea' }
      ]
    },
    car: {
      name: 'Private Family SUV Cruiser',
      tag: 'Comfort & Family Choice',
      badgeClass: 'badge-family',
      description: 'A premium, private transit experience. Customize your stops, travel at your own pace through scenic highways, and enjoy door-to-door convenience with our professional drivers.',
      priceText: currency === 'PKR' ? '₨ 42,000 / vehicle / day' : '$150 / vehicle / day',
      capacity: 7,
      amenities: [
        { icon: <Award size={16} />, label: 'Complimentary Child Seats' },
        { icon: <BatteryCharging size={16} />, label: 'Device Charging & Tablets' },
        { icon: <ShieldAlert size={16} />, label: 'Flexible Route Add-ons' },
        { icon: <Coffee size={16} />, label: 'Climate Control & Refreshments' }
      ]
    }
  };

  const currentVehicle = vehicles[vehicle];
  
  // Calculate pricing
  const calculateTotal = () => {
    if (vehicle === 'coach') {
      return getRate('coach') * passengers * days;
    } else {
      return getRate('car') * days;
    }
  };

  return (
    <section style={styles.section} className="animate-slideup">
      <div style={styles.header}>
        <h2 style={styles.title}>Our Premium Transport Fleet</h2>
        <p style={styles.subtitle}>
          The logistics spine of our Pakistan wing. Safety, comfort, and reliability for local and foreign travelers alike.
        </p>
      </div>

      <div style={styles.grid}>
        {/* Left Side: Fleet Showcase */}
        <div style={styles.fleetSelector}>
          <div style={styles.selectorTabs}>
            <div 
              onClick={() => setVehicle('coach')}
              style={{
                ...styles.selectorCard, 
                ...(vehicle === 'coach' ? styles.activeCoachCard : {})
              }}
              className="glass"
            >
              <span className="badge-backpacker">Luxury Tour Coach</span>
              <h4 style={styles.selectorCardTitle}>Adventure Coach</h4>
              <p style={styles.selectorCardPrice}>From {formatPrice(getRate('coach'))}/day</p>
            </div>

            <div 
              onClick={() => setVehicle('car')}
              style={{
                ...styles.selectorCard, 
                ...(vehicle === 'car' ? styles.activeCarCard : {})
              }}
              className="glass"
            >
              <span className="badge-family">Private Family SUV</span>
              <h4 style={styles.selectorCardTitle}>SUV Cruiser</h4>
              <p style={styles.selectorCardPrice}>From {formatPrice(getRate('car'))}/day</p>
            </div>
          </div>

          <div style={styles.vehicleDetails} className="glass">
            <span className={currentVehicle.badgeClass}>{currentVehicle.tag}</span>
            <h3 style={styles.vehicleName}>{currentVehicle.name}</h3>
            <p style={styles.vehicleDesc}>{currentVehicle.description}</p>
            
            <h4 style={styles.amenitiesTitle}>Premium Amenities Included</h4>
            <div style={styles.amenitiesGrid}>
              {currentVehicle.amenities.map((item, idx) => (
                <div key={idx} style={styles.amenityCard}>
                  <div style={styles.amenityIconWrapper}>{item.icon}</div>
                  <span style={styles.amenityLabel}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Fare Estimator Card */}
        <div style={styles.calculatorWrapper}>
          <div style={styles.calculatorCard} className="glass">
            <h3 style={styles.calcTitle}>Simulated Fare Estimator</h3>
            <p style={styles.calcSub}>Estimate and request transit bookings instantly</p>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Select Vehicle</label>
              <div style={styles.btnGroup}>
                <button 
                  onClick={() => { setVehicle('coach'); setPassengers(Math.min(passengers, 45)); }}
                  style={{
                    ...styles.tabBtn, 
                    ...(vehicle === 'coach' ? styles.activeTabBtnCyan : {})
                  }}
                >
                  Adventure Coach
                </button>
                <button 
                  onClick={() => { setVehicle('car'); setPassengers(Math.min(passengers, 7)); }}
                  style={{
                    ...styles.tabBtn, 
                    ...(vehicle === 'car' ? styles.activeTabBtnOrange : {})
                  }}
                >
                  Family SUV
                </button>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Passengers</label>
              <input 
                type="number" 
                min={1} 
                max={currentVehicle.capacity}
                value={passengers}
                onChange={(e) => setPassengers(Math.max(1, Math.min(currentVehicle.capacity, Number(e.target.value))))}
                style={styles.input}
              />
              <span style={styles.inputHint}>Max Capacity: {currentVehicle.capacity} passengers</span>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Duration (Days)</label>
              <input 
                type="number" 
                min={1} 
                max={30}
                value={days}
                onChange={(e) => setDays(Math.max(1, Math.min(30, Number(e.target.value))))}
                style={styles.input}
              />
            </div>

            <div style={styles.priceSummary}>
              <div style={styles.priceRow}>
                <span>Rate Type:</span>
                <span style={styles.priceValue}>{currentVehicle.priceText}</span>
              </div>
              <div style={styles.totalRow}>
                <span>Estimated Total:</span>
                <span style={styles.totalValue}>{formatPrice(calculateTotal())}</span>
              </div>
            </div>

            <div style={styles.actionColumn}>
              <button 
                onClick={() => onBook({ vehicle, passengers, days, total: formatPrice(calculateTotal()) })}
                className={vehicle === 'coach' ? 'btn-cyan' : 'btn-orange'}
                style={styles.actionButton}
              >
                Simulate Direct Booking <ArrowRight size={16} />
              </button>
              <button 
                onClick={() => onRequestQuote({ vehicle, passengers, days, total: formatPrice(calculateTotal()) })}
                style={styles.quoteButton}
              >
                Request Custom Group Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: '3rem 2rem',
    maxWidth: '1280px',
    margin: '0 auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '0.75rem',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: 'var(--text-secondary)',
    maxWidth: '700px',
    margin: '0 auto',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: '3rem',
    alignItems: 'start',
  },
  fleetSelector: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  selectorTabs: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
  },
  selectorCard: {
    padding: '1.5rem',
    cursor: 'pointer',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '0.5rem',
  },
  activeCoachCard: {
    borderColor: '#00f2fe',
    boxShadow: 'var(--glow-cyan)',
    background: 'rgba(0, 242, 254, 0.05)',
  },
  activeCarCard: {
    borderColor: '#ff8c00',
    boxShadow: 'var(--glow-orange)',
    background: 'rgba(255, 140, 0, 0.05)',
  },
  selectorCardTitle: {
    fontSize: '1.25rem',
    color: '#ffffff',
    marginTop: '0.25rem',
  },
  selectorCardPrice: {
    fontSize: '0.9rem',
    color: 'var(--text-secondary)',
  },
  vehicleDetails: {
    padding: '2.5rem',
    border: '1px solid var(--border-color)',
  },
  vehicleName: {
    fontSize: '1.75rem',
    color: '#ffffff',
    margin: '0.5rem 0 1rem 0',
  },
  vehicleDesc: {
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    marginBottom: '2rem',
    fontSize: '0.95rem',
  },
  amenitiesTitle: {
    fontSize: '1.1rem',
    color: '#ffffff',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    paddingBottom: '0.5rem',
  },
  amenitiesGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1.25rem',
  },
  amenityCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  amenityIconWrapper: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '0.5rem',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
  },
  amenityLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  calculatorWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  calculatorCard: {
    padding: '2rem',
    border: '1px solid var(--border-color)',
    borderRadius: '24px',
  },
  calcTitle: {
    fontSize: '1.35rem',
    color: '#ffffff',
    marginBottom: '0.25rem',
  },
  calcSub: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '1.5rem',
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
  btnGroup: {
    display: 'flex',
    gap: '0.5rem',
    background: 'var(--bg-input)',
    padding: '0.25rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
  },
  tabBtn: {
    flex: 1,
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    padding: '0.5rem',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    fontSize: '0.85rem',
    transition: 'all 0.2s ease',
  },
  activeTabBtnCyan: {
    background: 'var(--grad-backpacker)',
    color: '#020617',
  },
  activeTabBtnOrange: {
    background: 'var(--grad-family)',
    color: '#020617',
  },
  input: {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    color: '#ffffff',
    padding: '0.75rem 1rem',
    fontSize: '0.95rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
    transition: 'all 0.2s ease',
  },
  inputHint: {
    display: 'block',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '0.25rem',
  },
  priceSummary: {
    background: 'rgba(255,255,255,0.02)',
    padding: '1.25rem',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    margin: '1.5rem 0',
  },
  priceRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
  },
  priceValue: {
    fontWeight: '600',
    color: '#ffffff',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '0.75rem',
  },
  totalValue: {
    fontSize: '1.5rem',
    fontWeight: '800',
    color: '#00f2fe',
    fontFamily: 'var(--font-display)',
  },
  actionColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  actionButton: {
    width: '100%',
    padding: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  quoteButton: {
    background: 'none',
    border: '1px dashed var(--text-muted)',
    color: 'var(--text-secondary)',
    padding: '0.8rem',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontFamily: 'var(--font-display)',
    transition: 'all 0.2s ease',
    textAlign: 'center',
  },
};
