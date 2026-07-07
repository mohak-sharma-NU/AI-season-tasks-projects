import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Search, ShieldCheck, Key, RefreshCw, Compass } from 'lucide-react';

// Coordinates registry for Pakistan landmarks
const PAKISTAN_COORDINATES = {
  // Northern Highlands
  'Islamabad': { lat: 33.6844, lng: 73.0479 },
  'Faisal Mosque': { lat: 33.7297, lng: 73.0372 },
  'Swat': { lat: 35.2227, lng: 72.4258 },
  'Malam Jabba': { lat: 34.7994, lng: 72.5714 },
  'Gilgit': { lat: 35.9208, lng: 74.3089 },
  'Hunza': { lat: 36.3167, lng: 74.6500 },
  'Attabad Lake': { lat: 36.3339, lng: 74.8647 },
  'Skardu': { lat: 35.2981, lng: 75.6333 },
  'Shangrila Resort': { lat: 35.4243, lng: 75.5262 },
  'Khunjerab Pass': { lat: 36.8497, lng: 75.4308 },
  
  // Heritage / Punjab & Sindh
  'Karachi': { lat: 24.8607, lng: 67.0011 },
  'Clifton Beach': { lat: 24.8138, lng: 67.0306 },
  'Multan': { lat: 30.1575, lng: 71.5249 },
  'Lahore': { lat: 31.5204, lng: 74.3587 },
  'Badshahi Mosque': { lat: 31.5881, lng: 74.3100 },
  'Peshawar': { lat: 33.9961, lng: 71.4774 },

  // Coastal / Balochistan
  'Gwadar': { lat: 25.1216, lng: 62.3254 },
  'Ormara': { lat: 25.2088, lng: 64.6357 },
  'Kund Malir': { lat: 25.3856, lng: 65.4604 }
};

// Local search database for mock map search
const LOCAL_LANDMARKS_DATABASE = [
  { name: 'Faisal Mosque', location: 'Islamabad', activity: 'Visit the iconic national mosque against the Margalla Hills.' },
  { name: 'Attabad Lake', location: 'Hunza', activity: 'Scenic boating on the turquoise waters of Hunza Valley.' },
  { name: 'Malam Jabba', location: 'Swat', activity: 'Explore the scenic ski resort and ride the chairlift.' },
  { name: 'Shangrila Resort', location: 'Skardu', activity: 'Relax at the heart-shaped Lake Lower Kachura.' },
  { name: 'Badshahi Mosque', location: 'Lahore', activity: 'Walk through Mughal history at Lahore Fort & Walled City.' },
  { name: 'Kund Malir Beach', location: 'Kund Malir', activity: 'Beaches & mud volcanoes along the Makran Coastal Highway.' },
  { name: 'Khunjerab Pass', location: 'Hunza', activity: 'Visit the highest border crossing (Pakistan-China).' }
];

