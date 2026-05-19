import { useState, useEffect, useRef } from "react";
import api from './api';

/* ─── FONTS ─── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Clash+Display:wght@400;500;600;700&family=Cabinet+Grotesk:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
  `}</style>
);

/* ─── 30 EVENTS ─── */
const EVENTS_DATA = [
  { id:1,  title:"Technovate Summit",        category:"Tech",      startDate:"2025-06-07", endDate:"2025-06-09", time:"10:00 AM", venue:"Main Auditorium",      price:299,  capacity:200,  registered:178, tags:["Hackathon","AI","3 Days"],     image:"img_technovate",     description:"The biggest college tech summit. AI workshops, hackathon, and 50+ speakers over 3 epic days.", accent:"#FF6B35" },
  { id:2,  title:"Utsav Cultural Fest",       category:"Cultural",  startDate:"2025-06-14", endDate:"2025-06-15", time:"5:00 PM",  venue:"Open Air Theatre",     price:149,  capacity:500,  registered:312, tags:["Music","Dance","2 Days"],      image:"img_cultural",       description:"Music, dance, art, and food from across India. A two-day celebration of culture and creativity.", accent:"#FF3CAC" },
  { id:3,  title:"Startup Pitch Night",       category:"Business",  startDate:"2025-06-20", endDate:"2025-06-20", time:"6:00 PM",  venue:"Seminar Hall B",       price:0,    capacity:100,  registered:67,  tags:["Startups","Pitch","Free"],     image:"img_startup",        description:"Present your startup idea to investors and industry mentors. Get funded or get feedback.", accent:"#00D4AA" },
  { id:4,  title:"Photography Workshop",      category:"Workshop",  startDate:"2025-06-25", endDate:"2025-06-25", time:"11:00 AM", venue:"Arts Block",           price:499,  capacity:40,   registered:38,  tags:["Photography","Hands-on"],      image:"img_photography",    description:"Hands-on photography and editing masterclass with professional photographers. Limited seats!", accent:"#FFBE0B" },
  { id:5,  title:"E-Sports Championship",     category:"Gaming",    startDate:"2025-06-28", endDate:"2025-06-29", time:"12:00 PM", venue:"Computer Lab Complex", price:199,  capacity:64,   registered:48,  tags:["Gaming","BGMI","2 Days"],      image:"img_esports",        description:"Compete in BGMI, Valorant, and FIFA. Cash prizes worth ₹50,000 for winners.", accent:"#8B5CF6" },
  { id:6,  title:"Career Fair 2025",          category:"Career",    startDate:"2025-07-04", endDate:"2025-07-05", time:"9:00 AM",  venue:"Campus Grounds",       price:0,    capacity:1000, registered:543, tags:["Jobs","Internships","Free"],   image:"img_career",         description:"Meet 60+ companies over 2 days. On-the-spot interviews and internship offers.", accent:"#3B82F6" },
  { id:7,  title:"Robotics Expo",             category:"Tech",      startDate:"2025-07-07", endDate:"2025-07-09", time:"10:00 AM", venue:"Engineering Block",    price:399,  capacity:150,  registered:89,  tags:["Robotics","IoT","3 Days"],     image:"img_robotics",       description:"Build, program, and battle robots. Three days of cutting-edge robotics competition.", accent:"#06B6D4" },
  { id:8,  title:"Hip-Hop Showdown",          category:"Cultural",  startDate:"2025-07-11", endDate:"2025-07-11", time:"7:00 PM",  venue:"College Amphitheatre", price:199,  capacity:300,  registered:210, tags:["Hip-Hop","Battle","Dance"],    image:"img_hiphop",         description:"The ultimate hip-hop battle event. Freestyle rap, breakdance battles, and DJ sets.", accent:"#F59E0B" },
  { id:9,  title:"Debate Championship",       category:"Academic",  startDate:"2025-07-14", endDate:"2025-07-15", time:"9:00 AM",  venue:"Conference Hall",      price:99,   capacity:80,   registered:72,  tags:["Debate","GD","2 Days"],        image:"img_debate",         description:"Two-day national-level debate championship. Win certificates and cash prizes.", accent:"#10B981" },
  { id:10, title:"Comedy Night Live",         category:"Cultural",  startDate:"2025-07-18", endDate:"2025-07-18", time:"8:00 PM",  venue:"Open Air Theatre",     price:249,  capacity:400,  registered:315, tags:["Comedy","Stand-Up"],           image:"img_comedy",         description:"A night of pure laughter with top stand-up comedians from across the country.", accent:"#F97316" },
  { id:11, title:"Data Science Bootcamp",     category:"Tech",      startDate:"2025-07-21", endDate:"2025-07-23", time:"9:00 AM",  venue:"CS Department",        price:599,  capacity:60,   registered:44,  tags:["Data","Python","3 Days"],      image:"img_datascience",    description:"Intensive 3-day bootcamp covering ML, data viz, and real-world datasets with industry mentors.", accent:"#6366F1" },
  { id:12, title:"Fashion Week Campus",       category:"Cultural",  startDate:"2025-07-25", endDate:"2025-07-26", time:"3:00 PM",  venue:"Main Stage",           price:349,  capacity:250,  registered:198, tags:["Fashion","Ramp","2 Days"],     image:"img_fashion",        description:"Campus fashion week — design, showcase, and walk the ramp. Open to all creative minds.", accent:"#EC4899" },
  { id:13, title:"Cyber Security CTF",        category:"Tech",      startDate:"2025-07-29", endDate:"2025-07-30", time:"10:00 AM", venue:"Cyber Lab",            price:299,  capacity:50,   registered:31,  tags:["CTF","Hacking","2 Days"],      image:"img_ctf",            description:"Capture the Flag competition. Crack codes, find vulnerabilities, win big prizes.", accent:"#22C55E" },
  { id:14, title:"Sanskrit & Yoga Day",       category:"Cultural",  startDate:"2025-08-01", endDate:"2025-08-01", time:"6:00 AM",  venue:"Yoga Grounds",         price:0,    capacity:200,  registered:87,  tags:["Yoga","Wellness","Free"],      image:"img_yoga",           description:"Start your morning right with sunrise yoga, meditation, and Sanskrit chanting.", accent:"#A78BFA" },
  { id:15, title:"Music Production Workshop", category:"Workshop",  startDate:"2025-08-04", endDate:"2025-08-05", time:"2:00 PM",  venue:"Music Room",           price:749,  capacity:20,   registered:15,  tags:["Music","DJ","2 Days"],         image:"img_musicprod",      description:"Learn music production, mixing, and mastering from professional DJs and producers.", accent:"#F43F5E" },
  { id:16, title:"Independence Day Fest",     category:"Cultural",  startDate:"2025-08-15", endDate:"2025-08-17", time:"9:00 AM",  venue:"Campus Grounds",       price:0,    capacity:2000, registered:1243,tags:["Patriotic","Free","3 Days"],   image:"img_independence",   description:"Three-day Independence Day celebration with performances, exhibitions, and patriotic events.", accent:"#FF6B35" },
  { id:17, title:"Entrepreneurship Summit",   category:"Business",  startDate:"2025-08-08", endDate:"2025-08-09", time:"10:00 AM", venue:"Business School",      price:499,  capacity:120,  registered:88,  tags:["Startup","VC","2 Days"],       image:"img_entrepreneur",   description:"Two days with successful founders, VCs, and business leaders sharing actionable insights.", accent:"#FBBF24" },
  { id:18, title:"Street Art Festival",       category:"Cultural",  startDate:"2025-08-11", endDate:"2025-08-12", time:"10:00 AM", venue:"Campus Walls",         price:199,  capacity:150,  registered:103, tags:["Graffiti","Art","2 Days"],     image:"img_streetart",      description:"Transform the campus into a living art gallery. Graffiti, murals, and street performances.", accent:"#34D399" },
  { id:19, title:"Chess Tournament",          category:"Academic",  startDate:"2025-08-16", endDate:"2025-08-16", time:"10:00 AM", venue:"Student Center",       price:99,   capacity:64,   registered:58,  tags:["Chess","Strategy"],            image:"img_chess",          description:"National-level chess tournament. All skill levels welcome. Prizes for top 3.", accent:"#94A3B8" },
  { id:20, title:"Blockchain Hackathon",      category:"Tech",      startDate:"2025-08-18", endDate:"2025-08-19", time:"8:00 AM",  venue:"Innovation Lab",       price:0,    capacity:80,   registered:62,  tags:["Blockchain","Web3","Free"],    image:"img_blockchain",     description:"Build the future of Web3. 36-hour hackathon with mentors from top crypto companies.", accent:"#F59E0B" },
  { id:21, title:"Food Festival",             category:"Cultural",  startDate:"2025-06-29", endDate:"2025-06-29", time:"11:00 AM", venue:"Campus Canteen Area",  price:149,  capacity:600,  registered:421, tags:["Food","Stalls","Fest"],        image:"img_food",           description:"30+ food stalls, live cooking demos, eating challenges, and the ultimate food war.", accent:"#FB7185" },
  { id:22, title:"Stand-Up Comedy Open Mic",  category:"Cultural",  startDate:"2025-07-06", endDate:"2025-07-06", time:"7:30 PM",  venue:"Seminar Hall A",       price:149,  capacity:200,  registered:134, tags:["Comedy","Open Mic"],           image:"img_openmic",        description:"Open mic night for aspiring comedians. Anyone can perform. Audience votes the winner.", accent:"#FDBA74" },
  { id:23, title:"App Dev Marathon",          category:"Tech",      startDate:"2025-07-26", endDate:"2025-07-27", time:"9:00 AM",  venue:"CS Department",        price:199,  capacity:100,  registered:75,  tags:["Flutter","React","24hr"],      image:"img_appdev",         description:"24-hour app development marathon. Build a working app from scratch. Prizes worth ₹1 Lakh.", accent:"#818CF8" },
  { id:24, title:"Classical Dance Recital",   category:"Cultural",  startDate:"2025-07-31", endDate:"2025-07-31", time:"6:00 PM",  venue:"Auditorium",           price:199,  capacity:300,  registered:187, tags:["Bharatnatyam","Kathak"],       image:"img_classicaldance", description:"An evening of classical Indian dance forms — Bharatnatyam, Kathak, and Odissi performances.", accent:"#E879F9" },
  { id:25, title:"Astronomy Night",           category:"Academic",  startDate:"2025-08-05", endDate:"2025-08-05", time:"8:00 PM",  venue:"Terrace Garden",       price:99,   capacity:80,   registered:76,  tags:["Stargazing","Science"],        image:"img_astronomy",      description:"Telescope stargazing, astrophotography tips, and a live talk by an ISRO scientist.", accent:"#38BDF8" },
  { id:26, title:"Green Campus Drive",        category:"Academic",  startDate:"2025-08-07", endDate:"2025-08-07", time:"7:00 AM",  venue:"Campus Grounds",       price:0,    capacity:500,  registered:212, tags:["Eco","Plantation","Free"],     image:"img_green",          description:"Mass tree plantation drive + sustainable living workshops. Make the campus greener.", accent:"#4ADE80" },
  { id:27, title:"Quiz Bowl Championship",    category:"Academic",  startDate:"2025-08-20", endDate:"2025-08-21", time:"10:00 AM", venue:"Conference Hall",      price:149,  capacity:120,  registered:93,  tags:["Quiz","GK","2 Days"],          image:"img_quiz",           description:"Two-day quiz extravaganza. General knowledge, tech, pop culture, and more categories.", accent:"#60A5FA" },
  { id:28, title:"Spoken Word Poetry",        category:"Cultural",  startDate:"2025-08-22", endDate:"2025-08-22", time:"6:30 PM",  venue:"Library Hall",         price:99,   capacity:150,  registered:89,  tags:["Poetry","Spoken Word"],        image:"img_poetry",         description:"Express through verse. Spoken word, slam poetry, and original composition contest.", accent:"#C084FC" },
  { id:29, title:"Sports Fest — Velocity",    category:"Sports",    startDate:"2025-08-23", endDate:"2025-08-25", time:"8:00 AM",  venue:"Sports Complex",       price:299,  capacity:800,  registered:543, tags:["Cricket","Football","3 Days"], image:"img_sports",         description:"3-day multi-sport festival. Cricket, football, basketball, athletics, and more.", accent:"#34D399" },
  { id:30, title:"Farewell Gala Night",       category:"Cultural",  startDate:"2025-08-28", endDate:"2025-08-28", time:"7:00 PM",  venue:"Grand Hall",           price:599,  capacity:400,  registered:289, tags:["Formal","Party","Gala"],       image:"img_farewell",       description:"The most glamorous night of the year. Red carpet, live band, and unforgettable memories.", accent:"#F0ABFC" },
];

