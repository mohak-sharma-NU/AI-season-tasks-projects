import React, { useState, useEffect } from 'react';
import GoogleMapContainer from './GoogleMapContainer';
import { Calendar, Users, Plus, Trash2, ArrowRight, DollarSign, PenTool, Bus, Car, Globe, MapPin } from 'lucide-react';

export default function ItineraryPlanner({ initialPlan, onBook, onRequestQuote, currency }) {
  const [destination, setDestination] = useState(initialPlan?.destination || 'northern');
  const [scope, setScope] = useState('local'); // 'local' (Regional) or 'national' (Whole Country)
  const [passengers, setPassengers] = useState(initialPlan?.passengers || 2);
  const [currentDay, setCurrentDay] = useState(0);

  // Pakistan routes registry
  const localRoutes = {
    northern: [
      { name: 'Islamabad', activity: 'Arrival in the capital, Margalla Hills sunset dinner.' },
      { name: 'Swat', activity: 'Explore Swat Valley, Malam Jabba ski slopes and river banks.' },
      { name: 'Gilgit', activity: 'Scenic drive to Gilgit, confluence of Karakoram & Himalayas.' },
      { name: 'Hunza', activity: 'Explore Karimabad Baltit Fort and local cafes.' },
      { name: 'Attabad Lake', activity: 'Boating on Attabad Lake and scenic transit to Passu.' }
    ],
    heritage: [
      { name: 'Karachi', activity: 'Visit Quaid-e-Azam Mausoleum and Clifton Beach views.' },
      { name: 'Multan', activity: 'Tour the ancient City of Saints, shrines, and blue pottery shops.' },
      { name: 'Lahore', activity: 'Sightseeing Badshahi Mosque, Shalimar Gardens, and food street.' },
      { name: 'Islamabad', activity: 'Arrival in Islamabad, relax at Lok Virsa museum.' }
    ],
    coastal: [
      { name: 'Karachi', activity: 'Tour historical architecture in old Karachi.' },
      { name: 'Kund Malir', activity: 'Scenic drive on Makran Coastal Highway, Hingol National Park.' },
      { name: 'Ormara', activity: 'Beach camping at Ormara beach under the stars.' },
      { name: 'Gwadar', activity: 'Visit Gwadar Hammerhead, Koh-e-Batil view point.' }
    ]
  };

  const nationalRoute = [
    { name: 'Karachi', activity: 'Starting point - coastal harbor departure.' },
    { name: 'Multan', activity: 'Cross-provincial transit stop, explore historic shrines.' },
    { name: 'Lahore', activity: 'Stopover in Lahore, cultural tours & Mughal food feast.' },
    { name: 'Islamabad', activity: 'Transit stopover in federal capital before heading North.' },
    { name: 'Hunza', activity: 'Final destination in Gilgit-Baltistan, mountain peaks exploration.' }
  ];

  const [stops, setStops] = useState([]);
  const [transportModes, setTransportModes] = useState([]);

  // Load initial stops
  useEffect(() => {
    let routeStops = [];
    if (scope === 'national') {
      routeStops = nationalRoute;
    } else {
      routeStops = localRoutes[destination] || localRoutes.northern;
    }

    const initialStops = routeStops.map((stop, idx) => ({
      name: stop.name,
      activity: stop.activity,
      id: `stop-${idx}-${Date.now()}`
    }));
    
    setStops(initialStops);
    setTransportModes(initialStops.map(() => 'coach'));
    setCurrentDay(0);
  }, [destination, scope]);

  // Handle addition of custom stops from map clicks/searches
  const handleAddStop = (newStop) => {
    if (stops.length >= 8) {
      alert("Maximum of 8 days/stops allowed for demo planning!");
      return;
    }
    const createdStop = {
      name: newStop.name,
      activity: newStop.activity || `Explore ${newStop.name}.`,
      id: `stop-custom-${stops.length}-${Date.now()}`
    };
    setStops([...stops, createdStop]);
    setTransportModes([...transportModes, 'coach']);
    setCurrentDay(stops.length);
  };

  // Update specific day's activity
  const handleActivityChange = (index, value) => {
    const updated = [...stops];
    updated[index].activity = value;
    setStops(updated);
  };

  // Toggle transport mode for a day
  const toggleTransport = (index, mode) => {
    const updated = [...transportModes];
    updated[index] = mode;
    setTransportModes(updated);
  };

  // Remove a day
  const removeDay = (idxToRemove) => {
    if (stops.length <= 2) {
      alert("Minimum of 2 days required in itinerary!");
      return;
    }
    const filteredStops = stops.filter((_, idx) => idx !== idxToRemove);
    const filteredModes = transportModes.filter((_, idx) => idx !== idxToRemove);
    setStops(filteredStops);
    setTransportModes(filteredModes);
    setCurrentDay(Math.max(0, currentDay - 1));
  };

  // Pricing Conversion Logic
  const getRate = (type) => {
    if (currency === 'PKR') {
      return type === 'coach' ? 7000 : 42000; // PKR rates (equivalent to $25 and $150)
    } else {
      return type === 'coach' ? 25 : 150; // USD rates
    }
  };

  const formatPrice = (val) => {
    return currency === 'PKR' ? `₨ ${val.toLocaleString()}` : `$${val.toLocaleString()}`;
  };

  // Calculate pricing summary
  const getPricingSummary = () => {
    let transportSubtotal = 0;
    stops.forEach((_, idx) => {
      const mode = transportModes[idx] || 'coach';
      if (mode === 'coach') {
        transportSubtotal += getRate('coach') * passengers;
      } else {
        transportSubtotal += getRate('car');
      }
    });

    const taxEstimate = Math.round(transportSubtotal * 0.08);
    const grandTotal = transportSubtotal + taxEstimate;

    return {
      subtotal: transportSubtotal,
      tax: taxEstimate,
      total: grandTotal
    };
  };

  const pricing = getPricingSummary();

  return (
    <div style={styles.container} className="animate-slideup">
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Pakistan Travel Planner</h2>
          <p style={styles.sub}>Choose your scope, design your route stops, and select logistics options.</p>
        </div>

        {/* Global Controls */}
        <div style={styles.globalConfig} className="glass">
          {/* Scope selection: regional vs national */}
          <div style={styles.configItem}>
            <Globe size={16} color="var(--text-secondary)" />
            <select 
              value={scope} 
              onChange={(e) => setScope(e.target.value)} 
              style={styles.configSelect}
            >
              <option value="local">Regional Tour (Local Area)</option>
              <option value="national">National Tour (Whole Pakistan)</option>
            </select>
          </div>

          {scope === 'local' && (
            <div style={styles.configItem}>
              <MapPin size={16} color="var(--text-secondary)" />
              <select 
                value={destination} 
                onChange={(e) => setDestination(e.target.value)} 
                style={styles.configSelect}
              >
                <option value="northern">Northern Highlands</option>
                <option value="heritage">Punjab & Sindh Heritage</option>
                <option value="coastal">Balochistan Coastal Highway</option>
              </select>
            </div>
          )}

          <div style={styles.configItem}>
            <Users size={16} color="var(--text-secondary)" />
            <span style={styles.configLabel}>Guests:</span>
            <input 
              type="number" 
              min={1} 
              max={40} 
              value={passengers} 
              onChange={(e) => setPassengers(Math.max(1, Math.min(40, Number(e.target.value))))} 
              style={styles.configInput}
            />
          </div>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Left Side: Timeline Builder */}
        <div style={styles.timelineColumn}>
          <div style={styles.timelineHeader}>
            <span style={styles.timelineTitle}>Itinerary Steps ({stops.length} Days)</span>
          </div>

          <div style={styles.timelineList}>
            {stops.map((stop, idx) => {
              const isActive = idx === currentDay;
              const mode = transportModes[idx] || 'coach';
              
              return (
                <div 
                  key={stop.id}
                  onClick={() => setCurrentDay(idx)}
                  style={{
                    ...styles.dayCard,
                    ...(isActive ? styles.activeDayCard : {})
                  }}
                  className="glass"
                >
                  <div style={styles.dayHeader}>
                    <div style={styles.dayTitleRow}>
                      <span style={{
                        ...styles.dayCircle,
                        ...(isActive ? styles.activeDayCircle : {})
                      }}>{idx + 1}</span>
                      <div>
                        <h4 style={styles.dayStopName}>{stop.name}</h4>
                        <span style={styles.dayLabel}>Itinerary Stop</span>
                      </div>
                    </div>
                    
                    <div style={styles.transitToggle}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleTransport(idx, 'coach'); }}
                        style={{
                          ...styles.transitBtn,
                          ...(mode === 'coach' ? styles.activeTransitCoach : {})
                        }}
                      >
                        <Bus size={14} /> Coach ({formatPrice(getRate('coach'))})
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleTransport(idx, 'car'); }}
                        style={{
                          ...styles.transitBtn,
                          ...(mode === 'car' ? styles.activeTransitCar : {})
                        }}
                      >
                        <Car size={14} /> SUV ({formatPrice(getRate('car'))})
                      </button>
                      
                      {stops.length > 2 && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); removeDay(idx); }}
                          style={styles.deleteStopBtn}
                          title="Remove stop"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  {isActive && (
                    <div style={styles.dayBody} onClick={(e) => e.stopPropagation()}>
                      <label style={styles.inputLabel}>Custom Activity Detail</label>
                      <div style={styles.activityInputWrapper}>
                        <PenTool size={14} color="var(--text-muted)" style={styles.activityIcon} />
                        <input 
                          type="text"
                          value={stop.activity}
                          onChange={(e) => handleActivityChange(idx, e.target.value)}
                          style={styles.activityInput}
                          placeholder="Activities..."
                        />
                      </div>
                      <div style={styles.costBreakdown}>
                        <span>Daily Transit:</span>
                        <span style={styles.costAmount}>
                          {mode === 'coach' 
                            ? `🚌 Luxury Group Coach Seat (x${passengers}) = ${formatPrice(getRate('coach') * passengers)}` 
                            : `🚗 Private Family SUV Flat Rate = ${formatPrice(getRate('car'))}`}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Map & Pricing */}
        <div style={styles.mapColumn}>
          <div style={styles.mapWrapper}>
            <GoogleMapContainer 
              stops={stops}
              currentDayIndex={currentDay}
              onAddStop={handleAddStop}
              transportModes={transportModes}
            />
          </div>

          <div style={styles.pricingCard} className="glass">
            <h4 style={styles.pricingTitle}>Logistical Price Summary</h4>
            
            <div style={styles.priceItem}>
              <span style={styles.priceLabel}>Guests Volume</span>
              <span style={styles.priceValue}>{passengers} Guests</span>
            </div>

            <div style={styles.priceItem}>
              <span style={styles.priceLabel}>Transport Subtotal</span>
              <span style={styles.priceValue}>{formatPrice(pricing.subtotal)}</span>
            </div>

            <div style={styles.priceItem}>
              <span style={styles.priceLabel}>Taxes & Road Tolls</span>
              <span style={styles.priceValue}>{formatPrice(pricing.tax)}</span>
            </div>

            <div style={styles.totalBlock}>
              <span style={styles.totalLabel}>Grand Total</span>
              <span style={styles.totalValue}>{formatPrice(pricing.total)}</span>
            </div>

            <div style={styles.btnStack}>
              <button 
                onClick={() => onBook({ 
                  destination: scope === 'national' ? 'Pakistan Grand Loop' : destination, 
                  passengers, 
                  days: stops.length, 
                  stops: stops.map((s, i) => ({ name: s.name, mode: transportModes[i] })),
                  total: formatPrice(pricing.total) 
                })}
                className="btn-cyan" 
                style={styles.checkoutBtn}
              >
                Proceed to Direct Booking <ArrowRight size={16} />
              </button>

              <button 
                onClick={() => onRequestQuote({ 
                  destination: scope === 'national' ? 'Pakistan Grand Loop' : destination, 
                  passengers, 
                  days: stops.length, 
                  stops: stops.map((s, i) => ({ name: s.name, mode: transportModes[i], activity: s.activity })),
                  total: formatPrice(pricing.total) 
                })}
                style={styles.quoteBtn}
              >
                Request Custom Itinerary Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2.5rem',
    gap: '2rem',
    flexWrap: 'wrap',
  },
  title: {
    fontSize: '2rem',
    color: '#ffffff',
    marginBottom: '0.25rem',
  },
  sub: {
    fontSize: '0.95rem',
    color: 'var(--text-secondary)',
  },
  globalConfig: {
    display: 'flex',
    gap: '1.25rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '12px',
    border: '1px solid var(--border-color)',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  configItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  configLabel: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
  },
  configSelect: {
    background: 'none',
    border: 'none',
    color: '#ffffff',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-display)',
    fontWeight: '600',
    cursor: 'pointer',
    outline: 'none',
  },
  configInput: {
    width: '50px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: '#ffffff',
    padding: '0.25rem 0.5rem',
    fontSize: '0.9rem',
    textAlign: 'center',
    outline: 'none',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1.10fr 0.90fr',
    gap: '2.5rem',
    alignItems: 'start',
  },
  timelineColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  timelineHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineTitle: {
    fontSize: '1.1rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    color: '#ffffff',
  },
  timelineList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  dayCard: {
    padding: '1.25rem',
    border: '1px solid var(--border-color)',
    cursor: 'pointer',
  },
  activeDayCard: {
    borderColor: 'rgba(0, 242, 254, 0.3)',
    boxShadow: 'var(--glow-cyan)',
    background: 'rgba(30, 41, 59, 0.3)',
  },
  dayHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  dayTitleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  dayCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.05)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: '700',
    fontFamily: 'var(--font-display)',
    color: 'var(--text-secondary)',
    border: '1px solid var(--border-color)',
  },
  activeDayCircle: {
    background: 'var(--grad-backpacker)',
    color: '#020617',
    border: 'none',
  },
  dayStopName: {
    fontSize: '1.05rem',
    color: '#ffffff',
  },
  dayLabel: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  transitToggle: {
    display: 'flex',
    background: 'rgba(0,0,0,0.2)',
    padding: '0.2rem',
    borderRadius: '8px',
    border: '1px solid var(--border-color)',
    alignItems: 'center',
  },
  transitBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    fontSize: '0.75rem',
    padding: '0.35rem 0.75rem',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    transition: 'all 0.2s ease',
  },
  activeTransitCoach: {
    background: 'var(--grad-backpacker)',
    color: '#020617',
    fontWeight: '600',
  },
  activeTransitCar: {
    background: 'var(--grad-family)',
    color: '#020617',
    fontWeight: '600',
  },
  deleteStopBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(248, 87, 166, 0.6)',
    padding: '0.35rem 0.5rem',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
    display: 'flex',
    alignItems: 'center',
  },
  dayBody: {
    marginTop: '1.25rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '1rem',
  },
  inputLabel: {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: 'var(--text-secondary)',
    marginBottom: '0.5rem',
  },
  activityInputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  activityIcon: {
    position: 'absolute',
    left: '0.75rem',
  },
  activityInput: {
    width: '100%',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    color: '#ffffff',
    padding: '0.6rem 0.75rem 0.6rem 2.25rem',
    fontSize: '0.9rem',
    fontFamily: 'var(--font-body)',
    outline: 'none',
  },
  costBreakdown: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    marginTop: '0.75rem',
  },
  costAmount: {
    fontWeight: '600',
    color: 'var(--text-secondary)',
  },
  mapColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
  },
  mapWrapper: {
    height: '420px',
  },
  pricingCard: {
    padding: '1.75rem',
    border: '1px solid var(--border-color)',
    borderRadius: '16px',
  },
  pricingTitle: {
    fontSize: '1.1rem',
    color: '#ffffff',
    marginBottom: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '0.5rem',
  },
  priceItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginBottom: '0.75rem',
  },
  priceLabel: {
    color: 'var(--text-secondary)',
  },
  priceValue: {
    color: '#ffffff',
    fontWeight: '600',
  },
  totalBlock: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '1rem',
    marginTop: '1rem',
    marginBottom: '1.5rem',
  },
  totalLabel: {
    fontSize: '1rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  totalValue: {
    fontSize: '1.75rem',
    fontWeight: '800',
    color: '#00f2fe',
    fontFamily: 'var(--font-display)',
  },
  btnStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  checkoutBtn: {
    width: '100%',
    padding: '0.9rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  quoteBtn: {
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
