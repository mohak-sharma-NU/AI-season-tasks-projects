import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  Legend
} from "recharts";
import {
  TrendingUp,
  Bus,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Sliders,
  Download,
  Plus,
  X,
  Search,
  Sparkles,
  RefreshCw,
  SlidersHorizontal,
  Briefcase,
  ArrowRight,
  ShieldCheck,
  Ticket,
  ChevronRight,
  Info,
  Layers,
  Map as MapIcon,
  Wrench,
  Gauge,
  MessageSquare,
  Send,
  Bot,
  Heart,
  Wallet,
  User,
  Lock,
  LogOut,
  Navigation,
  Compass,
  Check,
  Sun,
  Moon
} from "lucide-react";

// Types
interface Vehicle {
  id: string;
  type: "Coach" | "Sky-Linx" | "Sprinter Van";
  route: string;
  status: "EN ROUTE" | "BOARDING" | "IDLE" | "MAINTENANCE";
  load: number;
  capacity: number;
  eta: string;
  fuel: number; // percentage
  driver: string;
}

interface RouteDetail {
  id: string;
  name: string;
  duration: string;
  demand: "High" | "Medium" | "Low";
  basePrice: number;
  cities: string[];
  stops: string[];
  frequency: string;
  description: string;
}

interface Booking {
  id: string;
  routeId: string;
  routeName: string;
  passengerName: string;
  passengerEmail: string;
  seats: number[];
  vehicleId: string;
  totalPaid: number;
  date: string;
  status: "Confirmed" | "Checked In";
}

// Mock Data
const INITIAL_VEHICLES: Vehicle[] = [
  { id: "EX-COACH-104", type: "Coach", route: "Alpine Vista Loop", status: "EN ROUTE", load: 42, capacity: 48, eta: "12:45 PM", fuel: 78, driver: "Sarah Connor" },
  { id: "SKY-LINX-09", type: "Sky-Linx", route: "Metropolis Express", status: "BOARDING", load: 8, capacity: 12, eta: "01:15 PM", fuel: 92, driver: "John Doe" },
  { id: "EX-COACH-212", type: "Coach", route: "Coastal Heritage", status: "EN ROUTE", load: 38, capacity: 48, eta: "11:55 AM", fuel: 45, driver: "Alex Mercer" },
  { id: "VAN-SPR-004", type: "Sprinter Van", route: "Private Charter #82", status: "IDLE", load: 0, capacity: 8, eta: "N/A", fuel: 85, driver: "Elena Fisher" },
  { id: "EX-COACH-098", type: "Coach", route: "Grand Canyon South", status: "EN ROUTE", load: 45, capacity: 48, eta: "02:30 PM", fuel: 62, driver: "Marcus Aurelius" }
];

const ROUTES: RouteDetail[] = [
  {
    id: "route-1",
    name: "Alpine Vista Loop",
    duration: "14 Days",
    demand: "High",
    basePrice: 1250,
    cities: ["Denver", "Aspen", "Vail", "Telluride", "Salt Lake City"],
    stops: ["Red Rocks Amphitheater", "Glenwood Hot Springs", "Maroon Bells", "Arches National Park"],
    frequency: "Daily - 8:00 AM",
    description: "Our signature luxury coach tour through the breathtaking Rocky Mountains, offering unmatched scenic views, high-end resort stays, and premium culinary stops."
  },
  {
    id: "route-2",
    name: "Metropolis Express",
    duration: "5 Days",
    demand: "High",
    basePrice: 550,
    cities: ["New York", "Philadelphia", "Washington D.C.", "Boston"],
    stops: ["Central Park Tour", "Independence Hall", "Capitol Hill VIP Access", "Freedom Trail"],
    frequency: "Every 4 Hours",
    description: "Premium shuttle connection between northeastern economic corridors. Features business-class high-speed Wi-Fi, lie-flat seats, and onboard catering."
  },
  {
    id: "route-3",
    name: "Coastal Heritage",
    duration: "7 Days",
    demand: "Medium",
    basePrice: 850,
    cities: ["San Francisco", "Monterey", "Santa Barbara", "Los Angeles", "San Diego"],
    stops: ["Golden Gate State Park", "17-Mile Drive Coastline", "Hearst Castle Guided Tour", "Malibu Sunset Dinner"],
    frequency: "Daily - 9:30 AM",
    description: "Travel the iconic Highway 1 with ocean panoramas, historic seaside landmarks, coastal wine tastings, and pristine boutique oceanfront accommodations."
  },
  {
    id: "route-4",
    name: "Grand Canyon South",
    duration: "3 Days",
    demand: "High",
    basePrice: 390,
    cities: ["Las Vegas", "Flagstaff", "Sedona", "Grand Canyon Village"],
    stops: ["Hoover Dam Overlook", "Sedona Red Rock Jeep Tour", "Mather Point Rim Sunset", "Desert View Watchtower"],
    frequency: "Daily - 6:00 AM",
    description: "The ultimate southwest adventure. Seamless transit from the lights of Vegas to the deep majesty of the Grand Canyon with professional geologist guides."
  },
  {
    id: "route-5",
    name: "Pacific Rainforest Trail",
    duration: "8 Days",
    demand: "Medium",
    basePrice: 980,
    cities: ["Seattle", "Tacoma", "Olympia", "Portland", "Eugene"],
    stops: ["Chihuly Garden and Glass", "Olympic National Park Rainforest", "Cannon Beach", "Multnomah Falls"],
    frequency: "Mon, Wed, Fri - 7:30 AM",
    description: "An immersive ecosystem tour exploring rich evergreens, wild coastline, high-tech coffee roasteries, and award-winning organic farm-to-table diners."
  }
];

export interface EarthCity {
  code: string;
  name: string;
  lat: number;
  lng: number;
  x: number; // local relative projection x (0 to 500)
  y: number; // local relative projection y (0 to 300)
  notes: string;
  continent: string;
}

export const EARTH_CITIES: EarthCity[] = [
  { code: "SFO", name: "San Francisco", lat: 37.7749, lng: -122.4194, x: 70, y: 110, notes: "West Coast operations hub and Pacific gateway terminal.", continent: "North America" },
  { code: "DEN", name: "Denver", lat: 39.7392, lng: -104.9903, x: 105, y: 105, notes: "Rocky Mountain dispatch node. Altitude core operations.", continent: "North America" },
  { code: "LAX", name: "Los Angeles", lat: 34.0522, lng: -118.2437, x: 78, y: 120, notes: "Southern California luxury logistics depot.", continent: "North America" },
  { code: "NYC", name: "New York", lat: 40.7128, lng: -74.0060, x: 160, y: 100, notes: "Northeastern high-capacity premium transit link.", continent: "North America" },
  { code: "MIA", name: "Miami", lat: 25.7617, lng: -80.1918, x: 150, y: 140, notes: "Florida Peninsula and Caribbean premium portal.", continent: "North America" },
  { code: "LON", name: "London", lat: 51.5074, lng: -0.1278, x: 260, y: 80, notes: "United Kingdom prime terminal. Intercontinental connector.", continent: "Europe" },
  { code: "PAR", name: "Paris", lat: 48.8566, lng: 2.3522, x: 275, y: 85, notes: "Continental Europe high-speed connection node.", continent: "Europe" },
  { code: "DXB", name: "Dubai", lat: 25.2048, lng: 55.2708, x: 370, y: 145, notes: "Middle Eastern luxury tourism operations center.", continent: "Asia" },
  { code: "TYO", name: "Tokyo", lat: 35.6762, lng: 139.6503, x: 440, y: 115, notes: "Far East bullet speed bullet-train and coach apex.", continent: "Asia" },
  { code: "CPT", name: "Cape Town", lat: -33.9249, lng: 18.4241, x: 295, y: 260, notes: "South African coastline scenic safari launch point.", continent: "Africa" },
  { code: "SYD", name: "Sydney", lat: -33.8688, lng: 151.2093, x: 465, y: 260, notes: "Australia Scenic Harbor & Outback dispatch headquarters.", continent: "Oceania" }
];

export function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3958.8; // Earth radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

const INITIAL_BOOKINGS: Booking[] = [
  {
    id: "BK-8491",
    routeId: "route-1",
    routeName: "Alpine Vista Loop",
    passengerName: "Charlotte Sterling",
    passengerEmail: "charlotte@sterlingcorp.com",
    seats: [11, 12],
    vehicleId: "EX-COACH-104",
    totalPaid: 2540,
    date: "2026-07-06",
    status: "Checked In"
  },
  {
    id: "BK-2951",
    routeId: "route-3",
    routeName: "Coastal Heritage",
    passengerName: "Dr. David Vance",
    passengerEmail: "d.vance@oceanography.org",
    seats: [24],
    vehicleId: "EX-COACH-212",
    totalPaid: 865,
    date: "2026-07-07",
    status: "Confirmed"
  },
  {
    id: "BK-1104",
    routeId: "route-2",
    routeName: "Metropolis Express",
    passengerName: "Hamilton Investment Group",
    passengerEmail: "contact@hamilton.co",
    seats: [1, 2, 3, 4],
    vehicleId: "SKY-LINX-09",
    totalPaid: 2240,
    date: "2026-07-05",
    status: "Checked In"
  }
];

interface Transaction {
  id: string;
  type: "Deposit" | "Booking Purchase" | "Cancellation Refund" | "Surcharge Fee";
  amount: number;
  description: string;
  date: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: "admin" | "customer";
  balance: number;
  wishlist: string[]; // array of route IDs
  transactions: Transaction[];
}

