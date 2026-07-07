import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FleetCatalog from './components/FleetCatalog';
import ItineraryPlanner from './components/ItineraryPlanner';
import CheckoutModal from './components/CheckoutModal';
import QuoteModal from './components/QuoteModal';
import { Compass, Ship, Clock, ShieldCheck, Heart, Globe, ArrowRight, Star, DollarSign } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [initialPlan, setInitialPlan] = useState(null);
  const [currency, setCurrency] = useState('PKR'); // 'PKR' or 'USD'
  const [touristType, setTouristType] = useState('local'); // 'local' or 'foreign'
  
  // Modal states
  const [checkoutData, setCheckoutData] = useState(null);
  const [quoteData, setQuoteData] = useState(null);

  // Handle planner generation from Hero or Package cards
  const startPlan = (plan) => {
    setInitialPlan({
      ...plan,
      passengers: plan.vibe === 'backpacker' ? 1 : 4
    });
    setActiveTab('planner');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Convert rate displays on landing page
  const formatPrice = (valUsd) => {
    if (currency === 'PKR') {
      return `₨ ${(valUsd * 280).toLocaleString()}`;
    } else {
      return `$${valUsd.toLocaleString()}`;
    }
  };

  // Curated Pakistan packages
  const featuredPackages = [
    {
      id: 'pack-pk-1',
      title: 'Karakoram Express Loop',
      tag: 'Solo & Backpacker Choice',
      badgeClass: 'badge-backpacker',
      desc: 'Embark on the legendary Karakoram Highway. Experience Hunza Valley, Attabad Lake, and reach the China-Pakistan border at Khunjerab Pass.',
      duration: '5 Days Tour',
      destination: 'northern',
      vibe: 'backpacker',
      days: 5,
      rating: '4.9',
      reviews: '148',
      basePriceUsd: 125 // $125 USD (approx ₨ 35,000)
    },
    {
      id: 'pack-pk-2',
      title: 'Punjab & Sindh Mughal Heritage',
      tag: 'Family & Group Comfort',
      badgeClass: 'badge-family',
      desc: 'Journey through Pakistan\'s cultural core from Karachi to Lahore and Islamabad. Visit historical shrines in Multan and Mughal forts in Lahore.',
      duration: '5 Days Tour',
      destination: 'heritage',
      vibe: 'family',
      days: 5,
      rating: '4.8',
      reviews: '96',
      basePriceUsd: 750 // $750 USD (approx ₨ 210,000)
    },
    {
      id: 'pack-pk-3',
      title: 'Balochistan Coastal Highway',
      tag: 'Adventure Lovers',
      badgeClass: 'badge-backpacker',
      desc: 'Drive along the Makran Coastal Highway. Witness the Sphinx, mud volcanoes of Hingol, and camp on Ormara Beach, ending in Gwadar port.',
      duration: '4 Days Tour',
      destination: 'coastal',
      vibe: 'backpacker',
      days: 4,
      rating: '4.9',
      reviews: '74',
      basePriceUsd: 100 // $100 USD (approx ₨ 28,000)
    }
  ];

  return (
    <div style={styles.app}>
      {/* Settings Banner (Top Strip) */}
      <div style={styles.topStrip}>
        <div style={styles.topStripContainer}>
          <div style={styles.stripGroup}>
            <span style={styles.stripLabel}>Traveler:</span>
            <button 
              onClick={() => { setTouristType('local'); setCurrency('PKR'); }} 
              style={{...styles.stripBtn, ...(touristType === 'local' ? styles.activeStripBtn : {})}}
            >
              🇵🇰 Local Tourist
            </button>
            <button 
              onClick={() => { setTouristType('foreign'); setCurrency('USD'); }} 
              style={{...styles.stripBtn, ...(touristType === 'foreign' ? styles.activeStripBtn : {})}}
            >
              🌐 Foreign Tourist
            </button>
          </div>

          <div style={styles.stripGroup}>
            <span style={styles.stripLabel}>Currency:</span>
            <button 
              onClick={() => setCurrency('PKR')} 
              style={{...styles.currencyBtn, ...(currency === 'PKR' ? styles.activeCurrencyBtn : {})}}
            >
              PKR (₨)
            </button>
            <button 
              onClick={() => setCurrency('USD')} 
              style={{...styles.currencyBtn, ...(currency === 'USD' ? styles.activeCurrencyBtn : {})}}
            >
              USD ($)
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <Navbar onNavigate={setActiveTab} activeTab={activeTab} />

      {/* Main Content Area */}
      <main style={styles.main}>
        {activeTab === 'home' && (
          <div>
            {/* Hero Banner with Planner Quick Form */}
            <Hero onStartPlan={startPlan} />

            {/* Featured Packages Section */}
            <section style={styles.packagesSection} className="animate-slideup">
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>Curated Pakistan Tour Packages</h2>
                <p style={styles.sectionSub}>Pre-designed loops linking prime logistic hubs, historical sites, and mountain passes.</p>
              </div>

              <div style={styles.packagesGrid}>
                {featuredPackages.map((pack) => (
                  <div key={pack.id} style={styles.packageCard} className="glass glass-hover">
                    <div style={styles.packageHeader}>
                      <span className={pack.badgeClass}>{pack.tag}</span>
                      <span style={styles.packageDuration}>{pack.duration}</span>
                    </div>

                    <h3 style={styles.packageTitle}>{pack.title}</h3>
                    <p style={styles.packageDesc}>{pack.desc}</p>

                    <div style={styles.packageMeta}>
                      <div style={styles.ratingBox}>
                        <Star size={16} fill="#ff8c00" color="#ff8c00" />
                        <span style={styles.ratingVal}>{pack.rating}</span>
                        <span style={styles.reviewsCount}>({pack.reviews})</span>
                      </div>
                      <div style={styles.costBox}>
                        {formatPrice(pack.basePriceUsd)}
                      </div>
                    </div>

                    <button 
                      onClick={() => startPlan({ vibe: pack.vibe, days: pack.days, destination: pack.destination })}
                      style={styles.importBtn}
                      className={pack.vibe === 'backpacker' ? 'btn-cyan' : 'btn-orange'}
                    >
                      Import to Itinerary Planner <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Why Choose Us Section */}
            <section style={styles.whySection} className="glass animate-slideup">
              <div style={styles.whyGrid}>
                <div style={styles.whyText}>
                  <h2 style={styles.whyTitle}>
                    {touristType === 'local' ? 'Family Travels in Pakistan' : 'Premium Escorted Logistics'}
                  </h2>
                  <p style={styles.whyDesc}>
                    {touristType === 'local' 
                      ? 'Enjoy road trips across Pakistan with your family. We offer private SUV fleets with certified local drivers and luxury tour coaches with dedicated family compartments.'
                      : 'Explore Pakistan with complete peace of mind. We provide complete logistic support for international tourists, handling airport meet-and-greets, security clearance road protocols, and english-speaking host drivers.'}
                  </p>
                  <ul style={styles.bullets}>
                    {touristType === 'local' ? (
                      <>
                        <li style={styles.bulletItem}><ShieldCheck size={16} color="#00f2fe" /> 24/7 Live GPS tracking shared with family</li>
                        <li style={styles.bulletItem}><ShieldCheck size={16} color="#00f2fe" /> Custom refreshment stops at premium highway rest areas</li>
                        <li style={styles.bulletItem}><ShieldCheck size={16} color="#00f2fe" /> Certified child seat attachments for SUVs</li>
                      </>
                    ) : (
                      <>
                        <li style={styles.bulletItem}><ShieldCheck size={16} color="#00f2fe" /> Dedicated English-speaking driver and tour guides</li>
                        <li style={styles.bulletItem}><ShieldCheck size={16} color="#00f2fe" /> Airport pick-up, local SIM card & cash exchange setups</li>
                        <li style={styles.bulletItem}><ShieldCheck size={16} color="#00f2fe" /> Logistics coordination with security road protocols</li>
                      </>
                    )}
                  </ul>
                </div>
                
                <div style={styles.whyInteractiveBox}>
                  <div style={styles.cardGlow} />
                  <div style={styles.gimmickCard}>
                    <h4 style={styles.gimmickTitle}>Corporate Guarantee</h4>
                    <p style={styles.gimmickText}>
                      We guarantee seat availability and price matching on all customized family routes and group tours.
                    </p>
                    <button onClick={() => setActiveTab('fleet')} style={styles.gimmickBtn} className="btn-cyan">
                      Browse Pakistan Fleet Specs
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'planner' && (
          <ItineraryPlanner 
            initialPlan={initialPlan} 
            onBook={(details) => setCheckoutData(details)}
            onRequestQuote={(details) => setQuoteData(details)}
            currency={currency}
          />
        )}

        {activeTab === 'fleet' && (
          <FleetCatalog 
            onBook={(details) => setCheckoutData(details)}
            onRequestQuote={(details) => setQuoteData(details)}
            currency={currency}
          />
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer} className="glass">
        <div style={styles.footerContainer}>
          <div>
            <span style={styles.footerLogo}>ADVENTURE <span style={styles.logoHighlight}>TRANSIT</span></span>
            <p style={styles.footerTagline}>Expanding the horizon of tourism and transport logistics in Pakistan.</p>
          </div>
          <div style={styles.footerLinks}>
            <div>
              <h5 style={styles.linkHeader}>Enterprise</h5>
              <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('fleet');}} style={styles.link}>Our Fleet</a>
              <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('home');}} style={styles.link}>Investments</a>
            </div>
            <div>
              <h5 style={styles.linkHeader}>Tourism</h5>
              <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('planner');}} style={styles.link}>Trip Planner</a>
              <a href="#" onClick={(e) => {e.preventDefault(); setActiveTab('home');}} style={styles.link}>Destinations</a>
            </div>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <span>© 2026 Adventure Transit Logistical Enterprise Pakistan. All Rights Reserved. (Demo Concept)</span>
        </div>
      </footer>

      {/* Overlay Modals */}
      {checkoutData && (
        <CheckoutModal 
          bookingDetails={checkoutData} 
          onClose={() => setCheckoutData(null)} 
        />
      )}

      {quoteData && (
        <QuoteModal 
          quoteDetails={quoteData} 
          onClose={() => setQuoteData(null)} 
        />
      )}
    </div>
  );
}