export default function GoogleMapContainer({ stops, currentDayIndex, onAddStop, transportModes }) {
  const mapRef = useRef(null);
  const searchInputRef = useRef(null);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [apiKey, setApiKey] = useState(localStorage.getItem('travel_planner_google_maps_key') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [mockSearchQuery, setMockSearchQuery] = useState('');
  const [mockSearchResults, setMockSearchResults] = useState([]);
  
  // Script loading
  useEffect(() => {
    if (!apiKey) {
      setGoogleMapsLoaded(false);
      return;
    }

    const scriptId = 'google-maps-api-script';
    let script = document.getElementById(scriptId);

    const onScriptLoad = () => {
      setGoogleMapsLoaded(true);
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      script.addEventListener('load', onScriptLoad);
    } else {
      if (window.google && window.google.maps) {
        setGoogleMapsLoaded(true);
      } else {
        script.addEventListener('load', onScriptLoad);
      }
    }

    return () => {
      // Keep script loaded globally, but clean listeners if needed
    };
  }, [apiKey]);

  // Render Google Map
  useEffect(() => {
    if (!googleMapsLoaded || !mapRef.current) return;

    try {
      // Resolve coordinates for current stops
      const resolvedPath = stops.map(stop => {
        const coords = PAKISTAN_COORDINATES[stop.name] || { lat: 30.3753, lng: 69.3451 };
        return new window.google.maps.LatLng(coords.lat, coords.lng);
      });

      // Default map center
      const centerCoords = resolvedPath[currentDayIndex] || { lat: 30.3753, lng: 69.3451 };
      
      const map = new window.google.maps.Map(mapRef.current, {
        center: centerCoords,
        zoom: 6,
        styles: mapDarkStyle, // Deep dark mode map styles
        disableDefaultUI: true,
        zoomControl: true
      });

      // Draw Markers
      const markers = stops.map((stop, idx) => {
        const coords = PAKISTAN_COORDINATES[stop.name] || { lat: 30.3753, lng: 69.3451 };
        const isActive = idx === currentDayIndex;

        const marker = new window.google.maps.Marker({
          position: coords,
          map: map,
          title: stop.name,
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: isActive ? 10 : 6,
            fillColor: isActive ? '#00f2fe' : '#ff8c00',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 1.5
          }
        });

        // Info Window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `<div style="color:#000;padding:5px;"><strong>Day ${idx + 1}: ${stop.name}</strong><br/>${stop.activity}</div>`
        });

        marker.addListener('click', () => {
          infoWindow.open(map, marker);
        });

        return marker;
      });

      // Draw Route Polyline
      if (resolvedPath.length > 1) {
        new window.google.maps.Polyline({
          path: resolvedPath,
          geodesic: true,
          strokeColor: '#00f2fe',
          strokeOpacity: 0.8,
          strokeWeight: 3.5,
          map: map
        });
      }

      // Initialize Places Autocomplete
      if (searchInputRef.current) {
        const autocomplete = new window.google.maps.places.Autocomplete(searchInputRef.current, {
          componentRestrictions: { country: 'pk' },
          fields: ['name', 'geometry', 'formatted_address']
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.geometry && place.name) {
            const newLat = place.geometry.location.lat();
            const newLng = place.geometry.location.lng();
            
            // Register coords dynamically
            PAKISTAN_COORDINATES[place.name] = { lat: newLat, lng: newLng };
            
            onAddStop({
              name: place.name,
              activity: `Explore ${place.name} in Pakistan.`
            });

            if (searchInputRef.current) searchInputRef.current.value = '';
          }
        });
      }

    } catch (e) {
      console.error('Error mounting Google Map:', e);
    }

  }, [googleMapsLoaded, stops, currentDayIndex]);

  // Handle Mock Search
  const handleMockSearch = (e) => {
    const val = e.target.value;
    setMockSearchQuery(val);
    if (!val) {
      setMockSearchResults([]);
      return;
    }
    const results = LOCAL_LANDMARKS_DATABASE.filter(item => 
      item.name.toLowerCase().includes(val.toLowerCase()) ||
      item.location.toLowerCase().includes(val.toLowerCase())
    );
    setMockSearchResults(results);
  };

  const handleSelectMockResult = (item) => {
    onAddStop({
      name: item.name,
      activity: item.activity
    });
    setMockSearchQuery('');
    setMockSearchResults([]);
  };

  // Save API Key
  const handleSaveKey = () => {
    localStorage.setItem('travel_planner_google_maps_key', apiKey);
    setShowSettings(false);
    // Force reload
    window.location.reload();
  };

  // Click on SVG Fallback Node
  const handleNodeClick = (name) => {
    const defaultActivity = `Visit and tour ${name}.`;
    onAddStop({ name, activity: defaultActivity });
  };

  return (
    <div style={styles.container} className="glass">
      {/* Map Header Controls */}
      <div style={styles.header}>
        <div style={styles.titleRow}>
          <Compass size={18} color="#00f2fe" />
          <h4 style={styles.title}>
            {googleMapsLoaded ? 'Live Google Map API' : 'Pakistan Tourism Map'}
          </h4>
        </div>
        
        <button 
          onClick={() => setShowSettings(!showSettings)} 
          style={styles.keyBtn}
          title="Google Maps API settings"
        >
          <Key size={14} /> API Settings
        </button>
      </div>

      {/* Settings Overlay Dropdown */}
      {showSettings && (
        <div style={styles.settingsDropdown} className="glass">
          <label style={styles.settingsLabel}>Google Maps API Key</label>
          <p style={styles.settingsSub}>Paste your billing-enabled Google Maps key here to render live street maps.</p>
          <div style={styles.inputRow}>
            <input 
              type="text" 
              value={apiKey} 
              onChange={(e) => setApiKey(e.target.value)} 
              style={styles.settingsInput}
              placeholder="AIzaSy..." 
            />
            <button onClick={handleSaveKey} className="btn-cyan" style={styles.saveBtn}>
              Save
            </button>
          </div>
        </div>
      )}

      {/* Search Widget */}
      <div style={styles.searchWidget}>
        <Search size={16} color="var(--text-secondary)" style={styles.searchIcon} />
        <input 
          type="text"
          ref={searchInputRef}
          value={mockSearchQuery}
          onChange={handleMockSearch}
          placeholder={googleMapsLoaded ? "Search place in Pakistan..." : "Search e.g. Faisal Mosque, Attabad Lake..."}
          style={styles.searchInput}
        />
        {/* Mock Search Results dropdown */}
        {!googleMapsLoaded && mockSearchResults.length > 0 && (
          <div style={styles.resultsDropdown} className="glass">
            {mockSearchResults.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => handleSelectMockResult(item)}
                style={styles.resultItem}
              >
                <MapPin size={12} color="#ff8c00" />
                <div>
                  <span style={styles.resultName}>{item.name}</span>
                  <span style={styles.resultLoc}>{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map Area */}
      <div style={styles.mapArea}>
        {googleMapsLoaded ? (
          <div ref={mapRef} style={styles.googleMap} />
        ) : (
          /* High-end Styled Pakistan SVG Fallback */
          <div style={styles.svgWrapper}>
            <svg viewBox="0 0 500 400" style={styles.svg}>
              <defs>
                <linearGradient id="svgRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f2fe" />
                  <stop offset="100%" stopColor="#ff8c00" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge>
                    <feMergeNode in="blur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Dotted Connections of active stops */}
              {stops.length > 1 && stops.map((_, idx) => {
                if (idx === stops.length - 1) return null;
                const stopA = stops[idx];
                const stopB = stops[idx + 1];
                const coordsA = PAKISTAN_SVG_NODES[stopA.name];
                const coordsB = PAKISTAN_SVG_NODES[stopB.name];
                if (!coordsA || !coordsB) return null;
                return (
                  <line 
                    key={`line-${idx}`}
                    x1={coordsA.x} y1={coordsA.y}
                    x2={coordsB.x} y2={coordsB.y}
                    stroke="url(#svgRouteGrad)"
                    strokeWidth="3.5"
                    strokeDasharray="6,4"
                    filter="url(#glow)"
                  />
                );
              })}

              {/* Render clickable main tourism nodes */}
              {Object.keys(PAKISTAN_SVG_NODES).map((name) => {
                const node = PAKISTAN_SVG_NODES[name];
                const isSelected = stops.some(s => s.name === name);
                const isActive = stops[currentDayIndex]?.name === name;

                return (
                  <g 
                    key={name} 
                    onClick={() => handleNodeClick(name)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pulsing selection aura */}
                    {isActive && (
                      <circle cx={node.x} cy={node.y} r="14" fill="rgba(0, 242, 254, 0.15)" style={styles.pulseNode}/>
                    )}
                    <circle 
                      cx={node.x} 
                      cy={node.y} 
                      r={isActive ? 8 : isSelected ? 6 : 5}
                      fill={isActive ? '#00f2fe' : isSelected ? '#ff8c00' : 'rgba(255,255,255,0.2)'}
                      stroke="#ffffff"
                      strokeWidth={isActive ? 2 : 1}
                    />
                    <text 
                      x={node.x} 
                      y={node.y - 12}
                      fill={isActive ? '#ffffff' : 'var(--text-secondary)'}
                      fontSize="9"
                      fontWeight={isActive ? '800' : '500'}
                      textAnchor="middle"
                      style={styles.nodeLabel}
                    >
                      {name}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div style={styles.svgOverlayHint}>
              <span>💡 Click map nodes or search spots to build routes.</span>
            </div>
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <ShieldCheck size={14} color="#22c55e" />
        <span style={styles.footerText}>
          {googleMapsLoaded ? 'Live maps connected via Google Places SDK.' : 'Mock engine running. Connect an API Key to activate live street maps.'}
        </span>
      </div>
    </div>
  );
}

// SVG node placements representing Pakistan map
const PAKISTAN_SVG_NODES = {
  'Khunjerab Pass': { x: 340, y: 40 },
  'Hunza': { x: 310, y: 70 },
  'Skardu': { x: 350, y: 90 },
  'Gilgit': { x: 280, y: 80 },
  'Swat': { x: 250, y: 110 },
  'Peshawar': { x: 220, y: 140 },
  'Islamabad': { x: 270, y: 140 },
  'Lahore': { x: 300, y: 200 },
  'Multan': { x: 240, y: 250 },
  'Ormara': { x: 100, y: 340 },
  'Kund Malir': { x: 130, y: 350 },
  'Gwadar': { x: 50, y: 330 },
  'Karachi': { x: 160, y: 360 }
};

const mapDarkStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#d59563" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#9ca5b3" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#746855" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1f2835" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#f3d19c" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#515c6d" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#17263c" }] }
];

const styles = {
  container: {
    padding: '1.25rem',
    border: '1px solid var(--border-color)',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    height: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    paddingBottom: '0.5rem',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  title: {
    fontSize: '1rem',
    color: '#ffffff',
  },
  keyBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid var(--border-color)',
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
  settingsDropdown: {
    background: 'rgba(15,23,42,0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  settingsLabel: {
    fontSize: '0.8rem',
    fontWeight: '700',
    color: '#ffffff',
  },
  settingsSub: {
    fontSize: '0.7rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4',
  },
  inputRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  settingsInput: {
    flex: 1,
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '6px',
    padding: '0.5rem',
    color: '#ffffff',
    fontSize: '0.85rem',
    outline: 'none',
  },
  saveBtn: {
    padding: '0.5rem 1rem',
    fontSize: '0.8rem',
  },
  searchWidget: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: '0.75rem',
  },
  searchInput: {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    padding: '0.6rem 0.75rem 0.6rem 2.25rem',
    color: '#ffffff',
    fontSize: '0.85rem',
    outline: 'none',
    fontFamily: 'var(--font-body)',
  },
  resultsDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'rgba(15, 23, 42, 0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    marginTop: '0.25rem',
    maxHeight: '180px',
    overflowY: 'auto',
    zIndex: 10,
    boxShadow: '0 8px 16px rgba(0,0,0,0.5)',
  },
  resultItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    borderBottom: '1px solid rgba(255,255,255,0.03)',
    transition: 'background 0.2s ease',
  },
  resultName: {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: '600',
    color: '#ffffff',
  },
  resultLoc: {
    display: 'block',
    fontSize: '0.65rem',
    color: 'var(--text-secondary)',
  },
  mapArea: {
    flex: 1,
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.03)',
    borderRadius: '10px',
    position: 'relative',
    overflow: 'hidden',
    minHeight: '260px',
  },
  googleMap: {
    width: '100%',
    height: '100%',
    minHeight: '260px',
  },
  svgWrapper: {
    width: '100%',
    height: '100%',
    background: 'radial-gradient(circle, #0e1629 0%, #060913 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  svg: {
    width: '100%',
    height: '100%',
    maxHeight: '340px',
  },
  svgOverlayHint: {
    position: 'absolute',
    bottom: '0.5rem',
    left: '0.5rem',
    background: 'rgba(0,0,0,0.6)',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    borderTop: '1px solid rgba(255,255,255,0.05)',
    paddingTop: '0.5rem',
  },
  footerText: {
    fontSize: '0.7rem',
    color: 'var(--text-muted)',
  },
  nodeLabel: {
    fontFamily: 'var(--font-display)',
    pointerEvents: 'none',
  }
};
styles.resultItem[':hover'] = {
  background: 'rgba(255,255,255,0.05)'
};