/* ─── IMAGE REGISTRY ─── Replace Unsplash URLs with your own images if desired ─── */
const IMAGES = {
  img_technovate:    "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
  img_cultural:      "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
  img_startup:       "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
  img_photography:   "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&q=80",
  img_esports:       "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80",
  img_career:        "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&q=80",
  img_robotics:      "https://images.unsplash.com/photo-1563207153-f403bf289096?w=800&q=80",
  img_hiphop:        "https://images.unsplash.com/photo-1547153760-18fc86324498?w=800&q=80",
  img_debate:        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80",
  img_comedy:        "https://images.unsplash.com/photo-1527224538127-2104bb71c51b?w=800&q=80",
  img_datascience:   "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  img_fashion:       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  img_ctf:           "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80",
  img_yoga:          "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80",
  img_musicprod:     "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
  img_independence:  "https://images.unsplash.com/photo-1596421338095-e1c9e3484e5e?w=800&q=80",
  img_entrepreneur:  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  img_streetart:     "https://images.unsplash.com/photo-1569880153113-76175b8e6d18?w=800&q=80",
  img_chess:         "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&q=80",
  img_blockchain:    "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&q=80",
  img_food:          "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&q=80",
  img_openmic:       "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80",
  img_appdev:        "https://images.unsplash.com/photo-1607706189992-eae578626c86?w=800&q=80",
  img_classicaldance:"https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800&q=80",
  img_astronomy:     "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=800&q=80",
  img_green:         "https://images.unsplash.com/photo-1542601906897-d5d5b516aca2?w=800&q=80",
  img_quiz:          "https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80",
  img_poetry:        "https://images.unsplash.com/photo-1474487548417-781cb6d646b3?w=800&q=80",
  img_sports:        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
  img_farewell:      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
};

const CATEGORIES = ["All","Tech","Cultural","Business","Workshop","Gaming","Career","Academic","Sports"];
const TODAY = new Date("2025-06-07");

function getStatus(e) {
  const start = new Date(e.startDate), end = new Date(e.endDate);
  if (TODAY >= start && TODAY <= end) return "ongoing";
  if (start > TODAY) return "upcoming";
  return "past";
}
function getDuration(e) {
  return Math.round((new Date(e.endDate) - new Date(e.startDate)) / 86400000) + 1;
}
function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-IN", { day:"numeric", month:"short" });
}
function fmtDateLong(d) {
  return new Date(d).toLocaleDateString("en-IN", { weekday:"short", day:"numeric", month:"long", year:"numeric" });
}
function getCountdown(dateStr) {
  const diff = new Date(dateStr) - TODAY;
  if (diff <= 0) return null;
  return { days: Math.floor(diff/86400000), hrs: Math.floor((diff%86400000)/3600000) };
}
function slotsPct(e) { return Math.round((e.registered/e.capacity)*100); }