const styles = {
  app: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    background: 'var(--bg-main)',
  },
  topStrip: {
    background: '#0a0f1d',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '0.4rem 2rem',
    fontSize: '0.8rem',
  },
  topStripContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '0.5rem',
  },
  stripGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  stripLabel: {
    color: 'var(--text-secondary)',
    fontWeight: '600',
  },
  stripBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
    transition: 'all 0.2s ease',
  },
  activeStripBtn: {
    background: 'rgba(0, 242, 254, 0.1)',
    color: '#00f2fe',
    fontWeight: '700',
  },
  currencyBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '0.2rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.75rem',
  },
  activeCurrencyBtn: {
    background: 'rgba(255, 140, 0, 0.15)',
    color: '#ff8c00',
    fontWeight: '700',
  },
  main: {
    flex: '1',
    width: '100%',
  },
  packagesSection: {
    maxWidth: '1280px',
    margin: '4rem auto',
    padding: '0 2rem',
  },
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '3rem',
  },
  sectionTitle: {
    fontSize: '2.25rem',
    color: '#ffffff',
    marginBottom: '0.75rem',
  },
  sectionSub: {
    fontSize: '1rem',
    color: 'var(--text-secondary)',
    maxWidth: '600px',
    margin: '0 auto',
  },
  packagesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: '2rem',
  },
  packageCard: {
    padding: '2rem',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  packageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: '1rem',
  },
  packageDuration: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    fontWeight: '600',
  },
  packageTitle: {
    fontSize: '1.25rem',
    color: '#ffffff',
    marginBottom: '0.75rem',
  },
  packageDesc: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginBottom: '1.5rem',
    flex: 1,
  },
  packageMeta: {
    width: '100%',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    paddingTop: '1rem',
    marginBottom: '1.25rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
  },
  ratingVal: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  reviewsCount: {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
  costBox: {
    fontSize: '0.85rem',
    fontWeight: '700',
    color: '#00f2fe',
  },
  importBtn: {
    width: '100%',
    padding: '0.75rem',
    fontSize: '0.85rem',
  },
  whySection: {
    maxWidth: '1280px',
    margin: '0 auto 6rem auto',
    padding: '3rem',
    borderRadius: '24px',
    border: '1px solid var(--border-color)',
    position: 'relative',
    overflow: 'hidden',
  },
  whyGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: '3rem',
    alignItems: 'center',
  },
  whyText: {
    textAlign: 'left',
  },
  whyTitle: {
    fontSize: '2rem',
    color: '#ffffff',
    marginBottom: '1rem',
  },
  whyDesc: {
    color: 'var(--text-secondary)',
    lineHeight: '1.6',
    fontSize: '0.95rem',
    marginBottom: '1.5rem',
  },
  bullets: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  bulletItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    fontSize: '0.9rem',
    color: '#ffffff',
  },
  whyInteractiveBox: {
    position: 'relative',
    padding: '2.5rem',
    borderRadius: '16px',
    background: 'rgba(15, 23, 42, 0.4)',
    border: '1px solid rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  cardGlow: {
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle at center, rgba(0, 242, 254, 0.1) 0%, transparent 60%)',
    pointerEvents: 'none',
  },
  gimmickCard: {
    position: 'relative',
    zIndex: 1,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.75rem',
  },
  gimmickTitle: {
    fontSize: '1.2/rem',
    color: '#ffffff',
  },
  gimmickText: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.5',
    marginBottom: '0.75rem',
  },
  gimmickBtn: {
    padding: '0.6rem 1.25rem',
    fontSize: '0.85rem',
  },
  footer: {
    borderTop: '1px solid var(--border-color)',
    borderRadius: '0',
    marginTop: '6rem',
    padding: '3rem 2rem 1.5rem 2rem',
  },
  footerContainer: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: '3rem',
  },
  footerLogo: {
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    fontSize: '1.35rem',
    letterSpacing: '0.05em',
    color: '#ffffff',
  },
  logoHighlight: {
    background: 'var(--grad-backpacker)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  footerTagline: {
    fontSize: '0.85rem',
    color: 'var(--text-secondary)',
    marginTop: '0.5rem',
  },
  footerLinks: {
    display: 'flex',
    gap: '4rem',
  },
  linkHeader: {
    fontSize: '0.9rem',
    color: '#ffffff',
    marginBottom: '1rem',
  },
  link: {
    display: 'block',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    fontSize: '0.85rem',
    marginBottom: '0.5rem',
    transition: 'color 0.2s ease',
  },
  footerBottom: {
    maxWidth: '1280px',
    margin: '3rem auto 0 auto',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '1.5rem',
    textAlign: 'center',
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
  },
};