export default function App() {
  // Authentication & Session State
  const [currentUser, setCurrentUser] = useState<UserProfile | null>({
    name: "User One",
    email: "UserOne@gmail.com",
    role: "customer",
    balance: 5000,
    wishlist: ["route-1", "route-3"],
    transactions: [
      { id: "TX-9901", type: "Deposit", amount: 5000, description: "Opening Portfolio Provisioning", date: "2026-07-06" }
    ]
  });

  const [loginForm, setLoginForm] = useState({ email: "", password: "", role: "customer" as "customer" | "admin" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Custom Toast Notification System
  const [notifications, setNotifications] = useState<Array<{ id: string; text: string; type: "success" | "error" | "info" }>>([]);

  const triggerNotification = (text: string, type: "success" | "error" | "info" = "success") => {
    const id = Math.random().toString();
    setNotifications((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4500);
  };

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Customer Tabs & Navigation (reduced to three primary pages: map, tripDeciding, booking)
  const [customerTab, setCustomerTab] = useState<"map" | "tripDeciding" | "booking">("map");

  // Real Earth Route-Builder Node Selection Parameters
  const [selectedStartNode, setSelectedStartNode] = useState<string | null>("SFO");
  const [selectedEndNode, setSelectedEndNode] = useState<string | null>("NYC");
  const [selectedEarthVehicle, setSelectedEarthVehicle] = useState<"Coach" | "Sky-Linx" | "Sprinter Van">("Coach");

  // Navigation
  const [activeTab, setActiveTab] = useState<"dashboard" | "routes" | "fleet" | "bookings" | "analytics">("dashboard");

  // State
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [feeSurcharge, setFeeSurcharge] = useState<number>(45); // fuel/booking premium fee
  const [taxRate, setTaxRate] = useState<number>(8.5); // sales tax rate in percent
  const [searchRoute, setSearchRoute] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [optimizing, setOptimizing] = useState(false);
  const [optimizerLog, setOptimizerLog] = useState<string[]>([]);
  const [countdown, setCountdown] = useState(4);

  // Modals & Booking states
  const [isNewItineraryOpen, setIsNewItineraryOpen] = useState(false);
  const [newItineraryData, setNewItineraryData] = useState({
    name: "",
    duration: "5 Days",
    demand: "Medium" as const,
    basePrice: 450,
    cities: "",
    stops: "",
    frequency: "Daily - 9:00 AM",
    description: ""
  });

  const [isBookingDrawerOpen, setIsBookingDrawerOpen] = useState(false);
  const [bookingStep, setBookingStep] = useState<1 | 2 | 3>(1);
  const [selectedRouteForBooking, setSelectedRouteForBooking] = useState<RouteDetail>(ROUTES[0]);
  const [selectedVehicleForBooking, setSelectedVehicleForBooking] = useState<Vehicle>(INITIAL_VEHICLES[0]);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    seats: [] as number[],
    agreeToTerms: false
  });

  // Dynamic AI custom trip planner generator input
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<{
    routeName: string;
    cities: string[];
    stops: string[];
    price: number;
    description: string;
    vehicleRecommendation: string;
  } | null>(null);

  // Chatbot states
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string; timestamp: string }>>([
    {
      role: "assistant",
      content: "Welcome to Travel-Planner-Website Concierge Desk! I am your real-time Operations Assistant. How can I help you optimize your journey, understand our fleet, or manage dispatches today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [currentChatMessage, setCurrentChatMessage] = useState("");
  const [isChatbotTyping, setIsChatbotTyping] = useState(false);

  // Chatbot message handler
  const handleSendChatMessage = async (msgText?: string) => {
    const textToSend = msgText || currentChatMessage;
    if (!textToSend.trim()) return;

    const userMsg = {
      role: "user" as const,
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!msgText) {
      setCurrentChatMessage("");
    }
    setIsChatbotTyping(true);

    try {
      const payloadMessages = [...chatMessages, userMsg].map((msg) => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: payloadMessages })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (error) {
      console.error("Chat message failed:", error);
      // premium local fallback
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: "I'm having trouble reaching our operational grid, but I can confirm our EX-COACH luxury transits are moving on schedule and our Rocky Mountain corridor is running at optimal capacity!" + error,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsChatbotTyping(false);
    }
  };

  // Map states
  const [mapSelectedNode, setMapSelectedNode] = useState<{
    name: string;
    code: string;
    weather: string;
    temp: string;
    fleetCount: number;
    notes: string;
    coords: { x: number; y: number };
  } | null>(null);
  const [mapLayer, setMapLayer] = useState<"blueprint" | "weather" | "radar">("blueprint");
  const [hoveredCoords, setHoveredCoords] = useState<{ x: number; y: number } | null>(null);
  const [activeRouteHighlight, setActiveRouteHighlight] = useState<string | null>("route-1");
  const [customBeacons, setCustomBeacons] = useState<Array<{ id: string; x: number; y: number; lat: string; lng: string }>>([
    { id: "beacon-1", x: 200, y: 150, lat: "39.1245", lng: "-111.4590" }
  ]);

  // Auto Refresh Simulation for Fleet Status
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          // Mutate vehicle loads or statuses slightly to simulate live feed
          setVehicles((prevVehicles) =>
            prevVehicles.map((v) => {
              if (v.status === "EN ROUTE") {
                // minor fluctuations
                const change = Math.random() > 0.6 ? (Math.random() > 0.5 ? 1 : -1) : 0;
                const newLoad = Math.max(10, Math.min(v.capacity, v.load + change));
                return { ...v, load: newLoad };
              }
              if (v.status === "BOARDING") {
                // board more passengers slowly
                const added = Math.random() > 0.4 ? 1 : 0;
                const newLoad = Math.min(v.capacity, v.load + added);
                return {
                  ...v,
                  load: newLoad,
                  status: newLoad === v.capacity ? "EN ROUTE" : "BOARDING"
                };
              }
              return v;
            })
          );
          return 4;
        }
        return prev - 1;
      });
    }, 1500);

    return () => clearInterval(timer);
  }, []);

  // Real Earth Route Info helper
  const startCityObj = EARTH_CITIES.find(c => c.code === selectedStartNode);
  const endCityObj = EARTH_CITIES.find(c => c.code === selectedEndNode);

  const realEarthDistance = (startCityObj && endCityObj)
    ? calculateHaversineDistance(startCityObj.lat, startCityObj.lng, endCityObj.lat, endCityObj.lng)
    : 0;

  // Cost calculations
  const perMileRate = selectedEarthVehicle === "Coach" ? 0.22 : selectedEarthVehicle === "Sky-Linx" ? 0.65 : 0.38;
  const rawTransitCost = realEarthDistance * perMileRate;
  const transitSurcharge = feeSurcharge;
  const transitTax = rawTransitCost * (taxRate / 100);
  const totalEarthBookingPrice = Math.round((rawTransitCost + transitSurcharge + transitTax) * 100) / 100;

  // Travel time speed (mph)
  const vehicleSpeed = selectedEarthVehicle === "Coach" ? 58 : selectedEarthVehicle === "Sky-Linx" ? 340 : 72;
  const travelHours = realEarthDistance > 0 ? (realEarthDistance / vehicleSpeed) : 0;
  const travelHoursFormatted = travelHours > 0
    ? travelHours < 1
      ? `${Math.round(travelHours * 60)} mins`
      : `${Math.round(travelHours)} hours`
    : "N/A";

  // Customer Checkout for Real Earth Tour Booking
  const handleBookRealEarthTour = () => {
    if (!currentUser) {
      triggerNotification("Please log in as a Customer to make bookings.", "error");
      return;
    }
    if (selectedStartNode === selectedEndNode) {
      triggerNotification("Start and Destination cities cannot be the same.", "error");
      return;
    }
    if (currentUser.balance < totalEarthBookingPrice) {
      triggerNotification(`Insufficient Wallet Balance. Total cost is $${totalEarthBookingPrice.toLocaleString()} but you only have $${currentUser.balance.toLocaleString()}. Please top up.`, "error");
      return;
    }

    // Deduct balance and record transaction
    const newBalance = currentUser.balance - totalEarthBookingPrice;
    const txId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: Transaction = {
      id: txId,
      type: "Booking Purchase",
      amount: totalEarthBookingPrice,
      description: `Custom Route: ${startCityObj?.name} ➔ ${endCityObj?.name} via Luxury ${selectedEarthVehicle}`,
      date: new Date().toISOString().split("T")[0]
    };

    // Create Booking
    const newBookingId = `BK-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomSeat = Math.floor(Math.random() * 20) + 1;
    const newBooking: Booking = {
      id: newBookingId,
      routeId: `custom-${selectedStartNode}-${selectedEndNode}`,
      routeName: `Custom Int'l Corridor: ${startCityObj?.name} ➔ ${endCityObj?.name}`,
      passengerName: currentUser.name,
      passengerEmail: currentUser.email,
      seats: [randomSeat],
      vehicleId: `EX-${selectedEarthVehicle.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      totalPaid: totalEarthBookingPrice,
      date: new Date().toISOString().split("T")[0],
      status: "Confirmed"
    };

    // Add to state
    setBookings(prev => [newBooking, ...prev]);

    // Create vehicle for dispatch
    const newVehicle: Vehicle = {
      id: newBooking.vehicleId,
      type: selectedEarthVehicle,
      route: newBooking.routeName,
      status: "BOARDING",
      load: 1,
      capacity: selectedEarthVehicle === "Coach" ? 48 : selectedEarthVehicle === "Sky-Linx" ? 12 : 8,
      eta: travelHoursFormatted,
      fuel: 100,
      driver: "Assigned Auto-Pilot"
    };
    setVehicles(prev => [...prev, newVehicle]);

    setCurrentUser({
      ...currentUser,
      balance: Math.round(newBalance * 100) / 100,
      transactions: [newTx, ...currentUser.transactions]
    });

    triggerNotification(`Booking Successful! Spent $${totalEarthBookingPrice.toLocaleString()} from Wallet.`, "success");
    setCustomerTab("booking"); // Switch to their ticket dashboard
  };

  // Add Custom Route to Wishlist
  const handleAddRealEarthWishlist = () => {
    if (!currentUser) {
      triggerNotification("Please log in to add to wishlist.", "error");
      return;
    }
    const routeCode = `custom-${selectedStartNode}-${selectedEndNode}`;
    if (currentUser.wishlist.includes(routeCode)) {
      triggerNotification("This corridor is already in your wishlist.", "info");
      return;
    }

    setCurrentUser({
      ...currentUser,
      wishlist: [...currentUser.wishlist, routeCode]
    });
    triggerNotification(`Added custom route ${startCityObj?.name} ➔ ${endCityObj?.name} to Wishlist!`, "success");
  };

  // Admin Custom Route Dispatch
  const handleAdminDispatchRealEarth = () => {
    if (selectedStartNode === selectedEndNode) {
      triggerNotification("Select distinct hubs for live route generation.", "error");
      return;
    }
    const newVehicleId = `EX-${selectedEarthVehicle.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const newVehicle: Vehicle = {
      id: newVehicleId,
      type: selectedEarthVehicle,
      route: `${startCityObj?.name} ➔ ${endCityObj?.name} Direct Dispatch`,
      status: "EN ROUTE",
      load: Math.floor((selectedEarthVehicle === "Coach" ? 48 : 12) * 0.75),
      capacity: selectedEarthVehicle === "Coach" ? 48 : selectedEarthVehicle === "Sky-Linx" ? 12 : 8,
      eta: travelHoursFormatted,
      fuel: 95,
      driver: "Assigned Operations Pilot"
    };

    setVehicles(prev => [...prev, newVehicle]);
    triggerNotification(`Dispatched new fleet unit ${newVehicleId} from ${startCityObj?.name} to ${endCityObj?.name}!`, "success");
    setActiveTab("dashboard");
  };

  // Quick Action: Export CSV
  const handleExportCSV = () => {
    const headers = "Vehicle ID,Route Assignment,Status,Passenger Load,Capacity,ETA,Fuel Level,Driver\n";
    const rows = vehicles
      .map(
        (v) =>
          `"${v.id}","${v.route}","${v.status}",${v.load},${v.capacity},"${v.eta}","${v.fuel}%","${v.driver}"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("href", url);
    a.setAttribute("download", `Travel_Planner_Website_Tourism_Wing_Ops_${Date.now()}.csv`);
    a.click();
  };

  // Quick Action: Optimize Routes
  const handleOptimizeRoutes = () => {
    setOptimizing(true);
    setOptimizerLog(["Initializing Route Load Balancing Algorithm...", "Scanning active tourist corridor density..."]);

    setTimeout(() => {
      setOptimizerLog((prev) => [...prev, "Analyzing passenger distribution on High Demand loops..."]);
    }, 1000);

    setTimeout(() => {
      setOptimizerLog((prev) => [
        ...prev,
        "Identified EX-COACH-212 load threshold (38/48). Standardizing Alpine Vista corridor assignment...",
        "Re-allocating reserve units for anticipated weekend traveler surge (+14.2% margin optimized)."
      ]);
    }, 2200);

    setTimeout(() => {
      setOptimizing(false);
      // Improve load factors
      setVehicles((prev) =>
        prev.map((v) => {
          if (v.status === "EN ROUTE" && v.load < v.capacity - 5) {
            return { ...v, load: v.load + 3 };
          }
          return v;
        })
      );
    }, 3500);
  };

  // Trigger New Itinerary creation
  const handleCreateItinerary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItineraryData.name) return;

    const newRouteId = `route-${ROUTES.length + 1}`;
    const newRoute: RouteDetail = {
      id: newRouteId,
      name: newItineraryData.name,
      duration: newItineraryData.duration,
      demand: newItineraryData.demand,
      basePrice: Number(newItineraryData.basePrice),
      cities: newItineraryData.cities.split(",").map((c) => c.trim()).filter(Boolean),
      stops: newItineraryData.stops.split(",").map((s) => s.trim()).filter(Boolean),
      frequency: newItineraryData.frequency,
      description: newItineraryData.description || `Luxury curated service route exploring historical landmarks.`
    };

    ROUTES.push(newRoute); // add to in-memory list

    // Also assign a vehicle to this new route
    const newVehicle: Vehicle = {
      id: `EX-COACH-${Math.floor(Math.random() * 800) + 100}`,
      type: "Coach",
      route: newRoute.name,
      status: "IDLE",
      load: 0,
      capacity: 48,
      eta: "N/A",
      fuel: 100,
      driver: "Unassigned Partner"
    };
    setVehicles((prev) => [...prev, newVehicle]);

    setIsNewItineraryOpen(false);
    setNewItineraryData({
      name: "",
      duration: "5 Days",
      demand: "Medium",
      basePrice: 450,
      cities: "",
      stops: "",
      frequency: "Daily - 9:00 AM",
      description: ""
    });
    alert(`Success: Itinerary "${newRoute.name}" created and paired with a luxury vehicle!`);
  };

  // Passenger Booking confirmation
  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.name || !bookingForm.email || bookingForm.seats.length === 0) {
      alert("Please fill in all details and select at least one seat.");
      return;
    }

    const calculatedBase = selectedRouteForBooking.basePrice * bookingForm.seats.length;
    const computedFees = feeSurcharge * bookingForm.seats.length;
    const computedTax = (calculatedBase + computedFees) * (taxRate / 100);
    const totalAmountPaid = calculatedBase + computedFees + computedTax;

    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      routeId: selectedRouteForBooking.id,
      routeName: selectedRouteForBooking.name,
      passengerName: bookingForm.name,
      passengerEmail: bookingForm.email,
      seats: [...bookingForm.seats],
      vehicleId: selectedVehicleForBooking.id,
      totalPaid: Math.round(totalAmountPaid * 100) / 100,
      date: new Date().toISOString().split("T")[0],
      status: "Confirmed"
    };

    // Update fleet passenger load
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === selectedVehicleForBooking.id) {
          const newLoad = Math.min(v.capacity, v.load + bookingForm.seats.length);
          return { ...v, load: newLoad, status: v.status === "IDLE" ? "BOARDING" : v.status };
        }
        return v;
      })
    );

    setBookings((prev) => [newBooking, ...prev]);
    setBookingStep(3); // show boarding pass
  };

  // AI-Assisted Interactive Travel Recommendation Generator (Real Server-Side Gemini Route Optimizer)
  const handleAISmartPlan = async () => {
    if (!aiPrompt) return;
    setAiGenerating(true);
    try {
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      if (!response.ok) {
        throw new Error("Failed to contact the server route optimization engine.");
      }
      const data = await response.json();
      setAiResult({
        routeName: data.routeName,
        cities: data.cities,
        stops: data.stops,
        price: data.price,
        description: data.description,
        vehicleRecommendation: data.vehicleRecommendation
      });
    } catch (error: any) {
      console.error("AI route planner failed:", error);
      // Premium Fallback engine
      setAiResult({
        routeName: `Bespoke Expedition (${aiPrompt.slice(0, 20)}${aiPrompt.length > 20 ? "..." : ""})`,
        cities: ["Denver Hub", "Aspen Ridge", "Salt Lake Terminal"],
        stops: ["Mountain Viewpoint Alpha", "Alpine Junction Meadow"],
        price: 980,
        description: "Bespoke handcrafted itinerary prepared via local backup algorithms. Set up GEMINI_API_KEY for dynamic live planning.",
        vehicleRecommendation: "EX-COACH Luxury Overland Series"
      });
    } finally {
      setAiGenerating(false);
    }
  };

  // Calculations for Stats
  const totalFleetSize = vehicles.length + 477; // baseline 482
  const activeBookingsCount = bookings.reduce((acc, curr) => acc + curr.seats.length, 0) + 1839; // baseline 1842
  const totalRevenue = bookings.reduce((acc, curr) => acc + curr.totalPaid, 0) + 124502.8;
  const avgMargin = 34.2 + (feeSurcharge - 45) * 0.08; // dynamic margin based on surcharge

  return (
    <div id="app-root" className="h-screen w-screen flex overflow-hidden bg-slate-100 font-sans antialiased text-slate-800">

      {/* GLOBAL TOAST NOTIFICATION CENTER */}
      <div className="fixed top-5 right-5 z-50 space-y-2 pointer-events-none max-w-sm w-full font-sans">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-3.5 rounded-xl shadow-2xl border flex items-center justify-between pointer-events-auto animate-scaleIn transition-all ${n.type === "success"
                ? "bg-slate-900 text-emerald-400 border-slate-800"
                : n.type === "error"
                  ? "bg-slate-900 text-red-400 border-slate-800"
                  : "bg-slate-900 text-slate-200 border-slate-700"
              }`}
          >
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold">
                {n.type === "success" ? "✓" : n.type === "error" ? "⚠" : "ℹ"}
              </span>
              <p className="text-xs font-bold">{n.text}</p>
            </div>
            <button
              onClick={() => setNotifications((prev) => prev.filter((item) => item.id !== n.id))}
              className="text-slate-400 hover:text-white ml-3 text-[10px]"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* CONDITIONAL RENDER: LOGIN PORTAL vs CUSTOMER DASHBOARD vs ADMIN TERMINAL */}
      {currentUser === null ? (
        <div className="flex-1 h-screen w-screen flex flex-col md:flex-row items-stretch justify-stretch bg-slate-950 font-sans overflow-hidden">
          {/* Left panel: vector map blueprint */}
          <div className="hidden md:flex md:w-1/2 bg-slate-900 border-r border-slate-800 flex-col justify-between p-12 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:24px_24px]"></div>

            <div className="absolute inset-0 flex items-center justify-center opacity-30 select-none pointer-events-none scale-125">
              <svg className="w-full h-full max-h-[400px]" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
                <g stroke="#334155" strokeWidth="0.5" strokeDasharray="2 4">
                  <line x1="0" y1="50" x2="500" y2="50" />
                  <line x1="0" y1="100" x2="500" y2="100" />
                  <line x1="0" y1="150" x2="500" y2="150" />
                  <line x1="0" y1="200" x2="500" y2="200" />
                  <line x1="0" y1="250" x2="500" y2="250" />
                  <line x1="100" y1="0" x2="100" y2="300" />
                  <line x1="200" y1="0" x2="200" y2="300" />
                  <line x1="300" y1="0" x2="300" y2="300" />
                </g>
                <path d="M 40,70 L 130,50 L 170,80 L 160,115 L 140,115 L 145,130 L 125,125 L 105,145 Z" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                <path d="M 230,60 L 320,50 L 450,55 L 470,95 L 455,130 L 415,150 L 375,135 Z" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                <path d="M 245,125 L 295,120 L 315,155 L 295,215 L 285,255 Z" fill="#1e293b" stroke="#475569" strokeWidth="1" />
              </svg>
            </div>

            <div className="flex items-center gap-3 z-10">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-md shadow-amber-900">
                T
              </div>
              <div>
                <h1 className="font-bold text-lg text-white uppercase tracking-tight">Travel-Planner-Website</h1>
                <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold">Global Transit Enterprise</p>
              </div>
            </div>

            <div className="z-10 space-y-3">
              <span className="text-[10px] bg-amber-950/80 border border-amber-800 text-amber-400 font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                System Terminal Release v5.0
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight leading-none mt-2">
                Unified Tourism Dispatches & Customer Portal
              </h2>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                Securely interface with our real-world satellite-guided route calculation terminal, direct active dispatches ledger, and automated billing wallets.
              </p>
            </div>

            <p className="text-[10px] text-slate-600 font-mono z-10">
              SATELLITE POSITIONING: ACTIVE • SSL ENCRYPTED CONNECTION
            </p>
          </div>

          {/* Right panel: Login box */}
          <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 bg-slate-950 text-slate-100 relative">
            <div className="w-full max-w-md space-y-6">
              <div className="space-y-1 text-center md:text-left">
                <h3 className="text-2xl font-black tracking-tight text-white">Access Transit Console</h3>
                <p className="text-xs text-slate-500">Sign in to initialize dispatch workflows or manage personal bookings</p>
              </div>

              <div className="bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80 space-y-4 shadow-xl">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Select Dashboard Workspace</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setLoginForm(p => ({ ...p, role: "customer" }))}
                      className={`py-2 text-xs font-bold rounded-lg uppercase tracking-wider border transition-all ${loginForm.role === "customer"
                          ? "bg-amber-600 text-white border-amber-500 shadow-md"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                        }`}
                    >
                      Customer Desk
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginForm(p => ({ ...p, role: "admin" }))}
                      className={`py-2 text-xs font-bold rounded-lg uppercase tracking-wider border transition-all ${loginForm.role === "admin"
                          ? "bg-amber-600 text-white border-amber-500 shadow-md"
                          : "bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200"
                        }`}
                    >
                      Admin Terminal
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500"><User className="w-4 h-4" /></span>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="e.g. UserOne@gmail.com"
                      className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white outline-none focus:border-amber-500 font-semibold"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Passcode Credentials</label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-slate-500"><Lock className="w-4 h-4" /></span>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(p => ({ ...p, password: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white outline-none focus:border-amber-500 font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsLoggingIn(true);
                    setTimeout(() => {
                      setIsLoggingIn(false);
                      if (loginForm.role === "customer") {
                        setCurrentUser({
                          name: "User One",
                          email: loginForm.email || "UserOne@gmail.com",
                          role: "customer",
                          balance: 5000,
                          wishlist: ["route-1", "route-3"],
                          transactions: [
                            { id: "TX-9901", type: "Deposit", amount: 5000, description: "Opening Portfolio Provisioning", date: "2026-07-06" }
                          ]
                        });
                        triggerNotification("Logged in as Customer successfully!", "success");
                        setCustomerTab("map");
                      } else {
                        setCurrentUser({
                          name: "Admin Commander",
                          email: loginForm.email || "admin@travel-planner-website.com",
                          role: "admin",
                          balance: 124502.80,
                          wishlist: [],
                          transactions: []
                        });
                        triggerNotification("Logged in as Admin dispatch terminal!", "success");
                        setActiveTab("dashboard");
                      }
                    }, 800);
                  }}
                  className="w-full py-2.5 mt-2 bg-amber-600 hover:bg-amber-500 active:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-all flex justify-center items-center gap-2"
                >
                  {isLoggingIn ? (
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    "Authorize Session"
                  )}
                </button>
              </div>

              {/* DEVELOPER DEMO SHORTCUTS */}
              <div className="space-y-2.5 bg-slate-900/40 p-4 rounded-xl border border-slate-800/50">
                <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest text-center">Demo Fast Track Login Presets</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginForm({ email: "UserOne@gmail.com", password: "demo", role: "customer" });
                      setCurrentUser({
                        name: "Mohak Racer",
                        email: "UserOne@gmail.com",
                        role: "customer",
                        balance: 5000,
                        wishlist: ["route-1", "route-3"],
                        transactions: [
                          { id: "TX-9901", type: "Deposit", amount: 5000, description: "Opening Portfolio Provisioning", date: "2026-07-06" }
                        ]
                      });
                      triggerNotification("Logged in as Mohak Racer (Customer)", "success");
                      setCustomerTab("map");
                    }}
                    className="py-1.5 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-amber-400 transition-colors uppercase tracking-wider text-center"
                  >
                    🚀 Customer Demo
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginForm({ email: "ops.manager@travel-planner-website.com", password: "demo", role: "admin" });
                      setCurrentUser({
                        name: "Admin Commander",
                        email: "ops.manager@travel-planner-website.com",
                        role: "admin",
                        balance: 124502.80,
                        wishlist: [],
                        transactions: []
                      });
                      triggerNotification("Logged in as Operations Commander (Admin)", "success");
                      setActiveTab("dashboard");
                    }}
                    className="py-1.5 px-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 rounded-lg text-[10px] font-bold text-emerald-400 transition-colors uppercase tracking-wider text-center"
                  >
                    🛠 Admin Demo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : currentUser.role === "customer" ? (
        /* CUSTOMER DASHBOARD SHELL */
        <div className={`flex-1 h-screen w-screen flex font-sans overflow-hidden transition-colors duration-300 ${isDarkMode ? "bg-stone-950" : "bg-slate-100"}`}>

          {/* CUSTOMER SIDEBAR */}
          <aside className="w-[260px] bg-slate-950 text-slate-100 flex-shrink-0 flex flex-col p-6 shadow-2xl border-r border-slate-900 justify-between">
            <div className="space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-amber-600 to-orange-500 rounded-xl flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-amber-950/50">
                  T
                </div>
                <div>
                  <h1 className="font-extrabold text-sm text-white uppercase tracking-tight leading-none">Travel-Planner-Website</h1>
                  <span className="text-[9px] text-amber-400 uppercase tracking-widest font-black block mt-0.5 font-sans">CUSTOMER CONSOLE</span>
                </div>
              </div>

              {/* Wallet overview card */}
              <div className="bg-gradient-to-br from-stone-900 to-stone-950 border border-stone-850 p-4 rounded-xl shadow-xl relative overflow-hidden">
                <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-3 translate-y-3">
                  <Wallet className="w-24 h-24 text-white" />
                </div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[8px] uppercase tracking-widest text-stone-500 font-black">built-in wallet balance</span>
                  <Wallet className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <div className="font-mono text-xl font-bold text-white tracking-tight">
                  ${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-stone-850/50">
                  <span className="text-[8px] font-mono text-stone-500 uppercase">ACTIVE_LEDGER</span>
                  <button
                    onClick={() => {
                      setCustomerTab("booking");
                      triggerNotification("Wallet terminal active.", "info");
                    }}
                    className="text-[9px] text-amber-400 hover:text-amber-300 font-bold uppercase tracking-wider"
                  >
                    + Add Funds
                  </button>
                </div>
              </div>

              {/* Navigation Menu (Reduced to exactly three buttons) */}
              <nav className="space-y-1">
                <button
                  onClick={() => setCustomerTab("map")}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg font-bold text-xs transition-all ${customerTab === "map"
                      ? "bg-amber-600 text-white shadow-md shadow-amber-900/30"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                >
                  <Navigation className="w-4 h-4" />
                  Interactive Map
                </button>

                <button
                  onClick={() => setCustomerTab("tripDeciding")}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg font-bold text-xs transition-all relative ${customerTab === "tripDeciding"
                      ? "bg-amber-600 text-white shadow-md shadow-amber-900/30"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                >
                  <Compass className="w-4 h-4" />
                  Trip Deciding
                  {currentUser.wishlist.length > 0 && (
                    <span className="absolute right-2 top-2.5 w-4 h-4 rounded-full bg-amber-500 text-white text-[8px] font-bold flex items-center justify-center font-mono">
                      {currentUser.wishlist.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setCustomerTab("booking")}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-lg font-bold text-xs transition-all relative ${customerTab === "booking"
                      ? "bg-amber-600 text-white shadow-md shadow-amber-900/30"
                      : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                    }`}
                >
                  <Ticket className="w-4 h-4" />
                  Booking & Wallet
                  {bookings.filter(b => b.passengerEmail === currentUser.email).length > 0 && (
                    <span className="absolute right-2 top-2.5 w-4 h-4 rounded-full bg-emerald-500 text-white text-[8px] font-bold flex items-center justify-center font-mono animate-pulse">
                      {bookings.filter(b => b.passengerEmail === currentUser.email).length}
                    </span>
                  )}
                </button>
              </nav>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-900">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-600/20 border border-amber-500/40 flex items-center justify-center font-mono font-bold text-amber-400 text-xs">
                  MR
                </div>
                <div className="leading-tight overflow-hidden">
                  <p className="font-bold text-xs text-white truncate">{currentUser.name}</p>
                  <p className="text-[9px] text-slate-500 truncate">{currentUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setCurrentUser({
                      name: "Operations Commander",
                      email: "admin@travel-planner-website.com",
                      role: "admin",
                      balance: 124502.80,
                      wishlist: [],
                      transactions: []
                    });
                    triggerNotification("Switched terminal context to Admin console.", "info");
                    setActiveTab("dashboard");
                  }}
                  className="py-1 bg-slate-900 hover:bg-slate-800 text-[9px] font-bold rounded text-center text-amber-400 uppercase tracking-wider"
                >
                  ⚙ Ops Admin
                </button>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    triggerNotification("Logged out successfully.", "info");
                  }}
                  className="py-1 bg-slate-900 hover:bg-red-950 hover:text-red-400 text-[9px] font-bold rounded text-center text-slate-400 uppercase tracking-wider flex items-center justify-center gap-1"
                >
                  <LogOut className="w-2.5 h-2.5" /> Out
                </button>
              </div>
            </div>
          </aside>
          {/* MAIN CUSTOMER INTERFACE */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <header className={`h-16 flex items-center justify-between px-8 shadow-sm flex-shrink-0 transition-colors duration-300 ${isDarkMode ? "bg-stone-900 border-b border-stone-800 text-stone-100" : "bg-white border-b border-slate-200 text-slate-800"}`}>
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">GLOBAL CORRIDORS SATELLITE</span>
                <h2 className="font-extrabold text-sm flex items-center gap-2">
                  {customerTab === "map" && "Interactive Real Earth Routing Terminal"}
                  {customerTab === "tripDeciding" && "Trip Deciding & Expedition Planner"}
                  {customerTab === "booking" && "Booking Terminal & Digital Ledger"}
                </h2>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className={`p-2 rounded-lg transition-colors flex items-center justify-center border ${isDarkMode ? "bg-stone-800 border-stone-700 text-amber-400 hover:bg-stone-750" : "bg-stone-100 border-stone-200 text-stone-600 hover:bg-stone-200"}`}
                  title="Toggle Light/Dark Theme"
                >
                  {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
                </button>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-semibold">Active Portals:</span>
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 border border-emerald-200 font-bold px-2 py-0.5 rounded uppercase font-sans">
                    CUSTOMER CORE ACCESS
                  </span>
                </div>
                <div className="h-8 w-[1px] bg-slate-200"></div>
                <button
                  onClick={() => setIsChatbotOpen(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] rounded-lg uppercase tracking-wider flex items-center gap-1 shadow-sm transition-all"
                >
                  <Bot className="w-3.5 h-3.5" /> Launch Concierge AI
                </button>
              </div>
            </header>
            {/* Content Body */}
            <div className={`flex-1 overflow-y-auto p-6 transition-colors duration-300 ${isDarkMode ? "bg-stone-950 text-stone-100" : "bg-stone-50 text-stone-900"}`} id="customer-main-content">

              {/* TAB: SATELLITE ROUTE ARCHITECT */}
              {customerTab === "map" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left side: Interactive Map */}
                    <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-900 shadow-xl p-5 flex flex-col relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:16px_16px] pointer-events-none"></div>

                      <div className="flex justify-between items-center mb-4 z-10">
                        <div>
                          <h3 className="font-bold text-xs text-white uppercase tracking-wider">Real Earth Satellite Grid Projection</h3>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">Select start and destination nodes directly on the real map</p>
                        </div>
                        <div className="text-[9px] font-mono text-amber-400 bg-amber-950/80 px-2 py-1 rounded border border-amber-900/60 font-bold">
                          100% SATELLITE ACCURACY
                        </div>
                      </div>

                      {/* Map Container */}
                      <div className="w-full aspect-[5/3] bg-slate-900 rounded-xl border border-slate-800 relative overflow-hidden select-none">

                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">

                          {/* Earth Latitude/Longitude Grids */}
                          <g stroke="#1e293b" strokeWidth="0.5" strokeDasharray="2 3">
                            <line x1="0" y1="50" x2="500" y2="50" />
                            <text x="5" y="45" fill="#334155" className="text-[7px] font-mono">60°N</text>
                            <line x1="0" y1="100" x2="500" y2="100" />
                            <text x="5" y="95" fill="#334155" className="text-[7px] font-mono">30°N</text>
                            <line x1="0" y1="150" x2="500" y2="150" />
                            <text x="5" y="145" fill="#334155" className="text-[7px] font-mono">0° Equator</text>
                            <line x1="0" y1="200" x2="500" y2="200" />
                            <text x="5" y="195" fill="#334155" className="text-[7px] font-mono">30°S</text>
                            <line x1="0" y1="250" x2="500" y2="250" />
                            <text x="5" y="245" fill="#334155" className="text-[7px] font-mono">60°S</text>

                            <line x1="100" y1="0" x2="100" y2="300" />
                            <text x="105" y="295" fill="#334155" className="text-[7px] font-mono">90°W</text>
                            <line x1="200" y1="0" x2="200" y2="300" />
                            <text x="205" y="295" fill="#334155" className="text-[7px] font-mono">45°W</text>
                            <line x1="300" y1="0" x2="300" y2="300" />
                            <text x="305" y="295" fill="#334155" className="text-[7px] font-mono">45°E</text>
                            <line x1="400" y1="0" x2="400" y2="300" />
                            <text x="405" y="295" fill="#334155" className="text-[7px] font-mono">110°E</text>
                          </g>

                          {/* Continent Vectors Silhouettes */}
                          <g fill="#161e2b" stroke="#1e293b" strokeWidth="1">
                            <path d="M 40,70 L 130,50 L 170,80 L 160,115 L 140,115 L 145,130 L 125,125 L 105,145 L 85,125 L 65,125 L 45,95 Z" />
                            <path d="M 130,150 L 150,165 L 165,190 L 150,230 L 135,270 L 128,260 L 120,200 L 115,165 Z" />
                            <path d="M 230,60 L 320,50 L 450,55 L 470,95 L 455,130 L 415,150 L 375,135 L 340,160 L 290,140 L 265,100 Z" />
                            <path d="M 245,125 L 295,120 L 315,155 L 295,215 L 285,255 L 265,225 L 240,170 Z" />
                            <path d="M 430,225 L 475,220 L 480,255 L 435,260 Z" />
                          </g>

                          {/* ACTIVE GEODESIC BEZIER PATH */}
                          {startCityObj && endCityObj && selectedStartNode !== selectedEndNode && (
                            <path
                              d={`M ${startCityObj.x},${startCityObj.y} Q ${(startCityObj.x + endCityObj.x) / 2},${Math.min(startCityObj.y, endCityObj.y) - 35} ${endCityObj.x},${endCityObj.y}`}
                              fill="none"
                              stroke="#d97706"
                              strokeWidth="2.5"
                              strokeDasharray="4 4"
                              className="animate-pulse"
                              style={{ strokeDashoffset: "20px" }}
                            />
                          )}
                        </svg>

                        {/* Interactive Cities Pins Overlay */}
                        {EARTH_CITIES.map((city) => {
                          const isStart = selectedStartNode === city.code;
                          const isEnd = selectedEndNode === city.code;
                          return (
                            <button
                              key={city.code}
                              onClick={() => {
                                if (!selectedStartNode || (selectedStartNode && selectedEndNode)) {
                                  setSelectedStartNode(city.code);
                                  setSelectedEndNode(null);
                                  triggerNotification(`Set Start city to ${city.name}`, "info");
                                } else {
                                  setSelectedEndNode(city.code);
                                  triggerNotification(`Set Destination city to ${city.name}`, "success");
                                }
                              }}
                              className="absolute w-4 h-4 flex items-center justify-center group z-20"
                              style={{
                                left: `${(city.x / 500) * 100}%`,
                                top: `${(city.y / 300) * 100}%`,
                                transform: "translate(-50%, -50%)"
                              }}
                            >
                              <span className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${isStart ? "bg-amber-400 animate-ping" : isEnd ? "bg-emerald-400 animate-ping" : "bg-slate-700 hover:bg-amber-400"
                                }`}></span>

                              <span className={`relative rounded-full h-2.5 w-2.5 border border-white shadow ${isStart ? "bg-amber-500 h-3 w-3" : isEnd ? "bg-emerald-500 h-3 w-3" : "bg-slate-900 group-hover:bg-amber-500"
                                }`}></span>

                              <div className="absolute bottom-5 hidden group-hover:block bg-slate-950 text-[9px] text-slate-100 p-2 rounded border border-slate-800 z-30 w-36 shadow-2xl leading-tight">
                                <p className="font-extrabold text-amber-400">{city.name} ({city.code})</p>
                                <p className="text-[8px] text-slate-400 mt-0.5">{city.continent}</p>
                                <p className="text-[8px] text-slate-500 italic mt-1 font-mono">{city.lat.toFixed(2)}°N, {city.lng.toFixed(2)}°W</p>
                              </div>
                            </button>
                          );
                        })}

                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-slate-950/95 border-t border-slate-900 flex justify-between items-center text-[9px] font-mono text-slate-500 select-none">
                          <div>
                            ACTIVE NODE SELECTION: {selectedStartNode ? <span className="text-amber-400 font-bold">{selectedStartNode}</span> : "NONE"}
                            ➔ {selectedEndNode ? <span className="text-emerald-400 font-bold">{selectedEndNode}</span> : <span className="italic">WAITING</span>}
                          </div>
                          <div>
                            GRID PROJECT: EQUIDISTANT CYLINDRICAL
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-900">
                        <div className="flex items-center gap-1.5 justify-center">
                          <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                          <span>Start City Node</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center">
                          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                          <span>Destination Node</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center">
                          <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                          <span>Available Hubs</span>
                        </div>
                      </div>
                    </div>

                    {/* Right side: Geodesic route calculator panel */}
                    <div className="lg:col-span-5 space-y-6">

                      <div className={`border rounded-2xl shadow-sm p-5 space-y-4 transition-colors duration-300 ${isDarkMode ? "bg-stone-900 border-stone-800 text-stone-100" : "bg-white border-slate-200 text-slate-800"}`}>
                        <h3 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                          <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                          Geodesic Routing Engine
                        </h3>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Departure Station Terminal (Start)</label>
                            <select
                              value={selectedStartNode || ""}
                              onChange={(e) => setSelectedStartNode(e.target.value || null)}
                              className={`w-full p-2 rounded-lg text-xs font-bold outline-none transition-colors duration-300 ${isDarkMode ? "bg-stone-850 border border-stone-750 text-stone-100" : "bg-stone-50 border border-stone-200 text-stone-800"}`}
                            >
                              <option value="">-- Choose Origin Station --</option>
                              {EARTH_CITIES.map(c => (
                                <option key={c.code} value={c.code}>{c.name} ({c.code}) - {c.continent}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Arrival Station Destination (End)</label>
                            <select
                              value={selectedEndNode || ""}
                              onChange={(e) => setSelectedEndNode(e.target.value || null)}
                              className={`w-full p-2 rounded-lg text-xs font-bold outline-none transition-colors duration-300 ${isDarkMode ? "bg-stone-850 border border-stone-750 text-stone-100" : "bg-stone-50 border border-stone-200 text-stone-800"}`}
                            >
                              <option value="">-- Choose Destination Station --</option>
                              {EARTH_CITIES.map(c => (
                                <option key={c.code} value={c.code}>{c.name} ({c.code}) - {c.continent}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Luxury Class Vessel Fleet</label>
                            <div className="grid grid-cols-3 gap-2">
                              {[
                                { type: "Coach", label: "EX-Coach", icon: "🚌", rate: "$0.22/mi" },
                                { type: "Sky-Linx", label: "Sky-Linx", icon: "✈️", rate: "$0.65/mi" },
                                { type: "Sprinter Van", label: "VIP Van", icon: "🚐", rate: "$0.38/mi" }
                              ].map((v) => (
                                <button
                                  key={v.type}
                                  type="button"
                                  onClick={() => setSelectedEarthVehicle(v.type as any)}
                                  className={`py-1.5 px-1 rounded-lg border flex flex-col items-center justify-center transition-all ${selectedEarthVehicle === v.type
                                      ? (isDarkMode ? "bg-amber-600/20 border-amber-500 text-amber-400 shadow-sm" : "bg-amber-50 border-amber-500 text-amber-700 shadow-sm")
                                      : (isDarkMode ? "bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-750" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50")
                                    }`}
                                >
                                  <span className="text-sm mb-0.5">{v.icon}</span>
                                  <span className="text-[9px] font-bold uppercase">{v.label}</span>
                                  <span className="text-[7px] font-mono text-slate-400">{v.rate}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {selectedStartNode && selectedEndNode && selectedStartNode !== selectedEndNode ? (
                          <div className="bg-stone-950 text-stone-100 p-4 rounded-xl space-y-3 font-sans border border-stone-850 shadow-inner">
                            <div className="flex justify-between items-center text-[9px] text-stone-500 border-b border-stone-850 pb-1.5">
                              <span className="font-mono">PARAMETRIC TELEMETRY LOG</span>
                              <span className="text-emerald-400 bg-emerald-950 px-1 py-0.5 rounded font-bold font-mono text-[8px]">OK</span>
                            </div>

                            <div className="grid grid-cols-2 gap-2 text-xs leading-tight">
                              <div>
                                <span className="block text-[8px] uppercase text-stone-500 font-bold">Great-Circle Distance</span>
                                <strong className="font-mono text-white text-xs">{realEarthDistance.toLocaleString()} miles</strong>
                              </div>
                              <div>
                                <span className="block text-[8px] uppercase text-stone-500 font-bold">Travel Duration ETA</span>
                                <strong className="font-mono text-white text-xs">{travelHoursFormatted}</strong>
                              </div>
                              <div>
                                <span className="block text-[8px] uppercase text-stone-500 font-bold">Vessel Velocity</span>
                                <strong className="font-mono text-white text-xs">{vehicleSpeed} mph avg</strong>
                              </div>
                              <div>
                                <span className="block text-[8px] uppercase text-stone-500 font-bold">Estimated Emissions</span>
                                <strong className="font-mono text-emerald-400 text-xs">-14.2% carbon reduction</strong>
                              </div>
                            </div>

                            <div className="pt-2 border-t border-stone-850 space-y-1 text-[10px] font-semibold text-slate-500">
                              <div className="flex justify-between">
                                <span>Base Ticket Fare</span>
                                <span className="font-mono text-slate-355 text-stone-300">${rawTransitCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Dynamic Operator Surcharge</span>
                                <span className="font-mono text-slate-355 text-stone-300">${feeSurcharge.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between pb-1.5 border-b border-stone-800/50">
                                <span>Passenger Tax ({taxRate}%)</span>
                                <span className="font-mono text-slate-355 text-stone-300">${transitTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                              <div className="flex justify-between text-white text-xs font-bold pt-1.5">
                                <span>Total Booking Ledger Cost</span>
                                <span className="font-mono text-emerald-400">${totalEarthBookingPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1.5">
                              <button
                                onClick={handleBookRealEarthTour}
                                className="w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-[9px] rounded uppercase tracking-wider transition-all"
                              >
                                💳 Deduct & Book
                              </button>
                              <button
                                onClick={handleAddRealEarthWishlist}
                                className="w-full py-1.5 bg-stone-800 hover:bg-stone-700 text-slate-200 font-bold text-[9px] rounded uppercase tracking-wider transition-all border border-stone-700"
                              >
                                ♡ Add to Wishlist
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className={`p-4 rounded-xl text-center text-xs border transition-colors duration-300 ${isDarkMode ? "bg-stone-850/50 border-stone-800 text-stone-400" : "bg-stone-50 border-slate-200 text-slate-500"}`}>
                            Select two distinct real-world hubs on the satellite map or selectors above to formulate a custom travel path quote.
                          </div>
                        )}
                      </div>

                      {startCityObj && (
                        <div className={`p-4 rounded-2xl space-y-1 text-xs border transition-colors duration-300 ${isDarkMode ? "bg-amber-950/20 border-amber-900/30 text-amber-200" : "bg-amber-50/50 border-amber-100 text-amber-950"}`}>
                          <h4 className={`font-extrabold flex items-center gap-1.5 ${isDarkMode ? "text-amber-300" : "text-amber-900"}`}>
                            <span className="text-xs">📍</span> Terminal Brief: {startCityObj.name} ({startCityObj.code})
                          </h4>
                          <p className={`leading-normal ${isDarkMode ? "text-amber-200/80" : "text-amber-900/80"}`}>{startCityObj.notes}</p>
                          <p className={`text-[10px] font-mono ${isDarkMode ? "text-amber-400" : "text-amber-500"}`}>Current Grid Temp: 68°F • Weather: Perfect Clear sky</p>
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              )}

              {/* TAB: TRIP DECIDING */}
              {customerTab === "tripDeciding" && (
                <div className="space-y-6">

                  {/* Grid for Custom route architect & standard searches */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left 5 cols: AI Custom Route Architect & Wishlist */}
                    <div className="lg:col-span-5 space-y-6">

                      {/* AI Promo Card */}
                      <div className={`p-5 rounded-2xl border shadow-md relative overflow-hidden transition-all duration-300 ${isDarkMode ? "bg-stone-900 border-stone-800 text-stone-100" : "bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-white border-stone-850"}`}>
                        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:20px_20px]"></div>

                        <div className="relative z-10 space-y-3">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/20 text-amber-350 rounded-full text-[9px] font-bold uppercase tracking-wider border border-amber-500/30">
                            <Sparkles className="w-3 h-3 text-amber-400" /> Custom Route Architect
                          </div>
                          <h3 className="text-sm font-extrabold tracking-tight">AI-Powered Itinerary Planner</h3>
                          <p className={`text-[11px] leading-relaxed ${isDarkMode ? "text-stone-300" : "text-stone-400"}`}>
                            Describe your dream tour corridor and watch our Google Gemini AI fleet optimizer generate custom routes, stops, and price points dynamically.
                          </p>

                          <div className={`flex gap-2 p-1 rounded-lg border transition-all duration-300 ${isDarkMode ? "bg-stone-800/80 border-stone-700" : "bg-white/10 border-white/15"}`}>
                            <input
                              type="text"
                              placeholder="Describe custom region/tour focuses..."
                              value={aiPrompt}
                              onChange={(e) => setAiPrompt(e.target.value)}
                              className={`bg-transparent flex-1 text-xs outline-none border-none focus:ring-0 px-2 ${isDarkMode ? "text-white placeholder-stone-500" : "text-white placeholder-stone-400"}`}
                              onKeyDown={(e) => e.key === "Enter" && handleAISmartPlan()}
                            />
                            <button
                              onClick={handleAISmartPlan}
                              disabled={aiGenerating || !aiPrompt}
                              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 disabled:bg-stone-700 text-white text-[10px] font-extrabold rounded-md uppercase tracking-wider transition-all"
                            >
                              {aiGenerating ? "Generating..." : "Generate"}
                            </button>
                          </div>
                        </div>

                        {/* AI Generated Result */}
                        {aiResult && (
                          <div className={`mt-4 p-4 rounded-lg border shadow-xl animate-fadeIn ${isDarkMode ? "bg-stone-850 text-stone-100 border-stone-750" : "bg-white text-slate-900 border-slate-200"}`}>
                            <div className="flex justify-between items-start mb-2.5 border-b border-stone-800/20 pb-2">
                              <div>
                                <span className="text-[8px] bg-amber-100 text-amber-700 font-extrabold px-1.5 py-0.5 rounded uppercase">Custom AI Corridor</span>
                                <h4 className="font-extrabold text-xs text-slate-955 mt-0.5">{aiResult.routeName}</h4>
                              </div>
                              <div className="text-right">
                                <span className="text-[8px] text-slate-400 font-bold uppercase">Estimated Fare</span>
                                <p className="font-mono font-extrabold text-sm text-emerald-650">${aiResult.price}</p>
                              </div>
                            </div>

                            <p className="text-[10px] text-slate-600 dark:text-stone-300 mb-3 leading-relaxed">{aiResult.description}</p>

                            <div className="grid grid-cols-1 gap-2 text-xs">
                              <div>
                                <h5 className="font-bold text-[8px] text-slate-400 uppercase">Target Hubs</h5>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {aiResult.cities.map((city, idx) => (
                                    <span key={idx} className="bg-stone-100 dark:bg-stone-800 px-1.5 py-0.5 rounded text-stone-700 dark:text-stone-300 font-mono text-[8px]">{city}</span>
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  const customRoute: RouteDetail = {
                                    id: `ai-custom-${Date.now()}`,
                                    name: aiResult.routeName,
                                    duration: "4 Days",
                                    demand: "High",
                                    basePrice: aiResult.price,
                                    cities: aiResult.cities,
                                    stops: aiResult.stops,
                                    frequency: "On-demand dispatch",
                                    description: aiResult.description
                                  };
                                  ROUTES.push(customRoute);
                                  // Automatically save to wishlist and notify
                                  setCurrentUser({
                                    ...currentUser,
                                    wishlist: [...currentUser.wishlist, customRoute.id]
                                  });
                                  triggerNotification(`AI Itinerary "${customRoute.name}" created and saved to Wishlist!`, "success");
                                }}
                                className="mt-2 w-full py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-[9px] font-bold rounded uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1"
                              >
                                Save to Saved Wishlist <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Saved Wishlist Section */}
                      <div className={`p-5 rounded-2xl border shadow-sm space-y-4 transition-colors duration-300 ${isDarkMode ? "bg-stone-900 border-stone-800 text-stone-100" : "bg-white border-slate-200 text-slate-800"}`}>
                        <h3 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                          <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                          Saved Wishlist
                        </h3>

                        {currentUser.wishlist.length > 0 ? (
                          <div className="space-y-3">
                            {ROUTES.filter(r => currentUser.wishlist.includes(r.id)).map((route) => (
                              <div key={route.id} className={`p-3.5 rounded-xl border flex flex-col justify-between transition-colors duration-300 ${isDarkMode ? "bg-stone-850 border-stone-750 text-stone-100" : "bg-stone-50 border-slate-100 text-slate-800"}`}>
                                <div className="space-y-1">
                                  <div className="flex justify-between items-start">
                                    <span className="text-[8px] bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded font-black uppercase tracking-wider">{route.duration} Tour</span>
                                    <span className="text-xs font-bold font-mono text-emerald-600">${route.basePrice}</span>
                                  </div>
                                  <h4 className="font-extrabold text-xs">{route.name}</h4>
                                  <p className="text-[10px] text-slate-500 dark:text-stone-400 line-clamp-2 leading-relaxed">{route.description}</p>
                                </div>
                                <div className="flex gap-2 mt-3 pt-2.5 border-t border-stone-800/10 dark:border-stone-700/40">
                                  <button
                                    onClick={() => {
                                      if (currentUser.balance < route.basePrice) {
                                        triggerNotification(`Insufficient Wallet Funds. Cost is $${route.basePrice} but wallet balance is $${currentUser.balance}.`, "error");
                                        return;
                                      }
                                      const cost = route.basePrice;
                                      const txId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
                                      const purchaseTx: Transaction = {
                                        id: txId,
                                        type: "Booking Purchase",
                                        amount: cost,
                                        description: `Wishlist Ticket: ${route.name}`,
                                        date: new Date().toISOString().split("T")[0]
                                      };
                                      const randomSeat = Math.floor(Math.random() * 20) + 1;
                                      const newBooking: Booking = {
                                        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
                                        routeId: route.id,
                                        routeName: route.name,
                                        passengerName: currentUser.name,
                                        passengerEmail: currentUser.email,
                                        seats: [randomSeat],
                                        vehicleId: `EX-COACH-${Math.floor(100 + Math.random() * 800)}`,
                                        totalPaid: cost,
                                        date: new Date().toISOString().split("T")[0],
                                        status: "Confirmed"
                                      };
                                      setBookings(prev => [newBooking, ...prev]);
                                      setCurrentUser({
                                        ...currentUser,
                                        balance: Math.round((currentUser.balance - cost) * 100) / 100,
                                        transactions: [purchaseTx, ...currentUser.transactions]
                                      });
                                      triggerNotification(`Booked wishlist route ${route.name} successfully!`, "success");
                                      setCustomerTab("booking");
                                    }}
                                    className="flex-1 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold text-[9px] rounded uppercase tracking-wider transition-all"
                                  >
                                    Book Seating
                                  </button>
                                  <button
                                    onClick={() => {
                                      setCurrentUser({
                                        ...currentUser,
                                        wishlist: currentUser.wishlist.filter(id => id !== route.id)
                                      });
                                      triggerNotification(`Removed ${route.name} from wishlist.`, "info");
                                    }}
                                    className={`px-2 py-1 rounded text-[9px] font-bold uppercase border transition-colors duration-300 ${isDarkMode ? "bg-stone-800 border-stone-700 text-stone-400 hover:bg-stone-750" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"}`}
                                  >
                                    Remove
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-slate-400 text-center py-4">Your saved wishlist is currently empty.</p>
                        )}
                      </div>

                    </div>

                    {/* Right 7 cols: Browse Route Directories */}
                    <div className="lg:col-span-7 space-y-6">

                      <div className={`p-5 rounded-2xl border shadow-sm space-y-4 transition-colors duration-300 ${isDarkMode ? "bg-stone-900 border-stone-800 text-stone-100" : "bg-white border-slate-200 text-slate-800"}`}>
                        <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                          <div>
                            <h3 className="font-extrabold text-xs uppercase tracking-wider">Bespoke Tour Corridor Directory</h3>
                            <p className="text-[10px] text-slate-400 mt-0.5">Explore standard dispatch tours and reserve tickets</p>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            <input
                              type="text"
                              placeholder="Search tour routes..."
                              value={searchRoute}
                              onChange={(e) => setSearchRoute(e.target.value)}
                              className={`px-3 py-1.5 rounded-lg text-xs outline-none w-full sm:w-44 transition-colors duration-300 ${isDarkMode ? "bg-stone-850 border border-stone-750 text-white" : "bg-slate-50 border border-slate-200 text-slate-850"}`}
                            />
                            <select
                              value={filterStatus}
                              onChange={(e) => setFilterStatus(e.target.value)}
                              className={`px-2 py-1.5 rounded-lg text-xs font-bold outline-none transition-colors duration-300 ${isDarkMode ? "bg-stone-850 border border-stone-750 text-white" : "bg-slate-50 border border-slate-200 text-slate-700"}`}
                            >
                              <option value="ALL">All Demands</option>
                              <option value="High">High</option>
                              <option value="Medium">Medium</option>
                              <option value="Low">Low</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {ROUTES.filter((r) => {
                            const matchQuery = r.name.toLowerCase().includes(searchRoute.toLowerCase()) ||
                              r.cities.some(c => c.toLowerCase().includes(searchRoute.toLowerCase()));
                            const matchDemand = filterStatus === "ALL" || r.demand === filterStatus;
                            return matchQuery && matchDemand;
                          }).map((route) => {
                            const isFavorited = currentUser.wishlist.includes(route.id);
                            return (
                              <div key={route.id} className={`p-4 rounded-xl border flex flex-col justify-between transition-colors duration-300 ${isDarkMode ? "bg-stone-850 border-stone-750" : "bg-stone-50 border-slate-100"}`}>
                                <div className="space-y-3">
                                  <div className="flex justify-between items-start">
                                    <span className={`text-[8px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${isDarkMode ? "bg-stone-805 bg-stone-800 text-stone-300" : "bg-slate-200 text-slate-700"}`}>{route.duration}</span>
                                    <strong className="font-mono font-bold text-xs text-emerald-600">${route.basePrice}</strong>
                                  </div>
                                  <div>
                                    <h4 className="font-extrabold text-xs">{route.name}</h4>
                                    <p className="text-[10px] text-slate-500 dark:text-stone-400 mt-1 leading-relaxed line-clamp-3">{route.description}</p>
                                  </div>
                                  <div className="text-[9px] text-slate-400">
                                    <strong>Stations:</strong> {route.cities.join(" ➔ ")}
                                  </div>
                                </div>

                                <div className="grid grid-cols-12 gap-2 mt-4 pt-3 border-t border-stone-800/10 dark:border-stone-700/40">
                                  <button
                                    onClick={() => {
                                      if (currentUser.balance < route.basePrice) {
                                        triggerNotification(`Insufficient Wallet Funds. Cost is $${route.basePrice} but wallet balance is $${currentUser.balance}.`, "error");
                                        return;
                                      }
                                      const cost = route.basePrice;
                                      const txId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
                                      const purchaseTx: Transaction = {
                                        id: txId,
                                        type: "Booking Purchase",
                                        amount: cost,
                                        description: `Direct Purchase: ${route.name}`,
                                        date: new Date().toISOString().split("T")[0]
                                      };
                                      const randomSeat = Math.floor(Math.random() * 20) + 1;
                                      const newBooking: Booking = {
                                        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
                                        routeId: route.id,
                                        routeName: route.name,
                                        passengerName: currentUser.name,
                                        passengerEmail: currentUser.email,
                                        seats: [randomSeat],
                                        vehicleId: `EX-COACH-${Math.floor(100 + Math.random() * 800)}`,
                                        totalPaid: cost,
                                        date: new Date().toISOString().split("T")[0],
                                        status: "Confirmed"
                                      };
                                      setBookings(prev => [newBooking, ...prev]);
                                      setCurrentUser({
                                        ...currentUser,
                                        balance: Math.round((currentUser.balance - cost) * 100) / 100,
                                        transactions: [purchaseTx, ...currentUser.transactions]
                                      });
                                      triggerNotification(`Booked seating on route ${route.name} successfully!`, "success");
                                      setCustomerTab("booking");
                                    }}
                                    className="col-span-8 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-[9px] rounded uppercase tracking-wider transition-all"
                                  >
                                    Reserve Ticket
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (isFavorited) {
                                        setCurrentUser({
                                          ...currentUser,
                                          wishlist: currentUser.wishlist.filter(id => id !== route.id)
                                        });
                                        triggerNotification(`Removed from Saved wishlist.`, "info");
                                      } else {
                                        setCurrentUser({
                                          ...currentUser,
                                          wishlist: [...currentUser.wishlist, route.id]
                                        });
                                        triggerNotification(`Added ${route.name} to Saved wishlist!`, "success");
                                      }
                                    }}
                                    className={`col-span-4 py-1.5 rounded text-[9px] font-bold border transition-all text-center flex items-center justify-center gap-1 ${isDarkMode ? "bg-stone-850 border-stone-700 text-stone-400 hover:bg-stone-750" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-100"}`}
                                  >
                                    <Heart className={`w-3 h-3 ${isFavorited ? "fill-rose-500 text-rose-500" : "text-slate-400"}`} />
                                    {isFavorited ? "Saved" : "Save"}
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {/* TAB: BOOKING & WALLET */}
              {customerTab === "booking" && (
                <div className="space-y-6">

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                    {/* Left column: Digital Wallet & Top-up (5 cols) */}
                    <div className="lg:col-span-5 space-y-6">

                      <div className={`border rounded-2xl shadow-sm p-6 space-y-6 transition-colors duration-355 transition-all ${isDarkMode ? "bg-stone-900 border-stone-800 text-stone-100" : "bg-white border-slate-200 text-slate-800"}`}>
                        <h3 className="font-extrabold text-xs uppercase tracking-wider flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-amber-600" />
                          Built-in Wallet Terminal
                        </h3>

                        <div className="bg-stone-950 border border-stone-850 p-6 rounded-2xl shadow-2xl text-white relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-tr from-amber-900/20 via-transparent to-orange-900/10"></div>
                          <div className="absolute right-0 top-0 opacity-10 font-mono text-[70px] select-none translate-x-4 -translate-y-4 font-black text-stone-600">
                            WLT
                          </div>

                          <div className="flex justify-between items-start mb-6">
                            <div>
                              <span className="text-[8px] uppercase tracking-widest text-stone-500 block">CARDHOLDER PASSENGER</span>
                              <strong className="text-xs font-sans tracking-tight text-white">{currentUser.name}</strong>
                            </div>
                            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center border border-white/20 text-xs">
                              💳
                            </div>
                          </div>

                          <div className="space-y-1">
                            <span className="text-[8px] uppercase tracking-widest text-stone-500 block">ledger credit portfolio</span>
                            <div className="font-mono text-2xl font-black tracking-tight text-emerald-400">
                              ${currentUser.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                          </div>

                          <div className="flex justify-between items-center mt-8 text-[9px] font-mono text-stone-500">
                            <span>ROUTING ID: TRAVEL_PLANNER_MAIN</span>
                            <span>STATUS: ACTIVE SECURE</span>
                          </div>
                        </div>

                        <div className={`space-y-3 p-4 rounded-xl border transition-colors duration-300 ${isDarkMode ? "bg-stone-850 border-stone-800" : "bg-slate-50 border-slate-200"}`}>
                          <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Simulated Instant Balance Top-up</span>

                          <div className="grid grid-cols-3 gap-2">
                            {[250, 500, 1000].map(amt => (
                              <button
                                key={amt}
                                onClick={() => {
                                  const newBal = currentUser.balance + amt;
                                  const txId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
                                  const depTx: Transaction = {
                                    id: txId,
                                    type: "Deposit",
                                    amount: amt,
                                    description: `Direct Bank Portfolio Deposit (+ $${amt})`,
                                    date: new Date().toISOString().split("T")[0]
                                  };

                                  setCurrentUser({
                                    ...currentUser,
                                    balance: Math.round(newBal * 100) / 100,
                                    transactions: [depTx, ...currentUser.transactions]
                                  });
                                  triggerNotification(`Deposited $${amt.toLocaleString()} successfully!`, "success");
                                }}
                                className={`py-2 border font-bold text-xs rounded transition-all uppercase tracking-wider ${isDarkMode ? "bg-stone-800 border-stone-700 text-stone-200 hover:bg-amber-600/20 hover:text-amber-400" : "bg-white border-slate-200 text-slate-700 hover:bg-amber-50 hover:text-amber-600"}`}
                              >
                                + ${amt}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Transaction history log */}
                      <div className={`border rounded-2xl shadow-sm p-6 transition-colors duration-300 ${isDarkMode ? "bg-stone-900 border-stone-800 text-stone-100" : "bg-white border-slate-200 text-slate-800"}`}>
                        <h3 className="font-extrabold text-xs uppercase tracking-wider mb-4">Transaction Ledger Audits</h3>

                        {currentUser.transactions.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-[11px]">
                              <thead>
                                <tr className={`border-b text-[9px] font-semibold uppercase tracking-wider ${isDarkMode ? "bg-stone-850 text-stone-400 border-stone-800" : "bg-slate-50 text-slate-500 border-slate-100"}`}>
                                  <th className="py-2.5 px-3">Tx ID</th>
                                  <th className="py-2.5 px-3">Type</th>
                                  <th className="py-2.5 px-3">Description</th>
                                  <th className="py-2.5 px-3 text-right">Amount</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-stone-850/20 dark:divide-stone-700/40">
                                {currentUser.transactions.map((tx) => (
                                  <tr key={tx.id} className={`${isDarkMode ? "hover:bg-stone-850/50" : "hover:bg-slate-50/50"} transition-colors`}>
                                    <td className="py-2.5 px-3 font-mono font-bold">{tx.id}</td>
                                    <td className="py-2.5 px-3">
                                      <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded uppercase ${tx.type === "Deposit" || tx.type === "Cancellation Refund"
                                          ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
                                          : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400"
                                        }`}>
                                        {tx.type.split(" ")[0]}
                                      </span>
                                    </td>
                                    <td className={`py-2.5 px-3 font-medium ${isDarkMode ? "text-stone-300" : "text-slate-600"}`}>{tx.description}</td>
                                    <td className={`py-2.5 px-3 text-right font-mono font-bold ${tx.type === "Deposit" || tx.type === "Cancellation Refund" ? "text-green-600 dark:text-green-400" : "text-rose-600 dark:text-rose-400"}`}>
                                      {tx.type === "Deposit" || tx.type === "Cancellation Refund" ? "+" : "-"}${tx.amount}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-slate-400 text-center py-6 text-xs font-medium">No ledger transactions logged.</p>
                        )}
                      </div>

                    </div>

                    {/* Right column: Boarding pass tickets (7 cols) */}
                    <div className="lg:col-span-7 space-y-6">

                      <div className={`p-6 rounded-2xl border shadow-sm space-y-4 transition-colors duration-300 ${isDarkMode ? "bg-stone-900 border-stone-800 text-stone-100" : "bg-white border-slate-200 text-slate-800"}`}>
                        <h3 className="font-extrabold text-xs uppercase tracking-wider">My Active Boarding Passes</h3>

                        {bookings.filter(b => b.passengerEmail === currentUser.email).length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {bookings.filter(b => b.passengerEmail === currentUser.email).map((ticket) => (
                              <div key={ticket.id} className={`border rounded-2xl overflow-hidden flex flex-col justify-between shadow-sm transition-colors duration-300 ${isDarkMode ? "bg-stone-850 border-stone-750 text-stone-100" : "bg-stone-50 border-slate-100"}`}>
                                <div className="p-3.5 bg-gradient-to-r from-stone-900 to-stone-950 text-white flex justify-between items-center border-b border-stone-850">
                                  <div>
                                    <span className="text-[8px] bg-stone-850 text-amber-400 border border-stone-750 font-mono font-bold px-1.5 py-0.5 rounded">TICKET ID: {ticket.id}</span>
                                    <h4 className="font-extrabold text-xs mt-1 truncate max-w-[150px]">{ticket.routeName}</h4>
                                  </div>
                                  <div className="text-right">
                                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-wider">{ticket.status}</span>
                                    <p className="text-[7px] text-slate-400 font-mono uppercase mt-0.5">READY</p>
                                  </div>
                                </div>

                                <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
                                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-2 text-[11px] leading-normal text-stone-600 dark:text-stone-300">
                                    <div>
                                      <span className="block text-[7px] uppercase text-stone-400 font-bold">Passenger</span>
                                      <strong className="text-stone-800 dark:text-stone-100 font-bold">{ticket.passengerName.split(" ")[0]}</strong>
                                    </div>
                                    <div>
                                      <span className="block text-[7px] uppercase text-stone-400 font-bold">Vessel ID</span>
                                      <strong className="text-stone-800 dark:text-stone-100 font-mono">{ticket.vehicleId}</strong>
                                    </div>
                                    <div>
                                      <span className="block text-[7px] uppercase text-stone-400 font-bold">Seating</span>
                                      <strong className="text-emerald-600 font-mono">Seat {ticket.seats.map(s => `S-${s}`).join(", ")}</strong>
                                    </div>
                                    <div>
                                      <span className="block text-[7px] uppercase text-stone-400 font-bold">Date</span>
                                      <strong className="text-stone-800 dark:text-stone-100 font-mono">{ticket.date}</strong>
                                    </div>
                                  </div>

                                  <div className="border-t border-stone-800/10 dark:border-stone-700/40 pt-2 flex flex-col items-center justify-center gap-1">
                                    <div className="h-6 bg-white dark:bg-stone-900 border border-slate-200 dark:border-stone-800 px-3 rounded flex items-center justify-center gap-0.5 font-mono text-[5px] text-slate-400 dark:text-stone-600 select-none tracking-[2px] max-w-[150px] overflow-hidden">
                                      ||||| | ||| || |||| ||| || | |||| |||
                                    </div>
                                    <span className="text-[7px] text-slate-400 font-mono uppercase">SECURE PASS SEC_OK</span>
                                  </div>

                                  <button
                                    onClick={() => {
                                      const refundBalance = currentUser.balance + ticket.totalPaid;
                                      const txId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
                                      const refundTx: Transaction = {
                                        id: txId,
                                        type: "Cancellation Refund",
                                        amount: ticket.totalPaid,
                                        description: `Refund: Seating Cancellation for Ticket ${ticket.id}`,
                                        date: new Date().toISOString().split("T")[0]
                                      };

                                      setBookings(prev => prev.filter(b => b.id !== ticket.id));
                                      setCurrentUser({
                                        ...currentUser,
                                        balance: Math.round(refundBalance * 100) / 100,
                                        transactions: [refundTx, ...currentUser.transactions]
                                      });
                                      triggerNotification(`Cancelled Ticket ${ticket.id}. Refunded $${ticket.totalPaid.toLocaleString()} to wallet!`, "success");
                                    }}
                                    className={`w-full py-1 rounded text-[8px] font-bold uppercase transition-colors border ${isDarkMode ? "bg-stone-800 border-stone-750 text-stone-400 hover:bg-red-950/20 hover:text-red-400 hover:border-red-900/30" : "bg-white border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200"}`}
                                  >
                                    Cancel Seating (Refund)
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                            <Ticket className="w-12 h-12 text-stone-400 stroke-1" />
                            <div>
                              <h4 className="font-bold text-slate-800 dark:text-stone-300 text-sm">No Active Tickets Found</h4>
                              <p className="text-xs text-slate-500 mt-1 max-w-sm">Book custom geodesic paths or schedules under "Trip Deciding" or "Interactive Map" to dispatch routes.</p>
                            </div>
                            <button
                              onClick={() => setCustomerTab("map")}
                              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl uppercase tracking-wider transition-all mt-2"
                            >
                              Explore Map
                            </button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </div>
          </main>
        </div>
      ) : (
        /* ADMIN OPERATIONS DASHBOARD VIEW */
        <div className="flex-1 h-screen w-screen flex bg-slate-100 font-sans overflow-hidden">

          {/* LEFT SIDEBAR: Professional Polish branding & navigation */}
          <aside id="app-sidebar" className="w-[260px] bg-slate-900 text-slate-100 flex-shrink-0 flex flex-col p-6 shadow-2xl border-r border-slate-800">

            {/* Logo and Brand Title */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center font-bold text-xl text-white shadow-md shadow-amber-900">
                T
              </div>
              <div className="leading-tight">
                <h1 className="font-bold text-lg tracking-tight uppercase">Travel-Planner-Website</h1>
                <p className="text-[10px] text-amber-400 uppercase tracking-widest font-bold font-sans">Tourism Wing Ops</p>
              </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 space-y-1.5">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold text-sm transition-all duration-200 ${activeTab === "dashboard"
                    ? "bg-amber-600/20 text-amber-400 border-l-4 border-amber-500 pl-2"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
              >
                <span className="w-5 text-center text-base">📊</span>
                Live Control Desk
              </button>

              <button
                onClick={() => setActiveTab("routes")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold text-sm transition-all duration-200 ${activeTab === "routes"
                    ? "bg-amber-600/20 text-amber-400 border-l-4 border-amber-500 pl-2"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
              >
                <span className="w-5 text-center text-base">🗺️</span>
                Routes Dispatcher
              </button>

              <button
                onClick={() => setActiveTab("fleet")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold text-sm transition-all duration-200 ${activeTab === "fleet"
                    ? "bg-amber-600/20 text-amber-400 border-l-4 border-amber-500 pl-2"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
              >
                <span className="w-5 text-center text-base">🚌</span>
                Luxury Fleet Cal
              </button>

              <button
                onClick={() => setActiveTab("bookings")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold text-sm transition-all duration-200 ${activeTab === "bookings"
                    ? "bg-amber-600/20 text-amber-400 border-l-4 border-amber-500 pl-2"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
              >
                <span className="w-5 text-center text-base">🎫</span>
                Direct Seating Hub
              </button>

              <button
                onClick={() => setActiveTab("analytics")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg font-semibold text-sm transition-all duration-200 ${activeTab === "analytics"
                    ? "bg-amber-600/20 text-amber-400 border-l-4 border-amber-500 pl-2"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`}
              >
                <span className="w-5 text-center text-base">📈</span>
                Yield Analytics
              </button>
            </nav>

            {/* Sidebar Footer with logout switch */}
            <div className="pt-6 border-t border-slate-800 space-y-3.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-xs">
                  OP
                </div>
                <div>
                  <p className="font-bold text-xs text-white">Ops Control Desk</p>
                  <p className="text-[9px] text-slate-500">Secure Dispatch Terminal</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setCurrentUser({
                      name: "User1",
                      email: "user1@gmail.com",
                      role: "customer",
                      balance: 5000,
                      wishlist: ["route-1", "route-3"],
                      transactions: [
                        { id: "TX-9901", type: "Deposit", amount: 5000, description: "Opening Portfolio Provisioning", date: "2026-07-06" }
                      ]
                    });
                    triggerNotification("Switched terminal context to Customer dashboard.", "info");
                    setCustomerTab("map");
                  }}
                  className="py-1 bg-slate-800 hover:bg-slate-750 text-[9px] font-bold rounded text-center text-emerald-400 uppercase tracking-wider"
                >
                  👤 Client Desk
                </button>
                <button
                  onClick={() => {
                    setCurrentUser(null);
                    triggerNotification("Logged out successfully.", "info");
                  }}
                  className="py-1 bg-slate-800 hover:bg-red-950 hover:text-red-400 text-[9px] font-bold rounded text-center text-slate-400 uppercase tracking-wider"
                >
                  Log-Out
                </button>
              </div>
            </div>
          </aside>

          {/* MAIN ADMINISTRATIVE CONTENT AREA */}
          <main className="flex-1 flex flex-col overflow-hidden" id="app-main-content">

            {/* HEADER CONTROLS */}
            <header className="h-[70px] bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
              <div>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block font-mono">GLOBAL CORRIDORS RADAR</span>
                <h2 className="font-extrabold text-slate-900 text-base">
                  {activeTab === "dashboard" && "Live Dispatch Operations Center"}
                  {activeTab === "routes" && "Interactive Corridor Routing Dispatcher"}
                  {activeTab === "fleet" && "Luxury Vehicle Calibration Hub"}
                  {activeTab === "bookings" && "Passenger Reservation & Check-in Desk"}
                  {activeTab === "analytics" && "Enterprise Corridor Analytics"}
                </h2>
              </div>

              <div className="flex items-center gap-6">

                {/* Active Hub Stat indicator */}
                <div className="hidden sm:flex items-center gap-3 text-right">
                  <div className="leading-tight">
                    <span className="text-[10px] text-slate-400 block font-semibold">Active Fleet Dispatches:</span>
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 uppercase tracking-wide">
                      {vehicles.filter((v) => v.status === "EN ROUTE" || v.status === "BOARDING").length} UNITS COMMITTED
                    </span>
                  </div>
                </div>

                <div className="h-8 w-[1px] bg-slate-200"></div>

                {/* Surcharge setting controller inside header */}
                <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 py-1.5 px-3 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-400 uppercase font-mono">Surcharge Margin:</span>
                  <div className="flex items-center gap-1 font-mono font-bold">
                    <span className="text-slate-400 text-xs">$</span>
                    <input
                      type="number"
                      min="5"
                      max="200"
                      value={feeSurcharge}
                      onChange={(e) => setFeeSurcharge(Number(e.target.value))}
                      className="w-10 bg-white border border-slate-200 text-center text-xs py-0.5 rounded text-slate-900 outline-none"
                    />
                  </div>
                </div>

              </div>
            </header>

            {/* TAB RENDERING BRANCHES */}
            <div className="flex-1 overflow-auto p-6 bg-slate-100 space-y-6">

              {/* TAB 1: OPERATOR CONTROL PANEL & LIVE METRICS (Dashboard) */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">

                  {/* Stat Bento Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Total Active Fleet</p>
                          <p className="text-2xl font-black text-slate-800 mt-1">{totalFleetSize}</p>
                        </div>
                        <span className="p-2 bg-slate-100 rounded-lg text-slate-600"><Bus className="w-4 h-4" /></span>
                      </div>
                      <div className="text-xs text-green-600 font-bold flex items-center gap-1 mt-3">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +12 vs last month
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Active Bookings</p>
                          <p className="text-2xl font-black text-slate-800 mt-1">{activeBookingsCount}</p>
                        </div>
                        <span className="p-2 bg-slate-100 rounded-lg text-slate-600"><Users className="w-4 h-4" /></span>
                      </div>
                      <div className="text-xs text-amber-600 font-bold flex items-center gap-1 mt-3">
                        <CheckCircle className="w-3.5 h-3.5" />
                        94.1% load average
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm flex flex-col justify-between hover:border-amber-400 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Network Reach</p>
                          <p className="text-2xl font-black text-slate-800 mt-1">24 <span className="text-xs text-slate-400 font-semibold">Cities</span></p>
                        </div>
                        <span className="p-2 bg-slate-100 rounded-lg text-slate-600"><MapPin className="w-4 h-4" /></span>
                      </div>
                      <div className="text-xs text-slate-500 mt-3 font-semibold">
                        4 pending expansion nodes
                      </div>
                    </div>

                    <div className="bg-amber-600 text-white border-amber-600 p-5 rounded-xl shadow-lg shadow-amber-100 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] text-amber-200 uppercase font-bold tracking-wider">Estimated Profit Margin</p>
                          <p className="text-2xl font-black mt-1 font-mono">{avgMargin.toFixed(1)}%</p>
                        </div>
                        <span className="p-2 bg-amber-700 rounded-lg text-amber-100"><DollarSign className="w-4 h-4" /></span>
                      </div>
                      <div className="text-xs text-amber-100 font-bold mt-3">
                        Top Sector: Rocky Mountain Core
                      </div>
                    </div>
                  </div>

                  {/* Main Table and sidebar split */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Real-time Inventory Status Table (Col span 2) */}
                    <div className="lg:col-span-2 flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                          <h3 className="font-bold text-sm text-slate-800">Real-Time Fleet & Corridor Status</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Simulated live feed of physical transport inventory</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200 font-bold flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                            </span>
                            POLLING IN 0{countdown}s
                          </div>
                          <button
                            onClick={() => setCountdown(1)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Force refresh status"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                              <th className="py-3 px-5">Vehicle ID</th>
                              <th className="py-3 px-5">Type</th>
                              <th className="py-3 px-5">Assigned Route Corridor</th>
                              <th className="py-3 px-5 text-center">Fuel Status</th>
                              <th className="py-3 px-5">Status</th>
                              <th className="py-3 px-5 text-right">Passenger Load</th>
                              <th className="py-3 px-5 text-right">ETA</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {vehicles.map((v) => (
                              <tr key={v.id} className="hover:bg-slate-50/60 transition-colors text-xs text-slate-700 font-medium">
                                <td className="py-4 px-5 font-mono font-bold text-slate-900">{v.id}</td>
                                <td className="py-4 px-5">
                                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                                    {v.type}
                                  </span>
                                </td>
                                <td className="py-4 px-5 text-slate-900 font-semibold">{v.route}</td>
                                <td className="py-4 px-5">
                                  <div className="flex items-center gap-2 max-w-[80px] mx-auto">
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${v.fuel > 70 ? "bg-green-500" : v.fuel > 40 ? "bg-yellow-500" : "bg-red-500 animate-pulse"
                                          }`}
                                        style={{ width: `${v.fuel}%` }}
                                      ></div>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-500">{v.fuel}%</span>
                                  </div>
                                </td>
                                <td className="py-4 px-5">
                                  <span
                                    className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${v.status === "EN ROUTE"
                                        ? "bg-green-100 text-green-700"
                                        : v.status === "BOARDING"
                                          ? "bg-yellow-100 text-yellow-700"
                                          : v.status === "IDLE"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-red-100 text-red-700"
                                      }`}
                                  >
                                    {v.status}
                                  </span>
                                </td>
                                <td className="py-4 px-5 text-right font-mono text-slate-900">
                                  <span className="font-bold">{v.load}</span>/{v.capacity}
                                  <span className="text-slate-400 text-[10px] ml-1">
                                    ({Math.round((v.load / v.capacity) * 100)}%)
                                  </span>
                                </td>
                                <td className="py-4 px-5 text-right text-slate-500 font-mono">{v.eta}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Dynamic load status feedback panel inside operational table */}
                      <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center text-xs gap-3">
                        <div className="text-slate-500">
                          Average Fleet Capacity Utilization:{" "}
                          <span className="text-slate-950 font-extrabold font-mono">
                            {Math.round(
                              (vehicles.reduce((acc, v) => acc + v.load, 0) /
                                vehicles.reduce((acc, v) => acc + v.capacity, 0)) *
                              100
                            )}
                            %
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              // Board a generic mock rider to random boarding vehicles
                              setVehicles((prev) =>
                                prev.map((v) => {
                                  if (v.status === "BOARDING" && v.load < v.capacity) {
                                    return { ...v, load: v.load + 1 };
                                  }
                                  return v;
                                })
                              );
                            }}
                            className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 rounded text-[10px] font-bold text-slate-700 transition-colors uppercase tracking-wider"
                          >
                            Simulate Ticket Checkout
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Visual route map & Investor Actions */}
                    <div className="space-y-6 flex flex-col">

                      {/* Visual Route Corridor Representation */}
                      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex-1 flex flex-col">
                        <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                          <MapIcon className="w-4 h-4 text-amber-600" />
                          Active Route Map Overview
                        </h3>
                        <p className="text-xs text-slate-500 mb-4">Real-time geographic hub projection for tour dispatch</p>

                        {/* Vector Map Blueprint */}
                        <div className="w-full h-44 bg-slate-950 rounded-lg mb-4 border border-slate-800 relative overflow-hidden flex items-center justify-center">
                          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1.5px,transparent_1.5px)] [background-size:16px_16px]"></div>

                          {/* Interactive Route Dots & Links */}
                          <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                            <path d="M 40,50 L 120,40 L 220,110 L 150,150 Z" fill="none" stroke="#2563EB" strokeWidth="2" strokeDasharray="4 3" className="animate-pulse" />
                            <path d="M 120,40 L 180,30 L 260,70" fill="none" stroke="#10B981" strokeWidth="1.5" />
                            <path d="M 40,50 L 90,120 L 150,150" fill="none" stroke="#EF4444" strokeWidth="1.5" strokeDasharray="2" />
                          </svg>

                          {/* Station Node Pins */}
                          <div className="absolute top-[50px] left-[40px] w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-950 cursor-pointer group" title="Denver Hub">
                            <span className="absolute left-4 top-[-6px] hidden group-hover:block bg-slate-900 text-[10px] text-white py-0.5 px-1.5 rounded font-mono">DEN</span>
                          </div>
                          <div className="absolute top-[40px] left-[120px] w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-950 cursor-pointer group" title="Vail Station">
                            <span className="absolute left-4 top-[-6px] hidden group-hover:block bg-slate-900 text-[10px] text-white py-0.5 px-1.5 rounded font-mono">EGE</span>
                          </div>
                          <div className="absolute top-[110px] left-[220px] w-3 h-3 bg-amber-500 rounded-full border-2 border-slate-950 cursor-pointer group" title="Telluride Base">
                            <span className="absolute left-4 top-[-6px] hidden group-hover:block bg-slate-900 text-[10px] text-white py-0.5 px-1.5 rounded font-mono">TEX</span>
                          </div>
                          <div className="absolute top-[150px] left-[150px] w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950 cursor-pointer group shadow-lg shadow-emerald-500/50" title="Salt Lake Hub">
                            <span className="absolute left-4 top-[-6px] hidden group-hover:block bg-slate-900 text-[10px] text-white py-0.5 px-1.5 rounded font-mono">SLC (HQ)</span>
                          </div>
                          <div className="absolute top-[30px] left-[180px] w-2.5 h-2.5 bg-yellow-500 rounded-full border-2 border-slate-950 cursor-pointer group" title="Aspen Gate"></div>
                          <div className="absolute top-[70px] left-[260px] w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-950 cursor-pointer group" title="Moab Outpost"></div>

                          <div className="absolute bottom-2 right-3 bg-slate-900/90 text-[10px] font-mono text-slate-400 py-1 px-2 rounded border border-slate-800">
                            LAT-LNG: GRID_WEST_09
                          </div>
                        </div>

                        <ul className="space-y-3 flex-1 overflow-y-auto max-h-40">
                          {ROUTES.slice(0, 3).map((rt, idx) => (
                            <li key={rt.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100">
                              <div className="flex items-center gap-2.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-amber-600"></div>
                                <div>
                                  <p className="text-xs font-bold text-slate-800">{rt.name}</p>
                                  <p className="text-[10px] text-slate-500">{rt.duration} • {rt.demand} Demand Profile</p>
                                </div>
                              </div>
                              <span className="text-[11px] font-bold text-slate-900 font-mono">${rt.basePrice}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Investor Quick Action controls */}
                      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                        <h3 className="font-bold text-sm text-slate-800 mb-4 flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-amber-600" />
                          Investor Strategic Controls
                        </h3>

                        {/* Optimize Loader Panel */}
                        {optimizing ? (
                          <div className="p-4 bg-slate-950 rounded-lg text-green-400 font-mono text-[10px] space-y-2 leading-relaxed mb-4 border border-green-950 animate-pulse">
                            {optimizerLog.map((log, i) => (
                              <p key={i}>&gt; {log}</p>
                            ))}
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <button
                              onClick={handleExportCSV}
                              className="p-3 bg-slate-50 border border-slate-200 text-[11px] font-extrabold rounded-lg hover:bg-slate-100 transition-all uppercase tracking-wider text-slate-700 flex flex-col items-center gap-1 text-center justify-center"
                            >
                              <Download className="w-4 h-4 text-slate-500" />
                              Export CSV
                            </button>
                            <button
                              onClick={handleOptimizeRoutes}
                              className="p-3 bg-amber-50 border border-amber-200 text-[11px] font-extrabold rounded-lg hover:bg-amber-100 hover:text-amber-900 transition-all uppercase tracking-wider text-amber-700 flex flex-col items-center gap-1 text-center justify-center"
                            >
                              <Sparkles className="w-4 h-4 text-amber-500" />
                              Optimize Loads
                            </button>
                          </div>
                        )}

                        {/* Variable Surcharges dynamically affecting margins */}
                        <div className="space-y-3 pt-3 border-t border-slate-100">
                          <div>
                            <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                              <span>Dynamic Surcharges (Per Ticket)</span>
                              <span className="font-bold text-slate-900">${feeSurcharge}</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="150"
                              value={feeSurcharge}
                              onChange={(e) => setFeeSurcharge(Number(e.target.value))}
                              className="w-full accent-amber-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
                            />
                          </div>

                          <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                            <span>Min: $10</span>
                            <span>Fuel Premium Surcharge Modifier</span>
                            <span>Max: $150</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: ROUTE DIRECTORY & CUSTOM AI PLANNER WITH INTERACTIVE TACTICAL MAP */}
              {activeTab === "routes" && (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 animate-fadeIn">

                  {/* LEFT COLUMN: Controls, Search & Directory (xl:col-span-7) */}
                  <div className="xl:col-span-7 space-y-6">

                    {/* AI Itinerary Builder Promo Box */}
                    <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-xl p-5 shadow-lg relative overflow-hidden border border-amber-900/30">
                      <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-5 bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:20px_20px]"></div>

                      <div className="max-w-2xl relative z-10">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-500/20 text-amber-300 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2 border border-amber-500/30">
                          <Sparkles className="w-3 h-3 text-amber-400" /> Custom Route Architect
                        </div>
                        <h3 className="text-lg font-extrabold tracking-tight">AI-Powered Intelligent Itinerary Planner</h3>
                        <p className="text-[11px] text-slate-300 mt-1 mb-3.5 leading-relaxed">
                          Describe a dream tour corridor (or drop an orange waypoint on the map on the right to auto-fill) and watch the Travel-Planner-Website fleet optimizer generate custom routes, stops, and price points.
                        </p>

                        <div className="flex gap-2 bg-white/10 p-1 rounded-lg backdrop-blur-md border border-white/15">
                          <input
                            type="text"
                            placeholder="Type custom region/tour focuses, or double-click the map to set waypoints..."
                            value={aiPrompt}
                            onChange={(e) => setAiPrompt(e.target.value)}
                            className="bg-transparent flex-1 text-xs text-white placeholder-slate-400 border-none outline-none focus:ring-0 px-2"
                            onKeyDown={(e) => e.key === "Enter" && handleAISmartPlan()}
                          />
                          <button
                            onClick={handleAISmartPlan}
                            disabled={aiGenerating || !aiPrompt}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white text-[10px] font-extrabold rounded-md uppercase tracking-wider transition-all"
                          >
                            {aiGenerating ? "Analyzing..." : "Generate Route"}
                          </button>
                        </div>
                      </div>

                      {/* AI Result Cards */}
                      {aiResult && (
                        <div className="mt-4 bg-white/95 text-slate-900 p-4 rounded-lg border border-white/20 shadow-xl animate-fadeIn">
                          <div className="flex justify-between items-start mb-2.5 border-b border-slate-100 pb-2">
                            <div>
                              <span className="text-[8px] bg-amber-100 text-amber-700 font-extrabold px-1.5 py-0.5 rounded uppercase">Optimized Custom Corridor</span>
                              <h4 className="font-extrabold text-sm text-slate-900 mt-0.5">{aiResult.routeName}</h4>
                            </div>
                            <div className="text-right">
                              <span className="text-[8px] text-slate-400 font-bold uppercase">Estimated Direct Price</span>
                              <p className="font-mono font-extrabold text-sm text-emerald-600">${aiResult.price}</p>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-600 mb-3 leading-relaxed">{aiResult.description}</p>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                            <div>
                              <h5 className="font-bold text-[9px] text-slate-400 uppercase">Target Hubs</h5>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {aiResult.cities.map((city, idx) => (
                                  <span key={idx} className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono text-[9px]">{city}</span>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h5 className="font-bold text-[9px] text-slate-400 uppercase">Curated Landmarks</h5>
                              <ul className="list-disc pl-3.5 mt-1 space-y-0.5 text-[10px] text-slate-600">
                                {aiResult.stops.slice(0, 3).map((stop, idx) => (
                                  <li key={idx} className="truncate">{stop}</li>
                                ))}
                              </ul>
                            </div>

                            <div>
                              <h5 className="font-bold text-[9px] text-slate-400 uppercase">Enterprise Suggestion</h5>
                              <div className="mt-1 p-1 bg-amber-50/50 rounded border border-amber-100 flex items-center gap-1.5 text-[10px]">
                                <Bus className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                <span className="font-bold text-amber-900 truncate">{aiResult.vehicleRecommendation.split(" ")[0]} Series</span>
                              </div>
                              <button
                                onClick={() => {
                                  // Automatically add to list and open booking tab
                                  const customRoute: RouteDetail = {
                                    id: `ai-custom-${Date.now()}`,
                                    name: aiResult.routeName,
                                    duration: "4 Days",
                                    demand: "High",
                                    basePrice: aiResult.price,
                                    cities: aiResult.cities,
                                    stops: aiResult.stops,
                                    frequency: "On-demand dispatch",
                                    description: aiResult.description
                                  };
                                  ROUTES.push(customRoute);
                                  setSelectedRouteForBooking(customRoute);
                                  setBookingForm((prev) => ({ ...prev, seats: [] }));
                                  setActiveTab("bookings");
                                  setIsBookingDrawerOpen(true);
                                  setBookingStep(1);
                                }}
                                className="mt-2 w-full py-1 bg-slate-900 hover:bg-slate-800 text-white text-[9px] font-bold rounded uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1"
                              >
                                Book Custom Tour Now <ArrowRight className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Standard Directory Search Bar */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-3 justify-between items-center">
                      <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search standard routes, cities, or national parks..."
                          value={searchRoute}
                          onChange={(e) => setSearchRoute(e.target.value)}
                          className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-amber-500 transition-all"
                        />
                      </div>

                      <div className="flex gap-2 w-full sm:w-auto">
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="w-full sm:w-auto px-2.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 outline-none"
                        >
                          <option value="ALL">All Demands</option>
                          <option value="High">High Demand</option>
                          <option value="Medium">Medium Demand</option>
                          <option value="Low">Low Demand</option>
                        </select>
                      </div>
                    </div>

                    {/* Grid of standard route directory */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ROUTES.filter((r) => {
                        const matchQuery = r.name.toLowerCase().includes(searchRoute.toLowerCase()) ||
                          r.cities.some(c => c.toLowerCase().includes(searchRoute.toLowerCase())) ||
                          r.stops.some(s => s.toLowerCase().includes(searchRoute.toLowerCase()));
                        const matchDemand = filterStatus === "ALL" || r.demand === filterStatus;
                        return matchQuery && matchDemand;
                      }).map((route) => (
                        <div
                          key={route.id}
                          onClick={() => setActiveRouteHighlight(route.id)}
                          className={`bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between cursor-pointer ${activeRouteHighlight === route.id ? "ring-2 ring-amber-500 border-transparent bg-amber-50/5" : "border-slate-200"
                            }`}
                        >
                          <div className="p-4 space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className={`px-1.5 py-0.5 text-[8px] font-extrabold rounded uppercase ${route.demand === "High" ? "bg-red-50 text-red-600 border border-red-100" : "bg-yellow-50 text-yellow-600 border border-yellow-100"
                                  }`}>
                                  {route.demand} Demand
                                </span>
                                <h4 className="font-extrabold text-xs text-slate-900 mt-1">{route.name}</h4>
                              </div>
                              <span className="font-mono font-black text-xs text-slate-900">${route.basePrice}</span>
                            </div>

                            <p className="text-[10px] text-slate-500 leading-relaxed line-clamp-2">{route.description}</p>

                            <div className="space-y-1.5 pt-1.5 border-t border-slate-100 text-[10px]">
                              <div>
                                <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">Stations Included</p>
                                <div className="flex flex-wrap gap-1 mt-0.5">
                                  {route.cities.map((city, idx) => (
                                    <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 px-1 py-0.5 rounded text-[9px] font-medium font-mono">
                                      {city}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px]">
                            <span className="text-[9px] text-slate-500 font-bold font-mono uppercase">{route.frequency}</span>
                            <div className="flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveRouteHighlight(route.id);
                                }}
                                className="px-2 py-1 bg-slate-200 text-slate-700 font-bold text-[9px] rounded uppercase hover:bg-slate-300"
                              >
                                Show Map
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRouteForBooking(route);
                                  setBookingForm((prev) => ({ ...prev, seats: [] }));
                                  setActiveTab("bookings");
                                  setIsBookingDrawerOpen(true);
                                  setBookingStep(1);
                                }}
                                className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded uppercase tracking-wider"
                              >
                                Book
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* RIGHT COLUMN: Interactive Tactical Mission Control Map (xl:col-span-5) */}
                  <div className="xl:col-span-5 space-y-4">

                    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col h-full justify-between">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                            <MapIcon className="w-4 h-4 text-amber-600 animate-pulse" />
                            CORRIDOR MISSION RADAR
                          </h3>
                          <div className="text-[9px] font-mono text-slate-400">
                            US_WEST_TACTICAL_BLUEPRINT
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-500 leading-normal">
                          Click hubs to check status. Click anywhere to drop a waypoint beacon. Highlighted path reflects selection.
                        </p>
                      </div>

                      {/* Interactive Layers Selector */}
                      <div className="grid grid-cols-3 gap-1 my-3 bg-slate-100 p-1 rounded-lg">
                        <button
                          onClick={() => setMapLayer("blueprint")}
                          className={`py-1 text-[9px] font-bold uppercase rounded transition-all flex items-center justify-center gap-1 ${mapLayer === "blueprint" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                          <Layers className="w-3 h-3 text-amber-600" /> Blueprint
                        </button>
                        <button
                          onClick={() => setMapLayer("weather")}
                          className={`py-1 text-[9px] font-bold uppercase rounded transition-all flex items-center justify-center gap-1 ${mapLayer === "weather" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                          <span className="text-amber-500">⛅</span> Weather
                        </button>
                        <button
                          onClick={() => setMapLayer("radar")}
                          className={`py-1 text-[9px] font-bold uppercase rounded transition-all flex items-center justify-center gap-1 ${mapLayer === "radar" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                            }`}
                        >
                          <span className="w-2 h-2 rounded-full bg-green-500 animate-ping inline-block"></span> Fleet Radar
                        </button>
                      </div>

                      {/* Interactive SVG Canvas */}
                      <div
                        className="w-full h-[400px] bg-slate-950 rounded-xl relative overflow-hidden border border-slate-800 shadow-inner flex flex-col justify-between cursor-crosshair group select-none"
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = Math.round(((e.clientX - rect.left) / rect.width) * 500);
                          const y = Math.round(((e.clientY - rect.top) / rect.height) * 450);
                          setHoveredCoords({ x, y });
                        }}
                        onMouseLeave={() => setHoveredCoords(null)}
                        onClick={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = Math.round(((e.clientX - rect.left) / rect.width) * 500);
                          const y = Math.round(((e.clientY - rect.top) / rect.height) * 450);

                          // Convert to logical Lat-Lng
                          const lat = (49 - (y / 450) * (49 - 32.5)).toFixed(4);
                          const lng = (-124.5 + (x / 500) * (-70 - (-124.5))).toFixed(4);

                          // Drop dynamic beacon
                          const newBeacon = {
                            id: `beacon-${Date.now()}`,
                            x,
                            y,
                            lat,
                            lng
                          };
                          setCustomBeacons((prev) => [...prev, newBeacon]);
                        }}
                      >
                        {/* Grid overlay */}
                        <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px]"></div>

                        {/* SVG layers rendering */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 450" xmlns="http://www.w3.org/2000/svg">

                          {/* Coastline / Mountain Contour Vector Graphics */}
                          <path d="M 15 10 Q 55 50 35 120 T 40 260 T 90 380 T 110 440" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="3 3" />
                          <path d="M 220 50 L 260 90 L 280 150 L 220 220 L 200 350" fill="none" stroke="#1e293b" strokeWidth="1" />

                          {/* WEATHER LAYER CLOUD SIMULATORS */}
                          {mapLayer === "weather" && (
                            <>
                              {/* Pulsing precipitation overlays */}
                              <circle cx="220" cy="160" r="45" fill="rgba(59, 130, 246, 0.15)" className="animate-pulse" />
                              <circle cx="80" cy="80" r="30" fill="rgba(16, 185, 129, 0.12)" />
                              <circle cx="340" cy="220" r="50" fill="rgba(239, 68, 68, 0.08)" />
                            </>
                          )}

                          {/* TRANSIT TRACK CONNECTIONS */}
                          {/* Route 1: Alpine Vista (Rocky Mountains) */}
                          <path
                            d="M 180 140 L 235 195 L 260 175 L 250 155 L 295 150"
                            fill="none"
                            stroke={activeRouteHighlight === "route-1" ? "#3b82f6" : "#1e293b"}
                            strokeWidth={activeRouteHighlight === "route-1" ? "3" : "1.5"}
                            strokeDasharray={activeRouteHighlight === "route-1" ? "4 2" : "none"}
                            className={activeRouteHighlight === "route-1" ? "animate-pulse" : ""}
                            style={{ transition: "all 0.3s" }}
                          />

                          {/* Route 2: Metropolis East connector */}
                          <path
                            d="M 295 150 Q 380 120, 450 100"
                            fill="none"
                            stroke={activeRouteHighlight === "route-2" ? "#3b82f6" : "#1e293b"}
                            strokeWidth={activeRouteHighlight === "route-2" ? "3" : "1.5"}
                            strokeDasharray="5 5"
                          />

                          {/* Route 3: Coastal Heritage */}
                          <path
                            d="M 40 220 L 100 310 L 125 340"
                            fill="none"
                            stroke={activeRouteHighlight === "route-3" ? "#10b981" : "#1e293b"}
                            strokeWidth={activeRouteHighlight === "route-3" ? "3" : "1.5"}
                            strokeDasharray={activeRouteHighlight === "route-3" ? "5 2" : "none"}
                          />

                          {/* Route 4: Grand Canyon South */}
                          <path
                            d="M 140 240 L 170 260 L 185 280"
                            fill="none"
                            stroke={activeRouteHighlight === "route-4" ? "#f59e0b" : "#1e293b"}
                            strokeWidth={activeRouteHighlight === "route-4" ? "3" : "1.5"}
                          />

                          {/* Route 5: Pacific Rainforest Trail */}
                          <path
                            d="M 60 50 L 65 90"
                            fill="none"
                            stroke={activeRouteHighlight === "route-5" ? "#6366f1" : "#1e293b"}
                            strokeWidth={activeRouteHighlight === "route-5" ? "3" : "1.5"}
                          />

                          {/* FLEET RADAR SATELLITE ROTATOR */}
                          {mapLayer === "radar" && (
                            <>
                              {/* Animated radar rings and sweeping vectors */}
                              <circle cx="250" cy="225" r="180" fill="none" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.15" />
                              <circle cx="250" cy="225" r="90" fill="none" stroke="#22c55e" strokeWidth="0.5" strokeOpacity="0.2" strokeDasharray="4 4" />
                              {/* Moving triangles indicating real-time GPS locations of transit vehicles */}
                              <polygon points="190,160 194,168 186,168" fill="#22c55e" className="animate-bounce" />
                              <text x="200" y="165" fill="#22c55e" fontSize="8" fontFamily="monospace" fontWeight="bold">EX-COACH-104 (52mph)</text>

                              <polygon points="110,270 114,278 106,278" fill="#22c55e" />
                              <text x="120" y="275" fill="#22c55e" fontSize="8" fontFamily="monospace" fontWeight="bold">EX-COACH-212 (48mph)</text>

                              <polygon points="270,152 274,160 266,160" fill="#3b82f6" />
                              <text x="280" y="157" fill="#3b82f6" fontSize="8" fontFamily="monospace" fontWeight="bold">SKY-LINX-09 (BOARDING)</text>
                            </>
                          )}
                        </svg>

                        {/* EAST COAST TERMINAL INSET FOR ROUTE-2 */}
                        {activeRouteHighlight === "route-2" && (
                          <div className="absolute top-4 right-4 bg-slate-900/90 border border-amber-500/40 p-2 rounded text-[10px] font-mono text-amber-300 animate-pulse z-10 max-w-[160px]">
                            <p className="font-bold border-b border-amber-900 pb-1 mb-1">⚡ METROPOLIS E-LINK</p>
                            <p>Bridging NYC • PHL • DC • BOS</p>
                            <p className="text-[8px] text-slate-400 mt-1">High-Speed Corridor Active</p>
                          </div>
                        )}

                        {/* STATION NODES MARKERS */}
                        {[
                          { code: "SEA", name: "Seattle Hub", x: 60, y: 50, weather: "Rainy/Misty", temp: "59°F", fleetCount: 2, notes: "Rainforest Trail origin." },
                          { code: "PDX", name: "Portland Terminal", x: 65, y: 90, weather: "Overcast", temp: "64°F", fleetCount: 1, notes: "Cascade foothills access." },
                          { code: "SFO", name: "San Francisco Apex", x: 40, y: 220, weather: "Breezy/Foggy", temp: "61°F", fleetCount: 2, notes: "Coastal Heritage gateway." },
                          { code: "LAX", name: "Los Angeles Hub", x: 100, y: 310, weather: "Sunny/Clear", temp: "79°F", fleetCount: 3, notes: "Malibu terminal operational." },
                          { code: "SAN", name: "San Diego South", x: 125, y: 340, weather: "Clear", temp: "75°F", fleetCount: 1, notes: "Southern border link." },
                          { code: "LAS", name: "Las Vegas Depot", x: 140, y: 240, weather: "Hot/Sunny", temp: "102°F", fleetCount: 2, notes: "High thermal operations." },
                          { code: "SLC", name: "Salt Lake HQ", x: 180, y: 140, weather: "Sunny/Dry", temp: "84°F", fleetCount: 4, notes: "Travel-Planner-Website Primary dispatch." },
                          { code: "DEN", name: "Denver Hub", x: 295, y: 150, weather: "Partly Cloudy", temp: "74°F", fleetCount: 3, notes: "East slope hub connection." },
                          { code: "EGE", name: "Vail Station", x: 250, y: 155, weather: "Light Showers", temp: "60°F", fleetCount: 1, notes: "High elevation pass advisory." },
                          { code: "ASE", name: "Aspen Gate", x: 260, y: 175, weather: "Clear/Cool", temp: "65°F", fleetCount: 2, notes: "Luxury layout base." },
                          { code: "TEX", name: "Telluride Base", x: 235, y: 195, weather: "Sunny", temp: "68°F", fleetCount: 1, notes: "Remote peak routing active." },
                          { code: "CNY", name: "Moab Outpost", x: 190, y: 190, weather: "Sunny/Arid", temp: "94°F", fleetCount: 1, notes: "Arches excursion dispatch." }
                        ].map((node) => (
                          <button
                            key={node.code}
                            onClick={(e) => {
                              e.stopPropagation();
                              setMapSelectedNode({
                                code: node.code,
                                name: node.name,
                                weather: node.weather,
                                temp: node.temp,
                                fleetCount: node.fleetCount,
                                notes: node.notes,
                                coords: { x: node.x, y: node.y }
                              });
                            }}
                            className="absolute w-3.5 h-3.5 rounded-full border border-slate-950 flex items-center justify-center transition-all group z-10 bg-slate-900 text-white"
                            style={{
                              left: `${(node.x / 500) * 100}%`,
                              top: `${(node.y / 450) * 100}%`,
                              transform: "translate(-50%, -50%)",
                              boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)"
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 group-hover:bg-blue-300"></span>
                            <span className="absolute left-4 top-[-6px] hidden group-hover:block bg-slate-900 text-[8px] font-mono text-white py-0.5 px-1.5 rounded-md whitespace-nowrap border border-slate-700">
                              {node.code} ({node.temp})
                            </span>
                          </button>
                        ))}

                        {/* CUSTOM DROPPED BEACONS LAYERS */}
                        {customBeacons.map((beacon) => (
                          <div
                            key={beacon.id}
                            className="absolute w-4 h-4 flex items-center justify-center z-20 group cursor-pointer"
                            style={{
                              left: `${(beacon.x / 500) * 100}%`,
                              top: `${(beacon.y / 450) * 100}%`,
                              transform: "translate(-50%, -50%)"
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setAiPrompt(`Custom excursion planning starting near coordinate coordinates [Lat: ${beacon.lat}, Lng: ${beacon.lng}] covering major mountain valleys`);
                              // Scroll to AI panel and focus
                              const aiPanel = document.getElementById("app-main-content");
                              if (aiPanel) aiPanel.scrollTop = 0;
                            }}
                          >
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600 border border-white"></span>
                            <div className="absolute bottom-5 hidden group-hover:flex flex-col bg-slate-900 text-[8px] text-white p-1.5 rounded border border-orange-500 font-mono z-30 w-36 shadow-lg">
                              <p className="font-bold text-orange-400 uppercase text-[7px]">CUSTOM BEACON DROPPED</p>
                              <p>Lat: {beacon.lat}</p>
                              <p>Lng: {beacon.lng}</p>
                              <p className="text-amber-300 mt-1 cursor-pointer underline">Click to feed AI Architect</p>
                            </div>
                          </div>
                        ))}

                        {/* HUD footer readout */}
                        <div className="p-2.5 bg-slate-900/95 border-t border-slate-800 flex justify-between items-center text-[9px] font-mono text-slate-400 z-10">
                          <div>
                            {hoveredCoords ? (
                              <span>
                                CURSOR COORDINATES: Lat: {(49 - (hoveredCoords.y / 450) * (49 - 32.5)).toFixed(3)}°N, Lng: {(-124.5 + (hoveredCoords.x / 500) * (-70 - (-124.5))).toFixed(3)}°W
                              </span>
                            ) : (
                              <span>RADAR ACTIVE • MONITORING CORRIDORS</span>
                            )}
                          </div>
                          <div>
                            BEACONS: {customBeacons.length} ACTIVE
                          </div>
                        </div>
                      </div>

                      {/* STATION DETAIL HUD POP-UP */}
                      {mapSelectedNode && (
                        <div className="mt-3 bg-slate-900 text-white rounded-lg p-3.5 border border-slate-800 shadow-lg animate-scaleIn relative">
                          <button
                            onClick={() => setMapSelectedNode(null)}
                            className="absolute right-2 top-2 text-slate-500 hover:text-white"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="flex justify-between items-start border-b border-slate-800 pb-2 mb-2">
                            <div>
                              <span className="text-[8px] bg-amber-900 text-amber-300 font-mono font-bold px-1.5 py-0.5 rounded">STATION CODE: {mapSelectedNode.code}</span>
                              <h4 className="font-extrabold text-sm mt-0.5">{mapSelectedNode.name}</h4>
                            </div>
                            <div className="text-right">
                              <p className="text-emerald-400 font-bold text-xs">{mapSelectedNode.temp}</p>
                              <p className="text-[8px] text-slate-500 uppercase">{mapSelectedNode.weather}</p>
                            </div>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-normal">{mapSelectedNode.notes}</p>

                          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800/60 text-[9px] font-mono text-slate-500">
                            <div>
                              ACTIVE DISPATCHES: <strong className="text-white">{mapSelectedNode.fleetCount} Coach Vehicles</strong>
                            </div>
                            <div className="text-right">
                              STATUS: <strong className="text-green-400 font-bold">OPTIMAL HUB</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Custom waypoint instructions */}
                      <div className="mt-3 bg-amber-50/50 border border-amber-100 p-2.5 rounded-lg text-[10px] leading-relaxed text-amber-900 flex gap-2">
                        <span className="text-base">💡</span>
                        <p>
                          <strong>Interactive Waypoints:</strong> Double-click or tap anywhere on the radar map to drop custom orange beacons. Click a dropped beacon to automatically populate the Custom AI Itinerary planner inputs!
                        </p>
                      </div>

                    </div>

                  </div>

                </div>
              )}

              {/* TAB 3: FLEET INVENTORY & VEHICLE MANAGEMENT */}
              {activeTab === "fleet" && (
                <div className="space-y-6">

                  <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                      <div>
                        <h3 className="font-bold text-slate-800 text-sm">Luxury Fleet Calibration</h3>
                        <p className="text-xs text-slate-500">Configure status, check maintenance diagnostics, and calibrate fuel parameters.</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            // Mark all IDLE buses as maintenance
                            setVehicles((prev) =>
                              prev.map((v) => (v.status === "IDLE" ? { ...v, status: "MAINTENANCE" } : v))
                            );
                          }}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-[10px] rounded border border-slate-200 uppercase tracking-wider"
                        >
                          Mass Idle Check
                        </button>
                        <button
                          onClick={() => {
                            // Recharge fuel for all
                            setVehicles((prev) => prev.map((v) => ({ ...v, fuel: 100 })));
                          }}
                          className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-[10px] rounded border border-amber-200 uppercase tracking-wider"
                        >
                          Refuel Fleet (100%)
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {vehicles.map((v) => (
                        <div key={v.id} className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-black font-mono">
                                  {v.type}
                                </span>
                                <h4 className="font-mono font-extrabold text-sm text-slate-900 mt-1">{v.id}</h4>
                              </div>

                              {/* Interactive status toggler */}
                              <select
                                value={v.status}
                                onChange={(e) => {
                                  const newStatus = e.target.value as any;
                                  setVehicles((prev) =>
                                    prev.map((orig) =>
                                      orig.id === v.id
                                        ? {
                                          ...orig,
                                          status: newStatus,
                                          load: newStatus === "IDLE" || newStatus === "MAINTENANCE" ? 0 : orig.load
                                        }
                                        : orig
                                    )
                                  );
                                }}
                                className={`text-[10px] font-extrabold rounded-md px-2 py-1 outline-none border cursor-pointer ${v.status === "EN ROUTE"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : v.status === "BOARDING"
                                      ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                                      : v.status === "IDLE"
                                        ? "bg-amber-100 text-amber-700 border-amber-200"
                                        : "bg-red-100 text-red-700 border-red-200"
                                  }`}
                              >
                                <option value="EN ROUTE">EN ROUTE</option>
                                <option value="BOARDING">BOARDING</option>
                                <option value="IDLE">IDLE</option>
                                <option value="MAINTENANCE">MAINTENANCE</option>
                              </select>
                            </div>

                            {/* Driver details and corridor */}
                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-semibold">Assigned Route</span>
                                <span className="text-slate-900 font-bold">{v.route}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 font-semibold">Assigned Pilot</span>
                                <span className="text-slate-700 font-medium">{v.driver}</span>
                              </div>
                            </div>

                            {/* Capacity gauge */}
                            <div>
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-slate-500">Passenger Load Average</span>
                                <span className="font-bold text-slate-900 font-mono">{v.load}/{v.capacity} seats</span>
                              </div>
                              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                <div
                                  className="bg-amber-600 h-full transition-all duration-300"
                                  style={{ width: `${(v.load / v.capacity) * 100}%` }}
                                ></div>
                              </div>
                            </div>

                            {/* Fuel slider so they can simulate custom mileage */}
                            <div className="pt-2 border-t border-slate-200">
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-slate-500 font-medium flex items-center gap-1">
                                  <Gauge className="w-3 h-3 text-slate-400" />
                                  Simulated Diagnostics (Fuel)
                                </span>
                                <span className="font-bold font-mono text-slate-800">{v.fuel}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={v.fuel}
                                onChange={(e) => {
                                  const newFuel = Number(e.target.value);
                                  setVehicles((prev) =>
                                    prev.map((orig) => (orig.id === v.id ? { ...orig, fuel: newFuel } : orig))
                                  );
                                }}
                                className="w-full accent-slate-800 h-1 bg-slate-200 rounded-lg cursor-pointer"
                              />
                            </div>
                          </div>

                          {/* Warning on fuel or maintenance issues */}
                          {v.fuel < 25 && (
                            <div className="mt-3 bg-red-50 border border-red-200 text-red-700 p-2 rounded text-[10px] font-semibold flex items-center gap-1">
                              <Wrench className="w-3 h-3 text-red-500 animate-bounce" /> Warning: Low fuel level. Route assignment vulnerable!
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 4: DIRECT BOOKING HUB & TRANSACTION LIST */}
              {activeTab === "bookings" && (
                <div className="space-y-6">

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Bookings Table list */}
                    <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between">
                      <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                          <h3 className="font-bold text-sm text-slate-800">Booking Dispatch Ledger</h3>
                          <p className="text-xs text-slate-500 mt-0.5">Direct checkout operations and client transaction audits</p>
                        </div>
                        <button
                          onClick={() => {
                            // Open checkout drawer
                            setIsBookingDrawerOpen(true);
                            setBookingStep(1);
                          }}
                          className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-bold rounded-lg uppercase tracking-wider transition-all shadow-md shadow-amber-100 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Book Ticket
                        </button>
                      </div>

                      <div className="overflow-x-auto flex-1">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
                              <th className="py-3 px-5">Booking ID</th>
                              <th className="py-3 px-5">Lead Passenger</th>
                              <th className="py-3 px-5">Tour Assignment</th>
                              <th className="py-3 px-5">Assigned Coach</th>
                              <th className="py-3 px-5 text-center">Seats Reserved</th>
                              <th className="py-3 px-5 text-right">Total Paid</th>
                              <th className="py-3 px-5 text-right">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {bookings.map((bk) => (
                              <tr key={bk.id} className="hover:bg-slate-50/60 transition-colors text-slate-700 font-medium">
                                <td className="py-4 px-5 font-mono font-bold text-slate-900">{bk.id}</td>
                                <td className="py-4 px-5">
                                  <div>
                                    <p className="font-bold text-slate-900">{bk.passengerName}</p>
                                    <p className="text-[10px] text-slate-400 font-mono">{bk.passengerEmail}</p>
                                  </div>
                                </td>
                                <td className="py-4 px-5 text-slate-900 font-semibold">{bk.routeName}</td>
                                <td className="py-4 px-5 font-mono text-slate-600">{bk.vehicleId}</td>
                                <td className="py-4 px-5 text-center">
                                  <span className="bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded font-mono text-[10px]">
                                    {bk.seats.map((s) => `#${s}`).join(", ")}
                                  </span>
                                </td>
                                <td className="py-4 px-5 text-right font-mono font-bold text-slate-900">
                                  ${bk.totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                                <td className="py-4 px-5 text-right">
                                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-green-200">
                                    {bk.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="p-4 bg-slate-50 border-t border-slate-100 text-slate-500 text-[11px] font-mono">
                        TOTAL REGISTERED TRANSACTIONS: {bookings.length} CORES • DIRECT BOOKING CONSOLIDATED REPORT
                      </div>
                    </div>

                    {/* Direct Booking Drawer / Step Form Box */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="border-b border-slate-100 pb-3 mb-4">
                          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                            <Ticket className="w-4 h-4 text-amber-600" />
                            Direct Seating Booker
                          </h3>
                          <p className="text-xs text-slate-500 mt-0.5">Quickly secure tourist client seatings live.</p>
                        </div>

                        {isBookingDrawerOpen ? (
                          <div className="space-y-4">

                            {/* Step indicator */}
                            <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 bg-slate-50 p-2 rounded border border-slate-100">
                              <span className={bookingStep === 1 ? "text-amber-600 font-bold" : ""}>1. CORRIDOR</span>
                              <span className="text-slate-300">/</span>
                              <span className={bookingStep === 2 ? "text-amber-600 font-bold" : ""}>2. SEATS</span>
                              <span className="text-slate-300">/</span>
                              <span className={bookingStep === 3 ? "text-amber-600 font-bold" : ""}>3. RECEIPT</span>
                            </div>

                            {/* STEP 1: Select Route and Pilot */}
                            {bookingStep === 1 && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Active Tour Route</label>
                                  <select
                                    value={selectedRouteForBooking.id}
                                    onChange={(e) => {
                                      const r = ROUTES.find((route) => route.id === e.target.value);
                                      if (r) {
                                        setSelectedRouteForBooking(r);
                                        // auto match any vehicle on this route
                                        const v = vehicles.find((v) => v.route === r.name) || vehicles[0];
                                        setSelectedVehicleForBooking(v);
                                      }
                                    }}
                                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                                  >
                                    {ROUTES.map((route) => (
                                      <option key={route.id} value={route.id}>
                                        {route.name} (${route.basePrice})
                                      </option>
                                    ))}
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Matched Transport Vehicle</label>
                                  <div className="p-3 bg-amber-50/50 rounded-lg border border-amber-100 text-xs">
                                    <div className="flex justify-between font-bold text-amber-900">
                                      <span>{selectedVehicleForBooking.id} ({selectedVehicleForBooking.type})</span>
                                      <span>{selectedVehicleForBooking.load}/{selectedVehicleForBooking.capacity} Seats Filled</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-1">Assigned Driver: {selectedVehicleForBooking.driver}</p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setBookingStep(2)}
                                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5"
                                >
                                  Proceed to Seat Selection <ArrowRight className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}

                            {/* STEP 2: Seating Chart and Passenger info */}
                            {bookingStep === 2 && (
                              <div className="space-y-4">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 text-center">Coach Seating Map Layout</label>

                                  {/* Grid representation of 48 coach seats (4 seats per row, aisles in middle) */}
                                  <div className="max-h-44 overflow-y-auto p-3 bg-slate-950 rounded-lg border border-slate-800">
                                    <div className="w-11/12 mx-auto text-center border-b border-slate-800 pb-2 mb-2 text-[9px] font-mono text-slate-500 flex justify-between items-center">
                                      <span>[ COCKPIT DRIVER ]</span>
                                      <span>[ DOOR ]</span>
                                    </div>

                                    <div className="grid grid-cols-4 gap-1.5 max-w-[160px] mx-auto text-[9px] font-bold font-mono text-white">
                                      {Array.from({ length: selectedVehicleForBooking.capacity }, (_, i) => i + 1).map((seatNum) => {
                                        // Simulate some pre-booked seats based on random factors or selectedBooking seats
                                        const isPrebooked = seatNum % 5 === 1 || seatNum === 14 || seatNum === 25;
                                        const isSelected = bookingForm.seats.includes(seatNum);

                                        return (
                                          <button
                                            key={seatNum}
                                            type="button"
                                            disabled={isPrebooked}
                                            onClick={() => {
                                              if (isSelected) {
                                                setBookingForm((prev) => ({
                                                  ...prev,
                                                  seats: prev.seats.filter((s) => s !== seatNum)
                                                }));
                                              } else {
                                                setBookingForm((prev) => ({
                                                  ...prev,
                                                  seats: [...prev.seats, seatNum]
                                                }));
                                              }
                                            }}
                                            className={`w-7 h-7 rounded flex items-center justify-center border transition-all ${isPrebooked
                                                ? "bg-slate-800 text-slate-600 border-slate-900 cursor-not-allowed"
                                                : isSelected
                                                  ? "bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold"
                                                  : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-500"
                                              }`}
                                          >
                                            {seatNum}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>

                                {/* Ticket Details Form */}
                                <form onSubmit={handleConfirmBooking} className="space-y-3 pt-2">
                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Lead Passenger Name</label>
                                    <input
                                      type="text"
                                      required
                                      value={bookingForm.name}
                                      onChange={(e) => setBookingForm((p) => ({ ...p, name: e.target.value }))}
                                      placeholder="Jane Sterling"
                                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs outline-none focus:bg-white focus:border-amber-500"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Passenger Email</label>
                                    <input
                                      type="email"
                                      required
                                      value={bookingForm.email}
                                      onChange={(e) => setBookingForm((p) => ({ ...p, email: e.target.value }))}
                                      placeholder="jane@sterlingcorp.com"
                                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded text-xs outline-none focus:bg-white focus:border-amber-500"
                                    />
                                  </div>

                                  {/* Price Calculations */}
                                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs space-y-1">
                                    <div className="flex justify-between">
                                      <span>Tickets ({bookingForm.seats.length}x)</span>
                                      <span className="font-mono font-bold">${selectedRouteForBooking.basePrice * bookingForm.seats.length}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] text-slate-500">
                                      <span>Investor Surcharges ({bookingForm.seats.length}x)</span>
                                      <span className="font-mono">${feeSurcharge * bookingForm.seats.length}</span>
                                    </div>
                                    <div className="flex justify-between text-[11px] text-slate-500">
                                      <span>Sales Tax ({taxRate}%)</span>
                                      <span className="font-mono">
                                        $
                                        {(
                                          (selectedRouteForBooking.basePrice * bookingForm.seats.length +
                                            feeSurcharge * bookingForm.seats.length) *
                                          (taxRate / 100)
                                        ).toFixed(2)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between font-black text-slate-900 border-t border-slate-200 pt-1.5 mt-1.5 text-sm">
                                      <span>Consolidated Total</span>
                                      <span className="font-mono text-emerald-600">
                                        $
                                        {(
                                          selectedRouteForBooking.basePrice * bookingForm.seats.length +
                                          feeSurcharge * bookingForm.seats.length +
                                          (selectedRouteForBooking.basePrice * bookingForm.seats.length +
                                            feeSurcharge * bookingForm.seats.length) *
                                          (taxRate / 100)
                                        ).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setBookingStep(1)}
                                      className="w-1/3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg uppercase tracking-wider transition-all"
                                    >
                                      Back
                                    </button>
                                    <button
                                      type="submit"
                                      className="w-2/3 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-all shadow-md shadow-blue-200"
                                    >
                                      Complete Dispatch
                                    </button>
                                  </div>
                                </form>
                              </div>
                            )}

                            {/* STEP 3: Boarding Pass Printout Receipt */}
                            {bookingStep === 3 && (
                              <div className="space-y-4 animate-fadeIn">

                                <div className="border border-slate-300 p-4 rounded-xl bg-slate-50 text-slate-900 shadow-sm space-y-4 relative overflow-hidden">
                                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-600/5 rounded-bl-full flex items-center justify-end pr-3 pt-3">
                                    <ShieldCheck className="w-6 h-6 text-amber-600" />
                                  </div>

                                  <div className="text-center border-b border-dashed border-slate-300 pb-3">
                                    <h4 className="text-[10px] text-amber-600 uppercase font-black tracking-widest">Boarding Pass Ticket</h4>
                                    <h3 className="font-extrabold text-lg text-slate-900 mt-1 uppercase">Travel-Planner-Website Wings</h3>
                                    <p className="text-[9px] text-slate-400 font-mono mt-0.5">BOOKING ID: {bookings[0].id}</p>
                                  </div>

                                  <div className="space-y-3 text-xs leading-relaxed">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Lead Guest</span>
                                        <span className="font-extrabold text-slate-800">{bookings[0].passengerName}</span>
                                      </div>
                                      <div>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Pilot / Vehicle</span>
                                        <span className="font-extrabold text-slate-800">{selectedVehicleForBooking.id}</span>
                                      </div>
                                    </div>

                                    <div>
                                      <span className="text-[9px] text-slate-400 font-bold uppercase block">Assigned Tour Route Corridor</span>
                                      <span className="font-extrabold text-slate-800 flex items-center gap-1">
                                        <MapPin className="w-3.5 h-3.5 text-amber-600" /> {bookings[0].routeName}
                                      </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                      <div>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Reserved Seats</span>
                                        <span className="font-extrabold text-emerald-600 font-mono">
                                          {bookings[0].seats.map((s) => `S-${s}`).join(", ")}
                                        </span>
                                      </div>
                                      <div>
                                        <span className="text-[9px] text-slate-400 font-bold uppercase block">Gate Departure</span>
                                        <span className="font-extrabold text-slate-800 font-mono">
                                          {selectedRouteForBooking.frequency.split("-")[1] || "8:00 AM"}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Barcode Visual Representation */}
                                  <div className="border-t border-slate-200 pt-3 flex flex-col items-center gap-1.5 justify-center">
                                    <div className="h-10 bg-white border border-slate-200 rounded px-4 flex items-center justify-center gap-0.5 font-mono text-[8px] text-slate-400 select-none tracking-[2.5px] max-w-xs overflow-hidden">
                                      ||||| | ||| || |||| ||| || | |||| ||| |
                                    </div>
                                    <span className="text-[9px] text-slate-400 font-mono uppercase">DISPATCH_CONFIRMED_OK</span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setBookingForm({
                                      name: "",
                                      email: "",
                                      seats: [],
                                      agreeToTerms: false
                                    });
                                    setBookingStep(1);
                                  }}
                                  className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-all text-center"
                                >
                                  Dispatch Another Tour
                                </button>
                              </div>
                            )}

                          </div>
                        ) : (
                          <div className="py-10 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
                            <Ticket className="w-8 h-8 text-slate-300 stroke-1" />
                            <p className="text-xs font-medium">No live ticket booking active in drawer.</p>
                            <button
                              onClick={() => {
                                setIsBookingDrawerOpen(true);
                                setBookingStep(1);
                              }}
                              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-md uppercase tracking-wider transition-all"
                            >
                              Book Seating Now
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="bg-slate-50 border border-slate-100 p-3.5 rounded-lg text-xs space-y-1 mt-4">
                        <h4 className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                          <Info className="w-3.5 h-3.5 text-amber-500" />
                          Global Sales Tax Adjuster
                        </h4>
                        <div className="flex justify-between items-center gap-2 pt-1">
                          <span className="text-slate-400 font-semibold">Taxes Rate:</span>
                          <div className="flex items-center gap-1 font-mono font-bold">
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              max="25"
                              value={taxRate}
                              onChange={(e) => setTaxRate(Number(e.target.value))}
                              className="w-12 bg-white border border-slate-200 text-center text-xs py-0.5 rounded text-slate-900 outline-none"
                            />
                            <span>%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                </div>
              )}

              {/* TAB 5: ENTERPRISE CORRIDOR ANALYTICS */}
              {activeTab === "analytics" && (
                <div className="space-y-6 animate-fadeIn">

                  {/* Analytics Header Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-amber-400 transition-all">
                      <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Average Ticket Revenue</h4>
                      <p className="text-3xl font-black text-slate-800 mt-1.5">$804.00</p>
                      <div className="text-xs text-green-600 font-bold flex items-center gap-1 mt-3">
                        <TrendingUp className="w-3.5 h-3.5" />
                        +4.8% vs quarterly target
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-amber-400 transition-all">
                      <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Asset Utilization Efficiency</h4>
                      <p className="text-3xl font-black text-slate-800 mt-1.5">88.5%</p>
                      <div className="text-xs text-amber-600 font-bold flex items-center gap-1 mt-3">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Peak hours: 10AM - 3PM
                      </div>
                    </div>

                    <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm hover:border-amber-400 transition-all">
                      <h4 className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Surcharge Margin Contribution</h4>
                      <p className="text-3xl font-black text-emerald-600 mt-1.5">
                        ${(feeSurcharge * bookings.length).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <div className="text-xs text-slate-500 mt-3 font-semibold">
                        Calculated from {bookings.length} active dispatches
                      </div>
                    </div>
                  </div>

                  {/* Main Charts Split */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                    {/* Chart 1: Revenue & Surcharges per Route */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-800">Financial Comparison by Corridor</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Base prices vs dynamic load-adjusted values</p>
                      </div>

                      <div className="h-72 w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={ROUTES.map((r) => ({
                              name: r.name.split(" ").slice(0, 2).join(" "), // short name
                              "Base Price": r.basePrice,
                              "Total Surcharged": r.basePrice + feeSurcharge
                            }))}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                            <Legend wrapperStyle={{ fontSize: 10 }} />
                            <Bar dataKey="Base Price" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="Total Surcharged" fill="#10b981" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Chart 2: Load Utilization area chart */}
                    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-slate-800">Capacity & Fleet Occupancy Rates</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Average passenger filling rates vs total capacity limit</p>
                      </div>

                      <div className="h-72 w-full mt-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart
                            data={vehicles.map((v) => ({
                              name: v.id,
                              "Passenger Load": v.load,
                              "Vehicle Capacity": v.capacity
                            }))}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                          >
                            <defs>
                              <linearGradient id="loadColor" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                            <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: '1px solid #e2e8f0' }} />
                            <Legend wrapperStyle={{ fontSize: 10 }} />
                            <Area type="monotone" dataKey="Passenger Load" stroke="#3b82f6" fillOpacity={1} fill="url(#loadColor)" strokeWidth={2} />
                            <Area type="monotone" dataKey="Vehicle Capacity" stroke="#94a3b8" strokeDasharray="4 4" fill="none" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Strategy Report Card */}
                  <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-md border border-slate-800">
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      Enterprise Tourism Feasibility & Yield Analysis
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Based on live pricing inputs (${feeSurcharge} dynamic surcharge) and our currently-utilized vehicle capacity ({
                        Math.round(
                          (vehicles.reduce((acc, v) => acc + v.load, 0) /
                            vehicles.reduce((acc, v) => acc + v.capacity, 0)) *
                          100
                        )
                      }%), the corridors are operating at <strong>High Feasibility</strong>. The estimated ROI on new luxury sprinter investments is projected at <strong>18.4% annually</strong> under current market parameters.
                    </p>

                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono pt-4 border-t border-slate-800 text-slate-500">
                      <div>
                        <span className="block text-slate-600 font-bold uppercase text-[9px]">Calculated ROI</span>
                        <span className="text-white font-bold text-sm">18.4%</span>
                      </div>
                      <div>
                        <span className="block text-slate-600 font-bold uppercase text-[9px]">Surcharge Efficiency</span>
                        <span className="text-white font-bold text-sm">{(feeSurcharge / 45 * 100).toFixed(0)}%</span>
                      </div>
                      <div>
                        <span className="block text-slate-600 font-bold uppercase text-[9px]">Fleet Risk Level</span>
                        <span className="text-emerald-400 font-bold text-sm">OPTIMAL</span>
                      </div>
                      <div>
                        <span className="block text-slate-600 font-bold uppercase text-[9px]">Next Audit Cycle</span>
                        <span className="text-white font-bold text-sm">30 Days</span>
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>
          </main>
        </div>
      )}

      {/* NEW ITINERARY BUILDER MODAL */}
      {isNewItineraryOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-scaleIn">

            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-base">Architect New Curated Tour Route</h3>
                <p className="text-xs text-slate-500">Design a custom travel corridor, assign pricing, and seed a vehicle.</p>
              </div>
              <button
                onClick={() => setIsNewItineraryOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateItinerary} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Route Corridor Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. European Grand Tour, Pacific Northwest Cascade"
                    value={newItineraryData.name}
                    onChange={(e) => setNewItineraryData((p) => ({ ...p, name: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duration Cycle</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14 Days, 3 Days"
                    value={newItineraryData.duration}
                    onChange={(e) => setNewItineraryData((p) => ({ ...p, duration: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Base Price per Ticket ($)</label>
                  <input
                    type="number"
                    required
                    min="50"
                    max="10000"
                    value={newItineraryData.basePrice}
                    onChange={(e) => setNewItineraryData((p) => ({ ...p, basePrice: Number(e.target.value) }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-amber-500 font-mono font-bold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Target Cities (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Denver, Vail, Telluride"
                    value={newItineraryData.cities}
                    onChange={(e) => setNewItineraryData((p) => ({ ...p, cities: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-amber-500 font-semibold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Key Landmarks / Stopovers (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Red Rocks, Maroon Bells, Canyon Skywalk"
                    value={newItineraryData.stops}
                    onChange={(e) => setNewItineraryData((p) => ({ ...p, stops: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-amber-500 font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Demand Profile</label>
                  <select
                    value={newItineraryData.demand}
                    onChange={(e) => setNewItineraryData((p) => ({ ...p, demand: e.target.value as any }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none"
                  >
                    <option value="High">High Demand</option>
                    <option value="Medium">Medium Demand</option>
                    <option value="Low">Low Demand</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Dispatch Frequency</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Daily - 8:00 AM"
                    value={newItineraryData.frequency}
                    onChange={(e) => setNewItineraryData((p) => ({ ...p, frequency: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-amber-500 font-semibold"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Corridor Overview Description</label>
                  <textarea
                    rows={3}
                    placeholder="Describe the target audience, scenic points, and coach configurations..."
                    value={newItineraryData.description}
                    onChange={(e) => setNewItineraryData((p) => ({ ...p, description: e.target.value }))}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-amber-500 text-slate-700"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewItineraryOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg uppercase tracking-wider transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg uppercase tracking-wider transition-all shadow-md"
                >
                  Initialize Corridor
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* FLOATING CONCIERGE CHATBOT */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 font-sans">

        {/* Chat Drawer Popup */}
        {isChatbotOpen && (
          <div className="w-[360px] sm:w-[380px] h-[500px] bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden animate-scaleIn">

            {/* Header */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 flex items-center justify-center border border-amber-500/30">
                  <Bot className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-xs text-white">Travel-Planner-Website Concierge</h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[8px] text-slate-400 font-mono font-bold uppercase">LIVE DISPATCH AGENT</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsChatbotOpen(false)}
                className="p-1 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg transition-colors"
                id="close-chatbot-btn"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-2.5 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                >
                  {msg.role !== "user" && (
                    <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center border border-slate-700 text-[10px] text-amber-400 flex-shrink-0 font-bold">
                      AI
                    </div>
                  )}
                  <div className="space-y-1">
                    <div
                      className={`p-3 rounded-xl text-xs leading-normal font-medium shadow-sm ${msg.role === "user"
                          ? "bg-amber-600 text-white rounded-tr-none"
                          : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/50"
                        }`}
                    >
                      {msg.content}
                    </div>
                    <span className={`block text-[8px] text-slate-500 font-mono ${msg.role === "user" ? "text-right" : ""}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}

              {isChatbotTyping && (
                <div className="flex gap-2.5 max-w-[85%]">
                  <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center border border-slate-700 text-[10px] text-amber-400 flex-shrink-0 font-bold">
                    AI
                  </div>
                  <div className="bg-slate-800 text-slate-400 p-3 rounded-xl rounded-tl-none border border-slate-700/50 text-xs flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested pill queries */}
            <div className="px-3 py-2 bg-slate-950 border-t border-slate-800 overflow-x-auto whitespace-nowrap flex gap-1.5 no-scrollbar scroll-smooth">
              {[
                "Tell me about your luxury fleet",
                "What is the Rocky Mountain route?",
                "How do I book a tour ticket?",
                "What is investor surcharge?"
              ].map((pill, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => handleSendChatMessage(pill)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700/80 text-[9px] font-bold text-slate-300 rounded-full border border-slate-700 transition-all select-none flex-shrink-0 cursor-pointer"
                >
                  {pill}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2 items-center">
              <input
                type="text"
                value={currentChatMessage}
                onChange={(e) => setCurrentChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
                placeholder="Ask our operational concierge desk..."
                className="bg-slate-900 border border-slate-800 rounded-lg flex-1 py-1.5 px-3 text-xs text-white placeholder-slate-500 outline-none focus:border-amber-500 transition-all"
              />
              <button
                onClick={() => handleSendChatMessage()}
                disabled={isChatbotTyping || !currentChatMessage.trim()}
                className="w-8 h-8 rounded-lg bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:hover:bg-amber-600 cursor-pointer"
                id="send-chat-message-btn"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* Floating Bubble Trigger Button */}
        <button
          onClick={() => setIsChatbotOpen(!isChatbotOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer ${isChatbotOpen
              ? "bg-slate-850 hover:bg-slate-800 border border-slate-700 rotate-90"
              : "bg-amber-600 hover:bg-amber-500 hover:shadow-blue-500/20"
            }`}
          style={{ boxShadow: isChatbotOpen ? "0 10px 25px rgba(0,0,0,0.4)" : "0 10px 25px rgba(59,130,246,0.3)" }}
          id="chatbot-trigger-btn"
        >
          {isChatbotOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <div className="relative">
              <MessageSquare className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-amber-600 rounded-full animate-ping"></span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-amber-600 rounded-full"></span>
            </div>
          )}
        </button>

      </div>

    </div>
  );
}