/* ─── GLOBAL CSS ─── */
const GlobalStyle = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #050508; overflow-x: hidden; }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #050508; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(#FF6B35, #FF3CAC); border-radius: 3px; }

    @keyframes fadeUp    { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
    @keyframes float     { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-22px) rotate(4deg); } }
    @keyframes floatR    { 0%,100% { transform:translateY(0) rotate(0deg); } 50% { transform:translateY(-15px) rotate(-3deg); } }
    @keyframes pulse     { 0%,100% { opacity:0.5; transform:scale(1); } 50% { opacity:1; transform:scale(1.15); } }
    @keyframes gradShift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }
    @keyframes glow      { 0%,100%{box-shadow:0 0 24px rgba(255,107,53,0.4)} 50%{box-shadow:0 0 50px rgba(255,60,172,0.6)} }
    @keyframes orbPulse  { 0%,100%{transform:scale(1);opacity:0.12} 50%{transform:scale(1.15);opacity:0.2} }
    @keyframes borderFlow{ 0%{background-position:0% 50%}100%{background-position:200% 50%} }
    @keyframes scanline  { 0%{top:-20%} 100%{top:120%} }
    @keyframes textShimmer { 0%{background-position:-200%} 100%{background-position:200%} }
    @keyframes spin      { to { transform: rotate(360deg); } }
    @keyframes slideInRight { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes bounce    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }

    .card-hover { transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s ease; }
    .card-hover:hover { transform: translateY(-8px) scale(1.01); box-shadow: 0 32px 80px rgba(0,0,0,0.6) !important; }
    .btn-press { transition: all 0.18s cubic-bezier(.34,1.56,.64,1); cursor: pointer; }
    .btn-press:hover { transform: scale(1.06); filter: brightness(1.15); }
    .btn-press:active { transform: scale(0.97); }
    input, select, textarea { outline: none; }
    input::placeholder { color: #444; }
    select option { background: #111; color: #fff; }

    .nav-link { transition: all 0.2s; position: relative; }
    .nav-link::after { content:''; position:absolute; bottom:-2px; left:50%; right:50%; height:2px; background:linear-gradient(90deg,#FF6B35,#FF3CAC); border-radius:2px; transition: all 0.3s; }
    .nav-link.active::after { left:0; right:0; }

    .ticket-card { transition: all 0.3s ease; }
    .ticket-card:hover { transform: translateY(-4px) rotate(0.5deg); }

    .shimmer { background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.08) 50%, transparent 75%); background-size: 200% 100%; animation: textShimmer 2s infinite; }

    /* Noise overlay */
    .noise::before { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events:none; z-index:1; opacity:0.4; }
  `}</style>
);

/* ─────────────────────────────────────────────────────────
   APP ROOT
───────────────────────────────────────────────────────── */
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("landing");
  const [authMode, setAuthMode] = useState("login");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [myTickets, setMyTickets] = useState([]);
  const [ticketModal, setTicketModal] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = (role, name, email, isSignup = false) => {
    setUser({ role, name, email });
    setPage(role === "admin" ? "admin" : "events");
    showToast(isSignup ? `Welcome, ${name}! 🎉` : `Welcome back, ${name}! 🎉`);
  };
  const handleLogout = () => {
    setUser(null);
    setPage("landing");
    showToast("See you next time! 👋", "info");
  };
 const handleRegister = (event, ticket) => {
  const tkt = ticket
    ? { id: ticket.ticketId, event, qrValue: ticket.qrCode, registeredAt: new Date().toLocaleString() }
    : { id: `EVH-${Date.now().toString(36).toUpperCase()}`, event, registeredAt: new Date().toLocaleString(), qrValue: `EVENTHIVE:${event.id}` };
  setMyTickets(p => [...p, tkt]);
  setTicketModal(tkt);
  showToast(`Registered for ${event.title}! 🎟️`);
};

  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", background:"#050508", minHeight:"100vh", color:"#fff" }}>
      <FontLink />
      <GlobalStyle />

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", top:20, right:20, zIndex:9999,
          background: toast.type==="success" ? "linear-gradient(135deg,#FF6B35,#FF3CAC)" : "rgba(59,130,246,0.9)",
          color:"#fff", padding:"14px 22px", borderRadius:16, fontSize:14, fontWeight:600,
          boxShadow:"0 20px 60px rgba(0,0,0,0.5)", backdropFilter:"blur(10px)",
          animation:"slideInRight 0.3s ease", maxWidth:320,
          border:"1px solid rgba(255,255,255,0.15)"
        }}>
          {toast.msg}
        </div>
      )}

      {page === "landing" && !user && (
        <LandingPage
          onLogin={() => { setAuthMode("login"); setPage("auth"); }}
          onSignup={() => { setAuthMode("signup"); setPage("auth"); }}
        />
      )}

      {page === "auth" && (
        <AuthPage mode={authMode} setMode={setAuthMode} onLogin={handleLogin} onBack={() => setPage("landing")} />
      )}

      {user && page !== "auth" && (
        <>
          <Navbar user={user} page={page} setPage={setPage} onLogout={handleLogout} myTickets={myTickets} />
          <div style={{ paddingTop:72 }}>
            {page === "events" && (
              <EventsPage events={EVENTS_DATA} onSelect={e => { setSelectedEvent(e); setPage("detail"); }} />
            )}
            {page === "detail" && selectedEvent && (
              <EventDetail event={selectedEvent} onBack={() => setPage("events")} onRegister={handleRegister} myTickets={myTickets} user={user} />
            )}
            {page === "tickets" && user.role === "user" && (
              <MyTickets tickets={myTickets} setPage={setPage} onOpen={setTicketModal} />
            )}
            {page === "admin" && user.role === "admin" && (
              <AdminDashboard events={EVENTS_DATA} tickets={myTickets} />
            )}
          </div>
        </>
      )}

      {ticketModal && <TicketModal ticket={ticketModal} onClose={() => setTicketModal(null)} />}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   LANDING PAGE — Spectacular
───────────────────────────────────────────────────────── */
function LandingPage({ onLogin, onSignup }) {
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouse = e => setMousePos({ x: (e.clientX/window.innerWidth)*100, y: (e.clientY/window.innerHeight)*100 });
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("scroll", handleScroll);
    return () => { window.removeEventListener("mousemove", handleMouse); window.removeEventListener("scroll", handleScroll); };
  }, []);

  const featuredEvents = EVENTS_DATA.filter(e => getStatus(e) !== "past").slice(0, 6);

  return (
    <div style={{ minHeight:"100vh", position:"relative", overflowX:"hidden", background:"#050508" }}>
      {/* Dynamic cursor-following background */}
      <div style={{
        position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        background:`radial-gradient(ellipse 70% 60% at ${mousePos.x}% ${mousePos.y}%, rgba(255,107,53,0.12) 0%, transparent 60%),
                    radial-gradient(ellipse at 85% 10%, rgba(139,92,246,0.15) 0%, transparent 40%),
                    radial-gradient(ellipse at 5% 90%, rgba(255,60,172,0.1) 0%, transparent 40%),
                    #050508`,
        transition:"background 0.3s ease"
      }} />

      {/* Grid pattern */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:"linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
        backgroundSize:"60px 60px" }} />

      {/* Floating orbs */}
      {[
        ["#FF6B35", "8%",  "15%", "280px", 5],
        ["#FF3CAC", "78%", "8%",  "200px", 6],
        ["#8B5CF6", "5%",  "65%", "240px", 7],
        ["#00D4AA", "82%", "60%", "180px", 4],
        ["#FBBF24", "45%", "80%", "150px", 8],
      ].map(([c,l,t,s,dur],i)=>(
        <div key={i} style={{ position:"fixed", left:l, top:t, width:s, height:s, borderRadius:"50%", background:c, opacity:0.1, filter:"blur(80px)", animation:`orbPulse ${dur}s ease-in-out infinite`, animationDelay:`${i*1.2}s`, zIndex:0, pointerEvents:"none" }} />
      ))}

      {/* NAVBAR */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 48px", height:72, display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(5,5,8,0.7)", backdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontFamily:"'Syne', sans-serif", fontSize:26, fontWeight:800,
          background:"linear-gradient(90deg,#FF6B35,#FF3CAC,#8B5CF6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          ⬡ EventHive
        </div>
        <div style={{ display:"flex", gap:12 }}>
          <button className="btn-press" onClick={onLogin} style={{ background:"transparent", border:"1px solid rgba(255,255,255,0.15)", color:"#fff", padding:"10px 26px", borderRadius:50, fontSize:14, fontWeight:600 }}>Login</button>
          <button className="btn-press" onClick={onSignup} style={{ background:"linear-gradient(135deg,#FF6B35,#FF3CAC)", border:"none", color:"#fff", padding:"10px 26px", borderRadius:50, fontSize:14, fontWeight:700, boxShadow:"0 8px 24px rgba(255,107,53,0.35)" }}>Sign Up Free</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position:"relative", zIndex:5, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"100px 24px 60px" }}>

        {/* Badge */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(255,107,53,0.12)", border:"1px solid rgba(255,107,53,0.35)", borderRadius:50, padding:"8px 20px", fontSize:13, color:"#FF9A6C", marginBottom:32, fontWeight:600, animation:"fadeUp 0.6s ease both" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:"#FF6B35", display:"inline-block", animation:"pulse 1.5s infinite" }} />
          🎓 India's #1 College Event Platform
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontFamily:"'Syne', sans-serif", fontSize:"clamp(34px,5.5vw,68px)", fontWeight:800, lineHeight:0.95, letterSpacing:"-3px", marginBottom:28,
          backgroundImage:"linear-gradient(135deg, #fff 0%, #FF6B35 30%, #FF3CAC 60%, #8B5CF6 85%, #00D4AA 100%)",
          backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          backgroundSize:"300% 300%", animation:"gradShift 5s ease infinite, fadeUp 0.7s ease both"
        }}>
          Where Campus<br />
          <span style={{ WebkitTextFillColor:"transparent" }}>Comes</span>{" "}
          <em style={{ fontStyle:"italic" }}>Alive.</em>
        </h1>

        <p style={{ fontSize:"clamp(14px,1.5vw,16px)", color:"#6B7280", maxWidth:580, margin:"0 auto 44px", lineHeight:1.75, animation:"fadeUp 0.8s ease 0.1s both" }}>
          Register for events, get instant QR tickets, and track attendance — all on one blazing-fast platform built for college life.
        </p>

        {/* CTA Buttons */}
        <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", marginBottom:72, animation:"fadeUp 0.8s ease 0.2s both" }}>
          <button className="btn-press" onClick={onSignup} style={{
            background:"linear-gradient(135deg,#FF6B35,#FF3CAC)", border:"none", color:"#fff",
            padding:"18px 44px", borderRadius:50, fontSize:16, fontWeight:800,
            boxShadow:"0 16px 40px rgba(255,107,53,0.4)", animation:"glow 2.5s ease-in-out infinite"
          }}>
            Explore Events →
          </button>
          <button className="btn-press" onClick={onLogin} style={{
            background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.15)", color:"#fff",
            padding:"18px 44px", borderRadius:50, fontSize:16, fontWeight:600,
            backdropFilter:"blur(10px)"
          }}>
            Login to Continue
          </button>
        </div>

        {/* Stats Row */}
        <div style={{ display:"flex", justifyContent:"center", gap:"clamp(24px,6vw,100px)", flexWrap:"wrap", marginBottom:80, animation:"fadeUp 0.9s ease 0.3s both" }}>
          {[["30+","Live Events","🎪"],["5,000+","Students","👥"],["₹0","No Hidden Fees","✅"],["100%","QR Verified","🎟️"]].map(([v,l,icon])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(22px,3vw,38px)", fontWeight:800,
                backgroundImage:"linear-gradient(135deg,#FF6B35,#FF3CAC)", backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{v}</div>
              <div style={{ fontSize:13, color:"#4B5563", marginTop:4 }}>{icon} {l}</div>
            </div>
          ))}
        </div>

        {/* ── FEATURED EVENTS MARQUEE ── */}
        <div style={{ width:"100%", overflow:"hidden", marginBottom:80 }}>
          <p style={{ fontSize:13, color:"#4B5563", fontWeight:600, letterSpacing:2, textTransform:"uppercase", marginBottom:20, animation:"fadeUp 1s ease 0.4s both" }}>Featured Events This Season</p>
          <div style={{ display:"flex", gap:20, animation:"fadeUp 1s ease 0.5s both", justifyContent:"center", flexWrap:"wrap", padding:"0 20px" }}>
            {featuredEvents.map((e,i)=>(
              <div key={e.id} className="card-hover" onClick={onSignup} style={{
                background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:24, overflow:"hidden", width:240, flexShrink:0, cursor:"pointer",
                backdropFilter:"blur(16px)", animation:`fadeUp 0.6s ease ${0.1+i*0.08}s both`
              }}>
                <div style={{ height:140, overflow:"hidden", position:"relative" }}>
                  <img src={IMAGES[e.image]} alt={e.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }} />
                  <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg, ${e.accent}33, rgba(0,0,0,0.7))` }} />
                  {getStatus(e) === "ongoing" && (
                    <div style={{ position:"absolute", top:10, left:10, background:"#EF4444", color:"#fff", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:20, display:"flex", alignItems:"center", gap:4 }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:"#fff", animation:"pulse 1s infinite", display:"inline-block" }} />LIVE
                    </div>
                  )}
                  <div style={{ position:"absolute", top:10, right:10, background:"rgba(0,0,0,0.7)", color:e.price===0?"#34D399":"#FBBF24", fontSize:12, fontWeight:800, padding:"3px 9px", borderRadius:8 }}>
                    {e.price===0?"FREE":`₹${e.price}`}
                  </div>
                  <div style={{ position:"absolute", bottom:10, left:10, background:e.accent, color:"#fff", fontSize:10, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{e.category}</div>
                </div>
                <div style={{ padding:"14px 16px" }}>
                  <div style={{ fontWeight:700, fontSize:14, color:"#fff", marginBottom:4, lineHeight:1.3 }}>{e.title}</div>
                  <div style={{ fontSize:12, color:"#6B7280" }}>📅 {fmtDate(e.startDate)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FEATURES STRIP ── */}
        <div style={{ width:"100%", maxWidth:1100, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))", gap:16, animation:"fadeUp 1s ease 0.6s both", padding:"0 20px" }}>
          {[
            { icon:"🎟️", title:"Instant QR Tickets", desc:"Register and get a unique QR ticket in seconds.", color:"#FF6B35" },
            { icon:"📊", title:"Live Seat Tracker", desc:"Real-time capacity bars so you never miss out.", color:"#FF3CAC" },
            { icon:"💳", title:"Razorpay Payments", desc:"Secure test-mode payments, UPI, cards, wallets.", color:"#8B5CF6" },
            { icon:"📱", title:"Mobile First", desc:"Designed to work beautifully on every screen.", color:"#00D4AA" },
          ].map((f,i)=>(
            <div key={f.title} style={{
              background:`linear-gradient(135deg, ${f.color}12, rgba(255,255,255,0.02))`,
              border:`1px solid ${f.color}25`,
              borderRadius:20, padding:"24px 20px", textAlign:"left",
              backdropFilter:"blur(10px)", animation:`fadeUp 0.5s ease ${0.1+i*0.08}s both`
            }}>
              <div style={{ fontSize:32, marginBottom:12 }}>{f.icon}</div>
              <div style={{ fontWeight:700, fontSize:15, color:"#fff", marginBottom:8 }}>{f.title}</div>
              <div style={{ fontSize:13, color:"#6B7280", lineHeight:1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA band */}
        <div style={{ width:"100%", marginTop:80, padding:"48px 24px",
          background:"linear-gradient(135deg, rgba(255,107,53,0.1), rgba(255,60,172,0.1), rgba(139,92,246,0.1))",
          borderTop:"1px solid rgba(255,255,255,0.06)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(22px,3vw,36px)", fontWeight:800, marginBottom:12,
            backgroundImage:"linear-gradient(90deg,#FF6B35,#FF3CAC)", backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Ready to join the fun?
          </h2>
          <p style={{ color:"#6B7280", marginBottom:28, fontSize:16 }}>30+ events this summer. Tech, culture, sports, music, and more.</p>
          <button className="btn-press" onClick={onSignup} style={{
            background:"linear-gradient(135deg,#FF6B35,#FF3CAC)", border:"none", color:"#fff",
            padding:"16px 44px", borderRadius:50, fontSize:16, fontWeight:800,
            boxShadow:"0 12px 32px rgba(255,107,53,0.4)"
          }}>Get Started Free →</button>
        </div>

        {/* Footer */}
        <div style={{ marginTop:40, fontSize:13, color:"#2D2D35" }}>
          ⬡ EventHive © 2025 · Built with React + Firebase + Razorpay
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   AUTH PAGE — Immersive Split Screen
───────────────────────────────────────────────────────── */
function AuthPage({ mode, setMode, onLogin, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN = { email:"admin@eventhive.com", password:"admin123" };
  const accent = mode === "signup" ? "#FF3CAC" : "#FF6B35";

  const handleSubmit = () => {
    if (!email || !password) { setErr("Please fill all fields."); return; }
    if (mode === "signup" && !name) { setErr("Enter your name."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === "admin") {
        if (email === ADMIN.email && password === ADMIN.password) onLogin("admin","Admin","admin@eventhive.com", false);
        else { setErr("Invalid admin credentials."); }
      } else {
        onLogin("user", mode==="signup" ? name : email.split("@")[0], email, mode==="signup");
      }
    }, 900);
  };

  const inputSt = {
    background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)",
    color:"#fff", padding:"14px 18px", borderRadius:14, fontSize:14, width:"100%",
    transition:"all 0.2s", fontFamily:"inherit"
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:"#050508", position:"relative", overflow:"hidden" }}>
      {/* BG */}
      <div style={{ position:"fixed", inset:0,
        background:`radial-gradient(ellipse at 25% 40%, ${accent}20, transparent 55%),
                    radial-gradient(ellipse at 80% 20%, #8B5CF620, transparent 45%),
                    radial-gradient(ellipse at 60% 85%, #00D4AA15, transparent 40%),
                    #050508` }} />
      <div style={{ position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)", backgroundSize:"48px 48px", pointerEvents:"none" }} />

      {/* Floating orbs */}
      {[[accent,"10%","20%","200px"],["#8B5CF6","80%","70%","160px"],["#00D4AA","70%","10%","120px"]].map(([c,l,t,s],i)=>(
        <div key={i} style={{ position:"fixed", left:l, top:t, width:s, height:s, borderRadius:"50%", background:c, opacity:0.1, filter:"blur(70px)", animation:`orbPulse ${5+i}s ease-in-out infinite`, animationDelay:`${i}s`, zIndex:0 }} />
      ))}

      {/* ── LEFT PANEL ── */}
      <div style={{ flex:"0 0 auto", width:"min(520px,100%)", padding:"48px 52px", position:"relative", zIndex:5, display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <button onClick={onBack} className="btn-press" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#6B7280", padding:"8px 18px", borderRadius:50, fontSize:13, marginBottom:48, alignSelf:"flex-start" }}>
          ← Back
        </button>

        <div style={{ fontFamily:"'Syne', sans-serif", fontSize:22, fontWeight:800,
          backgroundImage:`linear-gradient(90deg,${accent},#8B5CF6)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", marginBottom:10 }}>
          ⬡ EventHive
        </div>
        <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(20px,3vw,34px)", fontWeight:800, marginBottom:8, color:"#fff", lineHeight:1.1 }}>
          {mode==="login" ? "Welcome back 👋" : "Join the party 🎉"}
        </h2>
        <p style={{ color:"#4B5563", marginBottom:36, fontSize:15 }}>
          {mode==="login" ? "Login to access your tickets and events." : "Create your free account in seconds."}
        </p>

        {/* Role Toggle */}
        <div style={{ display:"flex", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:14, padding:4, marginBottom:24, gap:4 }}>
          {[["user","🙋 Student"],["admin","👑 Admin"]].map(([r,l])=>(
            <button key={r} onClick={()=>{ setRole(r); setErr(""); }} className="btn-press" style={{
              flex:1, padding:"11px", borderRadius:11, border:"none", fontSize:14, fontWeight:700,
              background: role===r ? `linear-gradient(135deg,${accent},#8B5CF6)` : "transparent",
              color: role===r ? "#fff" : "#4B5563", transition:"all 0.25s"
            }}>{l}</button>
          ))}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
          {mode==="signup" && role==="user" && (
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={inputSt}
              onFocus={e=>e.target.style.borderColor=accent} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
          )}
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder={role==="admin"?"admin@eventhive.com":"College email"} type="email" style={inputSt}
            onFocus={e=>e.target.style.borderColor=accent} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={inputSt}
            onFocus={e=>e.target.style.borderColor=accent} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />

          {role==="admin" && (
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:10, padding:"10px 14px", fontSize:12, color:"#6B7280", fontFamily:"'JetBrains Mono', monospace" }}>
              Demo → admin@eventhive.com / admin123
            </div>
          )}

          {err && (
            <div style={{ background:"rgba(239,68,68,0.1)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:10, padding:"10px 14px", color:"#EF4444", fontSize:13 }}>
              ⚠ {err}
            </div>
          )}

          <button className="btn-press" onClick={handleSubmit} disabled={loading} style={{
            background:`linear-gradient(135deg,${accent},#8B5CF6)`, border:"none", color:"#fff",
            padding:"15px", borderRadius:14, fontSize:15, fontWeight:800, marginTop:4,
            boxShadow:`0 12px 32px ${accent}40`, opacity:loading?0.7:1, display:"flex", alignItems:"center", justifyContent:"center", gap:8
          }}>
            {loading ? (
              <>
                <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} />
                Signing in...
              </>
            ) : role==="admin" ? "Admin Login →" : mode==="login" ? "Login →" : "Create Account →"}
          </button>
        </div>

        {role !== "admin" && (
        <p style={{ textAlign:"center", marginTop:24, color:"#4B5563", fontSize:14 }}>
          {mode==="login" ? "No account? " : "Already a member? "}
          <span style={{ color:accent, cursor:"pointer", fontWeight:700 }} onClick={()=>{ setMode(mode==="login"?"signup":"login"); setErr(""); }}>
            {mode==="login" ? "Sign up free" : "Login"}
          </span>
        </p>
        )}
      </div>

      {/* ── RIGHT PANEL — Visual showcase ── */}
      <div style={{ flex:1, position:"relative", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", borderLeft:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, ${accent}10, #8B5CF610, #00D4AA08)` }} />

        {/* Decorative event cards stack */}
        <div style={{ position:"relative", zIndex:2, padding:48, width:"100%", maxWidth:420 }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ fontSize:48, marginBottom:12, animation:`float 4s ease-in-out infinite` }}>{mode==="login"?"🎟️":"🎉"}</div>
            <h3 style={{ fontFamily:"'Syne', sans-serif", fontSize:24, fontWeight:800, color:"#fff", marginBottom:8 }}>
              {mode==="login" ? "Your Events Await" : "Join 5,000+ Students"}
            </h3>
            <p style={{ color:"#4B5563", fontSize:14, lineHeight:1.7 }}>
              Tech fests, cultural nights, sports days, and workshops — all on one platform.
            </p>
          </div>

          {/* Stacked mini cards */}
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {EVENTS_DATA.slice(0,5).map((e,i)=>(
              <div key={e.id} style={{
                background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)",
                borderRadius:16, padding:"14px 16px", display:"flex", alignItems:"center", gap:14,
                animation:`fadeUp 0.5s ease ${0.1+i*0.08}s both`,
                backdropFilter:"blur(8px)"
              }}>
                <img src={IMAGES[e.image]} alt={e.title} style={{ width:44, height:44, borderRadius:10, objectFit:"cover" }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color:"#fff", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.title}</div>
                  <div style={{ fontSize:12, color:"#6B7280", marginTop:2 }}>📅 {fmtDate(e.startDate)}</div>
                </div>
                <div style={{ background:`${e.accent}22`, color:e.accent, fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20, whiteSpace:"nowrap" }}>
                  {e.price===0?"FREE":`₹${e.price}`}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:20, display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
            {["🎨 Cultural","⚡ Tech","🏆 Sports","🎵 Music","💼 Career"].map(f=>(
              <span key={f} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:50, padding:"6px 14px", fontSize:12, color:"#9CA3AF" }}>{f}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   NAVBAR
───────────────────────────────────────────────────────── */
function Navbar({ user, page, setPage, onLogout, myTickets }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const navItems = [
    { label:"Events", key:"events", icon:"🎪" },
    ...(user.role==="user" ? [{ label:`Tickets${myTickets.length?` (${myTickets.length})`:""}`, key:"tickets", icon:"🎟️" }] : []),
    ...(user.role==="admin" ? [{ label:"Dashboard", key:"admin", icon:"📊" }] : []),
  ];

  return (
    <div style={{
      position:"fixed", top:0, left:0, right:0, zIndex:200, height:72,
      background: scrolled ? "rgba(5,5,8,0.92)" : "rgba(5,5,8,0.75)",
      backdropFilter:"blur(24px)",
      borderBottom:`1px solid ${scrolled?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.03)"}`,
      display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 36px",
      transition:"all 0.3s"
    }}>
      <div style={{ fontFamily:"'Syne', sans-serif", fontSize:22, fontWeight:800, cursor:"pointer",
        backgroundImage:"linear-gradient(90deg,#FF6B35,#FF3CAC)", backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}
        onClick={()=>setPage("events")}>
        ⬡ EventHive
      </div>

      <div style={{ display:"flex", gap:4 }}>
        {navItems.map(item=>(
          <button key={item.key} onClick={()=>setPage(item.key)} className="btn-press" style={{
            background: page===item.key ? "rgba(255,107,53,0.12)" : "transparent",
            border: page===item.key ? "1px solid rgba(255,107,53,0.3)" : "1px solid transparent",
            color: page===item.key ? "#FF6B35" : "#6B7280",
            padding:"8px 18px", borderRadius:50, fontSize:14, fontWeight:600, transition:"all 0.2s"
          }}>
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:14 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:34, height:34, borderRadius:"50%", background:"linear-gradient(135deg,#FF6B35,#FF3CAC)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:800, color:"#fff" }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:"#fff" }}>{user.name}</div>
            <div style={{ fontSize:11, color: user.role==="admin" ? "#FBBF24" : "#4B5563" }}>
              {user.role==="admin" ? "👑 Admin" : "🎓 Student"}
            </div>
          </div>
        </div>
        <button onClick={onLogout} className="btn-press" style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#4B5563", padding:"8px 16px", borderRadius:10, fontSize:13 }}>Logout</button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   EVENTS PAGE
───────────────────────────────────────────────────────── */
function EventsPage({ events, onSelect }) {
  const [cat, setCat] = useState("All");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState("date-asc");

  let filtered = events.filter(e => {
    if (getStatus(e) === "past") return false;
    if (statusFilter === "ongoing" && getStatus(e) !== "ongoing") return false;
    if (statusFilter === "upcoming" && getStatus(e) !== "upcoming") return false;
    if (cat !== "All" && e.category !== cat) return false;
    const q = search.toLowerCase();
    return !q || e.title.toLowerCase().includes(q) || e.tags.some(t=>t.toLowerCase().includes(q)) || e.category.toLowerCase().includes(q);
  });

  filtered = [...filtered].sort((a,b)=>{
    if (sort==="date-asc") return new Date(a.startDate)-new Date(b.startDate);
    if (sort==="date-desc") return new Date(b.startDate)-new Date(a.startDate);
    if (sort==="price-asc") return a.price-b.price;
    if (sort==="price-desc") return b.price-a.price;
    if (sort==="name") return a.title.localeCompare(b.title);
    return 0;
  });

  const ongoingCount = events.filter(e=>getStatus(e)==="ongoing").length;
  const upcomingCount = events.filter(e=>getStatus(e)==="upcoming").length;

  return (
    <div style={{ maxWidth:1320, margin:"0 auto", padding:"36px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom:32, animation:"fadeUp 0.5s ease" }}>
        <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(24px,4vw,40px)", fontWeight:800, color:"#fff", marginBottom:8 }}>
          Discover Events{" "}
          <span style={{ backgroundImage:"linear-gradient(90deg,#FF6B35,#FF3CAC)", backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>🔥</span>
        </h1>
        <div style={{ display:"flex", gap:16, alignItems:"center", flexWrap:"wrap" }}>
          <p style={{ color:"#4B5563", fontSize:16 }}>June · July · August 2025</p>
          <div style={{ display:"flex", gap:8 }}>
            <span style={{ background:"rgba(239,68,68,0.15)", border:"1px solid rgba(239,68,68,0.3)", color:"#EF4444", fontSize:12, fontWeight:600, padding:"4px 12px", borderRadius:50, display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#EF4444", animation:"pulse 1s infinite", display:"inline-block" }} />
              {ongoingCount} Live
            </span>
            <span style={{ background:"rgba(16,185,129,0.12)", border:"1px solid rgba(16,185,129,0.25)", color:"#10B981", fontSize:12, fontWeight:600, padding:"4px 12px", borderRadius:50 }}>
              ⏰ {upcomingCount} Upcoming
            </span>
          </div>
        </div>
      </div>

      {/* Status Pills */}
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        {[["all","All Events","#6B7280"],["ongoing","🔴 Live Now","#EF4444"],["upcoming","⏰ Upcoming","#10B981"]].map(([v,l,c])=>(
          <button key={v} onClick={()=>setStatusFilter(v)} className="btn-press" style={{
            background: statusFilter===v ? `${c}20` : "rgba(255,255,255,0.04)",
            border:`1px solid ${statusFilter===v?c:"rgba(255,255,255,0.08)"}`,
            color: statusFilter===v ? c : "#4B5563",
            padding:"9px 20px", borderRadius:50, fontSize:14, fontWeight:600, transition:"all 0.2s"
          }}>{l}</button>
        ))}
      </div>

      {/* Search + Sort */}
      <div style={{ display:"flex", gap:12, marginBottom:18, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:200, position:"relative" }}>
          <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:16, pointerEvents:"none" }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events, tags, categories..."
            style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#fff", padding:"13px 16px 13px 44px", borderRadius:14, fontSize:14, width:"100%", transition:"border 0.2s" }}
            onFocus={e=>e.target.style.borderColor="#FF6B35"} onBlur={e=>e.target.style.borderColor="rgba(255,255,255,0.1)"} />
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.1)", color:"#fff", padding:"13px 18px", borderRadius:14, fontSize:14, cursor:"pointer", minWidth:170, fontFamily:"inherit" }}>
          <option value="date-asc">📅 Earliest First</option>
          <option value="date-desc">📅 Latest First</option>
          <option value="price-asc">💰 Price: Low → High</option>
          <option value="price-desc">💰 Price: High → Low</option>
          <option value="name">🔤 Name A–Z</option>
        </select>
      </div>

      {/* Category Pills */}
      <div style={{ display:"flex", gap:8, marginBottom:32, overflowX:"auto", paddingBottom:4, flexWrap:"wrap" }}>
        {CATEGORIES.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className="btn-press" style={{
            background: cat===c ? "linear-gradient(135deg,#FF6B35,#FF3CAC)" : "rgba(255,255,255,0.04)",
            border:`1px solid ${cat===c?"transparent":"rgba(255,255,255,0.08)"}`,
            color: cat===c ? "#fff" : "#6B7280",
            padding:"8px 20px", borderRadius:50, fontSize:13, fontWeight:600, whiteSpace:"nowrap", transition:"all 0.2s"
          }}>{c}</button>
        ))}
      </div>

      {/* Count */}
      <p style={{ color:"#4B5563", fontSize:14, marginBottom:20 }}>{filtered.length} event{filtered.length!==1?"s":""} found</p>

      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"100px 0", color:"#2D2D35" }}>
          <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
          <p style={{ fontSize:18 }}>No events found. Try different filters.</p>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:24 }}>
          {filtered.map((e,i)=> <EventCard key={e.id} event={e} idx={i} onClick={()=>onSelect(e)} />)}
        </div>
      )}
    </div>
  );
}

function EventCard({ event:e, idx, onClick }) {
  const status = getStatus(e);
  const pct = slotsPct(e);
  const slots = e.capacity - e.registered;
  const dur = getDuration(e);
  const cd = getCountdown(e.startDate);
  const [hovered, setHovered] = useState(false);

  return (
    <div className="card-hover" onClick={onClick}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{ background:"rgba(255,255,255,0.025)", border:`1px solid ${hovered?e.accent+"55":"rgba(255,255,255,0.07)"}`, borderRadius:24, overflow:"hidden", cursor:"pointer", animation:`fadeUp 0.45s ease ${idx*0.04}s both`, transition:"border-color 0.3s" }}>

      {/* Image */}
      <div style={{ position:"relative", height:210, overflow:"hidden" }}>
        <img src={IMAGES[e.image]} alt={e.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s", transform:hovered?"scale(1.08)":"scale(1)" }} />
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg, transparent 35%, rgba(5,5,8,0.9) 100%)` }} />
        <div style={{ position:"absolute", inset:0, background:`${e.accent}18`, opacity:hovered?1:0.5, transition:"opacity 0.3s" }} />

        {status === "ongoing" && (
          <div style={{ position:"absolute", top:14, left:14, background:"#EF4444", color:"#fff", fontSize:11, fontWeight:700, padding:"5px 11px", borderRadius:20, display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background:"#fff", animation:"pulse 1s infinite", display:"inline-block" }} />LIVE NOW
          </div>
        )}
        {dur > 1 && (
          <div style={{ position:"absolute", top:14, right:14, background:"rgba(0,0,0,0.75)", color:"#fff", fontSize:11, fontWeight:600, padding:"5px 11px", borderRadius:20, backdropFilter:"blur(8px)" }}>
            {dur}-Day Event
          </div>
        )}

        <div style={{ position:"absolute", bottom:14, left:14, background:e.accent, color:"#fff", fontSize:11, fontWeight:700, padding:"4px 10px", borderRadius:20 }}>{e.category}</div>
        <div style={{ position:"absolute", bottom:14, right:14, background:"rgba(0,0,0,0.8)", color:e.price===0?"#34D399":"#FBBF24", fontSize:15, fontWeight:800, padding:"4px 12px", borderRadius:10, backdropFilter:"blur(4px)" }}>
          {e.price===0?"FREE":`₹${e.price}`}
        </div>
      </div>

      <div style={{ padding:"18px 20px" }}>
        <h3 style={{ fontSize:17, fontWeight:700, color:"#fff", marginBottom:6, lineHeight:1.3 }}>{e.title}</h3>
        <p style={{ fontSize:13, color:"#4B5563", lineHeight:1.6, marginBottom:14, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{e.description}</p>

        <div style={{ display:"flex", gap:14, fontSize:12, color:"#6B7280", marginBottom:14, flexWrap:"wrap" }}>
          <span>📅 {fmtDate(e.startDate)}{dur>1?` – ${fmtDate(e.endDate)}`:""}</span>
          <span>📍 {e.venue.length>22?e.venue.slice(0,22)+"…":e.venue}</span>
        </div>

        {/* Tags */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:14 }}>
          {e.tags.slice(0,3).map(t=>(
            <span key={t} style={{ background:`${e.accent}18`, border:`1px solid ${e.accent}30`, color:e.accent, fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:50 }}>{t}</span>
          ))}
        </div>

        {/* Countdown */}
        {cd && status==="upcoming" && (
          <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:10, padding:"8px 12px", marginBottom:12, fontSize:12, color:"#FBBF24", fontWeight:600 }}>
            ⏳ Starts in {cd.days}d {cd.hrs}h
          </div>
        )}

        {/* Capacity bar */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#4B5563", marginBottom:5 }}>
            <span>{e.registered} registered</span>
            <span style={{ color: slots<=0?"#EF4444":slots<=10?"#FBBF24":"#10B981", fontWeight:600 }}>
              {slots<=0?"Sold Out!":slots<=10?`⚠ ${slots} left`:`${slots} seats left`}
            </span>
          </div>
          <div style={{ height:5, background:"rgba(255,255,255,0.07)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${e.accent},${e.accent}99)`, borderRadius:3, transition:"width 0.6s ease" }} />
          </div>
        </div>

        <button className="btn-press" style={{ width:"100%", background:`linear-gradient(135deg,${e.accent},${e.accent}aa)`, border:"none", color:"#fff", padding:"12px", borderRadius:12, fontSize:13, fontWeight:700 }}>
          View Details →
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   EVENT DETAIL
───────────────────────────────────────────────────────── */
function EventDetail({ event:e, onBack, onRegister, myTickets, user }) {
  const alreadyRegistered = myTickets.some(t => t.event.id === e.id);
  const status = getStatus(e);
  const pct = slotsPct(e);
  const slots = e.capacity - e.registered;
  const dur = getDuration(e);
  const cd = getCountdown(e.startDate);
  const [paying, setPaying] = useState(false);

  const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const handleRegister = async () => {
  if (alreadyRegistered || slots <= 0) return;
  setPaying(true);

  try {
    // Free event path
    if (e.price === 0) {
      const res = await api.payment.freeRegister(e.id);
      setPaying(false);
      onRegister(e, res.ticket);
      return;
    }

    // Paid event — create Razorpay order
    const order = await api.payment.createOrder(e.id);

    const loaded = await loadRazorpayScript();
    if (!loaded) {
      alert("Failed to load Razorpay. Check your internet connection.");
      setPaying(false);
      return;
    }

    const options = {
      key: order.keyId,                  // your RAZORPAY_KEY_ID from backend
      amount: order.amount,
      currency: order.currency,
      name: "EventHive",
      description: order.eventTitle,
      order_id: order.orderId,
      handler: async (response) => {
        // Verify payment on backend
        const verified = await api.payment.verify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          eventId: e.id,
        });
        setPaying(false);
        onRegister(e, verified.ticket);
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      theme: { color: e.accent || "#FF6B35" },
      modal: {
        ondismiss: () => setPaying(false),
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    setPaying(false);
    alert(err.message || "Payment failed. Please try again.");
  }
};

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"32px 24px", animation:"fadeUp 0.4s ease" }}>
      <button onClick={onBack} className="btn-press" style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)", color:"#9CA3AF", padding:"9px 20px", borderRadius:50, fontSize:13, marginBottom:28, display:"flex", alignItems:"center", gap:6 }}>
        ← Back to Events
      </button>

      {/* Hero Image */}
      <div style={{ position:"relative", borderRadius:24, overflow:"hidden", height:"clamp(200px,35vw,420px)", marginBottom:32 }}>
        <img src={IMAGES[e.image]} alt={e.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, ${e.accent}44, rgba(5,5,8,0.5))` }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, transparent 40%, rgba(5,5,8,0.9) 100%)" }} />
        {status==="ongoing" && (
          <div style={{ position:"absolute", top:20, left:20, background:"#EF4444", color:"#fff", fontSize:13, fontWeight:700, padding:"6px 14px", borderRadius:20, display:"flex", alignItems:"center", gap:6 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#fff", animation:"pulse 1s infinite", display:"inline-block" }} />LIVE NOW
          </div>
        )}
        <div style={{ position:"absolute", bottom:24, left:28 }}>
          <div style={{ background:e.accent, color:"#fff", fontSize:12, fontWeight:700, padding:"5px 12px", borderRadius:20, marginBottom:10, display:"inline-block" }}>{e.category}</div>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(20px,3vw,34px)", fontWeight:800, color:"#fff", lineHeight:1.1 }}>{e.title}</h1>
        </div>
        {dur>1 && (
          <div style={{ position:"absolute", top:20, right:20, background:"rgba(0,0,0,0.75)", color:"#fff", fontSize:12, fontWeight:600, padding:"6px 14px", borderRadius:20 }}>
            {dur}-Day Event
          </div>
        )}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:32, alignItems:"start" }}>
        <div>
          <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:22, fontWeight:800, color:"#fff", marginBottom:14 }}>About this Event</h2>
          <p style={{ color:"#6B7280", lineHeight:1.8, fontSize:16, marginBottom:28 }}>{e.description}</p>

          {/* Tags */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:28 }}>
            {e.tags.map(t=>(
              <span key={t} style={{ background:`${e.accent}18`, border:`1px solid ${e.accent}35`, color:e.accent, fontSize:13, fontWeight:600, padding:"5px 14px", borderRadius:50 }}>{t}</span>
            ))}
          </div>

          {/* Info grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))", gap:12 }}>
            {[
              ["📅 Date", fmtDate(e.startDate) + (dur>1?` – ${fmtDate(e.endDate)}`:"")],
              ["⏰ Time", e.time],
              ["📍 Venue", e.venue],
              ["💰 Price", e.price===0?"FREE":`₹${e.price}`],
              ["🎯 Capacity", `${e.capacity} seats`],
              ["⏳ Duration", `${dur} day${dur>1?"s":""}`],
            ].map(([k,v])=>(
              <div key={k} style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:"14px 16px" }}>
                <div style={{ fontSize:12, color:"#4B5563", marginBottom:4 }}>{k}</div>
                <div style={{ fontSize:15, fontWeight:700, color:"#fff" }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Card */}
        <div style={{ width:280, flexShrink:0, background:"rgba(255,255,255,0.03)", border:`1px solid ${e.accent}30`, borderRadius:24, padding:24, position:"sticky", top:96 }}>
          <div style={{ textAlign:"center", marginBottom:20 }}>
            <div style={{ fontFamily:"'Syne', sans-serif", fontSize:36, fontWeight:900, color:e.price===0?"#34D399":"#FBBF24" }}>
              {e.price===0?"FREE":`₹${e.price}`}
            </div>
            <div style={{ fontSize:13, color:"#4B5563" }}>per person</div>
          </div>

          {/* Capacity */}
          <div style={{ marginBottom:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, color:"#4B5563", marginBottom:6 }}>
              <span>{e.registered}/{e.capacity} registered</span>
              <span style={{ fontWeight:700, color:pct>=90?"#EF4444":pct>=70?"#FBBF24":"#10B981" }}>{pct}% full</span>
            </div>
            <div style={{ height:6, background:"rgba(255,255,255,0.07)", borderRadius:3 }}>
              <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${e.accent},${e.accent}88)`, borderRadius:3 }} />
            </div>
            <div style={{ fontSize:12, marginTop:6, color:slots<=5?"#EF4444":slots<=20?"#FBBF24":"#6B7280" }}>
              {slots<=0?"❌ Sold Out":slots<=5?`⚠ Only ${slots} seats left!`:slots<=20?`⚠ ${slots} seats left`:`✓ ${slots} seats available`}
            </div>
          </div>

          {/* Countdown */}
          {cd && (
            <div style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:12, padding:"10px 14px", marginBottom:16, textAlign:"center", fontSize:13, color:"#FBBF24", fontWeight:600 }}>
              ⏳ Starts in {cd.days}d {cd.hrs}h
            </div>
          )}

          <button className="btn-press" onClick={handleRegister} disabled={alreadyRegistered || slots<=0 || paying} style={{
            width:"100%", border:"none", color:"#fff", padding:"15px", borderRadius:14, fontSize:15, fontWeight:800,
            background: alreadyRegistered ? "rgba(16,185,129,0.2)" : slots<=0 ? "rgba(100,100,100,0.3)" : `linear-gradient(135deg,${e.accent},#8B5CF6)`,
            borderColor: alreadyRegistered ? "#10B981" : "transparent", borderWidth:1, borderStyle:"solid",
            cursor: alreadyRegistered || slots<=0 ? "not-allowed" : "pointer",
            boxShadow: alreadyRegistered || slots<=0 ? "none" : `0 12px 32px ${e.accent}40`,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8
          }}>
            {paying ? (
              <><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} />Processing...</>
            ) : alreadyRegistered ? "✓ Already Registered" : slots<=0 ? "Sold Out" : e.price===0?"Register Free →":"Pay & Register →"}
          </button>

          {user.role==="admin" && (
            <p style={{ textAlign:"center", fontSize:12, color:"#4B5563", marginTop:10 }}>👑 Admin view — cannot register</p>
          )}

          <div style={{ marginTop:20, display:"flex", flexDirection:"column", gap:6 }}>
            {["🎟️ Instant QR ticket","📧 Email confirmation","💳 Secure payment"].map(f=>(
              <div key={f} style={{ fontSize:12, color:"#4B5563" }}>{f}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   MY TICKETS
───────────────────────────────────────────────────────── */
function MyTickets({ tickets, setPage, onOpen }) {
  if (!tickets.length) return (
    <div style={{ maxWidth:700, margin:"0 auto", padding:"80px 24px", textAlign:"center" }}>
      <div style={{ fontSize:80, marginBottom:20, animation:`float 3s ease-in-out infinite` }}>🎟️</div>
      <h2 style={{ fontFamily:"'Syne', sans-serif", fontSize:32, fontWeight:800, color:"#fff", marginBottom:12 }}>No Tickets Yet</h2>
      <p style={{ color:"#4B5563", fontSize:16, marginBottom:32 }}>Register for events to get your QR tickets here.</p>
      <button className="btn-press" onClick={()=>setPage("events")} style={{ background:"linear-gradient(135deg,#FF6B35,#FF3CAC)", border:"none", color:"#fff", padding:"14px 36px", borderRadius:50, fontSize:15, fontWeight:700 }}>Browse Events →</button>
    </div>
  );

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ marginBottom:32 }}>
        <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:40, fontWeight:800, color:"#fff", marginBottom:8 }}>My Tickets 🎟️</h1>
        <p style={{ color:"#4B5563" }}>{tickets.length} ticket{tickets.length!==1?"s":""} · Tap any to view QR code</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:20 }}>
        {tickets.map((tk,i)=>(
          <div key={tk.id} className="ticket-card card-hover" onClick={()=>onOpen(tk)} style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:24, overflow:"hidden", cursor:"pointer", animation:`fadeUp 0.45s ease ${i*0.07}s both` }}>
            <div style={{ background:`linear-gradient(135deg,${tk.event.accent},${tk.event.accent}88)`, padding:"22px 22px 18px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:-20, top:-20, width:110, height:110, borderRadius:"50%", background:"rgba(255,255,255,0.1)" }} />
              <div style={{ position:"absolute", right:25, bottom:-30, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.05)" }} />
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", fontWeight:600, letterSpacing:1, marginBottom:4 }}>🎟️ EVENT TICKET</div>
              <div style={{ fontSize:18, fontWeight:800, color:"#fff", lineHeight:1.2, marginBottom:4 }}>{tk.event.title}</div>
              <div style={{ fontSize:12, color:"rgba(255,255,255,0.65)" }}>{tk.event.category}</div>
            </div>
            <div style={{ height:"2px", background:`repeating-linear-gradient(90deg,${tk.event.accent} 0,${tk.event.accent} 8px,transparent 8px,transparent 16px)`, opacity:0.35 }} />
            <div style={{ padding:"16px 22px" }}>
              {[["📅", fmtDateLong(tk.event.startDate)],["📍", tk.event.venue],["🔖", tk.id]].map(([ic,v])=>(
                <div key={v} style={{ display:"flex", gap:10, alignItems:"flex-start", fontSize:13, color:"#6B7280", marginBottom:8 }}>
                  <span style={{ flexShrink:0 }}>{ic}</span>
                  <span style={{ fontFamily:ic==="🔖"?"'JetBrains Mono',monospace":"inherit", fontSize:ic==="🔖"?11:13 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ padding:"10px 22px 16px", fontSize:13, color:tk.event.accent, fontWeight:700 }}>
              Tap to view QR Code →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   ADMIN DASHBOARD
───────────────────────────────────────────────────────── */
function AdminDashboard({ events, tickets }) {
  const totalRev = tickets.reduce((s,t)=>s+t.event.price,0);
  const totalReg = events.reduce((s,e)=>s+e.registered,0);
  const ongoing = events.filter(e=>getStatus(e)==="ongoing").length;
  const upcoming = events.filter(e=>getStatus(e)==="upcoming").length;
  const avgFill = Math.round(events.reduce((s,e)=>s+slotsPct(e),0)/events.length);
  const [tab, setTab] = useState("overview");

  const cats = {};
  events.forEach(e=>{ cats[e.category]=(cats[e.category]||0)+e.registered; });
  const topCats = Object.entries(cats).sort((a,b)=>b[1]-a[1]).slice(0,5);
  const maxCat = topCats[0]?.[1]||1;

  const statCards = [
    { label:"Total Events", value:events.length, icon:"🎪", color:"#6366F1" },
    { label:"Live Now", value:ongoing, icon:"🔴", color:"#EF4444" },
    { label:"Upcoming", value:upcoming, icon:"⏰", color:"#10B981" },
    { label:"Total Registrations", value:totalReg.toLocaleString(), icon:"👥", color:"#FF6B35" },
    { label:"Revenue (Test)", value:`₹${totalRev.toLocaleString()}`, icon:"💰", color:"#FBBF24" },
    { label:"Avg Fill Rate", value:`${avgFill}%`, icon:"📊", color:"#FF3CAC" },
  ];

  // CSV export
  const exportCSV = () => {
    const rows = [["Event","Category","Date","Status","Registered","Capacity","Fill%","Revenue","Seats Left"]];
    events.forEach(e=>{
      const st = getStatus(e);
      rows.push([e.title,e.category,fmtDate(e.startDate),st,e.registered,e.capacity,slotsPct(e),e.price===0?0:e.price*e.registered,e.capacity-e.registered]);
    });
    const csv = rows.map(r=>r.join(",")).join("\n");
    const blob = new Blob([csv],{type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href=url; a.download="eventhive_report.csv"; a.click();
  };

  return (
    <div style={{ maxWidth:1320, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:32, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ fontFamily:"'Syne', sans-serif", fontSize:"clamp(22px,3vw,36px)", fontWeight:800, color:"#fff", marginBottom:4 }}>Admin Dashboard 👑</h1>
          <p style={{ color:"#4B5563", fontSize:15 }}>Full overview — events, registrations, and revenue.</p>
        </div>
        <button className="btn-press" onClick={exportCSV} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.12)", color:"#9CA3AF", padding:"10px 22px", borderRadius:12, fontSize:14, fontWeight:600, display:"flex", alignItems:"center", gap:8 }}>
          📤 Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(175px,1fr))", gap:16, marginBottom:32 }}>
        {statCards.map((s,i)=>(
          <div key={s.label} style={{ background:`${s.color}12`, border:`1px solid ${s.color}28`, borderRadius:20, padding:"20px 18px", animation:`fadeUp 0.4s ease ${i*0.06}s both` }}>
            <div style={{ fontSize:30, marginBottom:10 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Syne', sans-serif", fontSize:30, fontWeight:800, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:13, color:"#4B5563", marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:24, background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:14, padding:4, alignSelf:"start", width:"fit-content" }}>
        {[["overview","📊 Overview"],["events","🎪 All Events"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} className="btn-press" style={{
            padding:"9px 20px", borderRadius:11, border:"none", fontSize:14, fontWeight:600,
            background: tab===k ? "linear-gradient(135deg,#FF6B35,#FF3CAC)" : "transparent",
            color: tab===k ? "#fff" : "#4B5563", transition:"all 0.2s"
          }}>{l}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
          {/* Top categories by registrations */}
          <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:24, animation:"fadeUp 0.4s ease" }}>
            <h3 style={{ fontFamily:"'Syne', sans-serif", fontSize:18, fontWeight:700, color:"#fff", marginBottom:20 }}>Top Categories by Registrations</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {topCats.map(([cat,count],i)=>{
                const ev = events.find(e=>e.category===cat);
                const color = ev?.accent||"#FF6B35";
                return (
                  <div key={cat}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:6 }}>
                      <span style={{ color:"#9CA3AF", fontWeight:600 }}>{cat}</span>
                      <span style={{ color, fontWeight:700 }}>{count.toLocaleString()}</span>
                    </div>
                    <div style={{ height:6, background:"rgba(255,255,255,0.05)", borderRadius:3 }}>
                      <div style={{ height:"100%", width:`${(count/maxCat)*100}%`, background:`linear-gradient(90deg,${color},${color}77)`, borderRadius:3, transition:"width 0.8s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Revenue by category */}
          <div style={{ background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, padding:24, animation:"fadeUp 0.4s ease 0.1s" }}>
            <h3 style={{ fontFamily:"'Syne', sans-serif", fontSize:18, fontWeight:700, color:"#fff", marginBottom:20 }}>Revenue Breakdown (Test Mode)</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {events.filter(e=>e.price>0).sort((a,b)=>(b.price*b.registered)-(a.price*a.registered)).slice(0,6).map(e=>(
                <div key={e.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 14px", background:"rgba(255,255,255,0.03)", borderRadius:12 }}>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:"#fff" }}>{e.title.slice(0,24)}{e.title.length>24?"…":""}</div>
                    <div style={{ fontSize:12, color:"#4B5563" }}>{e.registered} × ₹{e.price}</div>
                  </div>
                  <div style={{ fontSize:15, fontWeight:800, color:"#FBBF24" }}>₹{(e.price*e.registered).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "events" && (
        <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20, overflow:"auto", animation:"fadeUp 0.4s ease" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:850 }}>
            <thead>
              <tr style={{ background:"rgba(255,255,255,0.04)" }}>
                {["Event","Category","Dates","Status","Fill Rate","Revenue","Seats Left"].map(h=>(
                  <th key={h} style={{ padding:"14px 16px", textAlign:"left", fontSize:11, fontWeight:700, color:"#4B5563", textTransform:"uppercase", letterSpacing:1, borderBottom:"1px solid rgba(255,255,255,0.05)", whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(e=>{
                const status = getStatus(e);
                const pct = slotsPct(e);
                const slots = e.capacity - e.registered;
                return (
                  <tr key={e.id} style={{ borderBottom:"1px solid rgba(255,255,255,0.04)", transition:"background 0.2s" }}
                    onMouseEnter={ev=>ev.currentTarget.style.background="rgba(255,255,255,0.025)"}
                    onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"14px 16px" }}>
                      <div style={{ fontWeight:700, color:"#fff", fontSize:14 }}>{e.title}</div>
                      <div style={{ fontSize:11, color:"#4B5563" }}>{getDuration(e)}-day · {e.venue.slice(0,22)}</div>
                    </td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ background:`${e.accent}20`, border:`1px solid ${e.accent}40`, color:e.accent, fontSize:11, padding:"3px 10px", borderRadius:20, fontWeight:700 }}>{e.category}</span>
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:13, color:"#6B7280", whiteSpace:"nowrap" }}>
                      {fmtDate(e.startDate)}{getDuration(e)>1?` – ${fmtDate(e.endDate)}`:""}</td>
                    <td style={{ padding:"14px 16px" }}>
                      <span style={{ background:status==="ongoing"?"rgba(239,68,68,0.15)":"rgba(16,185,129,0.12)", color:status==="ongoing"?"#EF4444":"#10B981", fontSize:11, padding:"4px 11px", borderRadius:20, fontWeight:700 }}>
                        {status==="ongoing"?"🔴 LIVE":"⏰ Upcoming"}
                      </span>
                    </td>
                    <td style={{ padding:"14px 16px", minWidth:140 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ flex:1, height:5, background:"rgba(255,255,255,0.06)", borderRadius:3 }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${e.accent},${e.accent}77)`, borderRadius:3 }} />
                        </div>
                        <span style={{ fontSize:12, color:"#6B7280", minWidth:32 }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:14, fontWeight:700, color:"#FBBF24" }}>
                      {e.price===0?"—":`₹${(e.price*e.registered).toLocaleString()}`}
                    </td>
                    <td style={{ padding:"14px 16px", fontSize:13, fontWeight:700, color:slots<=0?"#EF4444":slots<=10?"#FBBF24":"#10B981" }}>
                      {slots<=0?"Sold Out":slots}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   TICKET MODAL
───────────────────────────────────────────────────────── */
function TicketModal({ ticket:tk, onClose }) {
  return (
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.75)", backdropFilter:"blur(12px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:"#0D0D14", border:"1px solid rgba(255,255,255,0.1)", borderRadius:28, width:"100%", maxWidth:400, overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,0.7)", animation:"fadeUp 0.35s cubic-bezier(.34,1.56,.64,1)" }}>

        {/* Top */}
        <div style={{ background:`linear-gradient(135deg,${tk.event.accent},${tk.event.accent}77)`, padding:"26px 26px 20px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-30, top:-30, width:130, height:130, borderRadius:"50%", background:"rgba(255,255,255,0.12)" }} />
          <div style={{ position:"absolute", left:-20, bottom:-40, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.07)" }} />
          <button onClick={onClose} style={{ position:"absolute", top:14, right:14, background:"rgba(255,255,255,0.2)", border:"none", color:"#fff", width:28, height:28, borderRadius:"50%", cursor:"pointer", fontSize:14, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <div style={{ fontSize:11, color:"rgba(255,255,255,0.65)", fontWeight:700, letterSpacing:1.5, marginBottom:6 }}>🎟️ YOUR TICKET</div>
          <div style={{ fontSize:22, fontWeight:800, color:"#fff", marginBottom:4, lineHeight:1.2 }}>{tk.event.title}</div>
          <div style={{ fontSize:13, color:"rgba(255,255,255,0.65)" }}>{tk.event.venue} · {fmtDate(tk.event.startDate)}</div>
        </div>

        {/* Tear line */}
        <div style={{ height:2, background:`repeating-linear-gradient(90deg,${tk.event.accent} 0,${tk.event.accent} 8px,transparent 8px,transparent 16px)`, opacity:0.4 }} />

        <div style={{ padding:26 }}>
          {/* QR */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:16 }}>
            <div style={{ background:"#fff", padding:14, borderRadius:18, boxShadow:`0 0 0 4px ${tk.event.accent}33` }}>
              <MiniQR value={tk.qrValue} size={164} />
            </div>
          </div>
          <div style={{ textAlign:"center", fontFamily:"'JetBrains Mono',monospace", fontSize:14, fontWeight:700, color:"#D1D5DB", marginBottom:4, letterSpacing:2 }}>{tk.id}</div>
          <p style={{ textAlign:"center", color:"#4B5563", fontSize:12, marginBottom:22 }}>Show this QR at the event entrance</p>

          <div style={{ borderTop:"1px solid rgba(255,255,255,0.05)", paddingTop:18 }}>
            {[["📅 Date",fmtDateLong(tk.event.startDate)],["⏰ Time",tk.event.time],["💰 Paid",tk.event.price===0?"FREE":`₹${tk.event.price}`]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:10 }}>
                <span style={{ color:"#4B5563" }}>{k}</span>
                <span style={{ color:"#E5E7EB", fontWeight:600 }}>{v}</span>
              </div>
            ))}
          </div>

          <button className="btn-press" onClick={onClose} style={{ width:"100%", background:`linear-gradient(135deg,${tk.event.accent},#8B5CF6)`, border:"none", color:"#fff", padding:"14px", borderRadius:14, fontSize:14, fontWeight:800, marginTop:10, boxShadow:`0 10px 28px ${tk.event.accent}40` }}>
            Done ✓
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Mini QR (visual mock) ─── */
function MiniQR({ value, size }) {
  const cells = 21, cell = size / cells;
  const h = s => { let v=0; for(let i=0;i<s.length;i++) v=(Math.imul(31,v)+s.charCodeAt(i))|0; return v; };
  const grid = Array.from({length:cells},(_,r)=>Array.from({length:cells},(_,c)=>{
    if((r<7&&c<7)||(r<7&&c>=cells-7)||(r>=cells-7&&c<7)){
      const rr=r%7,cc=c%7;
      return rr===0||rr===6||cc===0||cc===6||(rr>=2&&rr<=4&&cc>=2&&cc<=4);
    }
    return Math.abs(h(value+r*100+c))%3!==0;
  }));
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white"/>
      {grid.map((row,r)=>row.map((on,c)=>on?<rect key={`${r}-${c}`} x={c*cell} y={r*cell} width={cell} height={cell} fill="#111"/>:null))}
    </svg>
  );
}
