import { useState, useEffect, useRef } from "react";

/* ─── FONTS ─── */
const FontLink = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;1,400;1,700&family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');
  `}</style>
);

/* ─── 30 EVENTS ─── */
const EVENTS_DATA = [
  { id:1,  title:"Technovate Summit",        category:"Tech",      startDate:"2025-06-07", endDate:"2025-06-09", time:"10:00 AM", venue:"Main Auditorium",      price:299,  capacity:200,  registered:178, tags:["Hackathon","AI","3 Days"],     image:"img_technovate",     description:"The biggest college tech summit. AI workshops, hackathon, and 50+ speakers over 3 epic days.", accent:"#E8835A" },
  { id:2,  title:"Utsav Cultural Fest",       category:"Cultural",  startDate:"2025-06-14", endDate:"2025-06-15", time:"5:00 PM",  venue:"Open Air Theatre",     price:149,  capacity:500,  registered:312, tags:["Music","Dance","2 Days"],      image:"img_cultural",       description:"Music, dance, art, and food from across India. A two-day celebration of culture and creativity.", accent:"#C97BB2" },
  { id:3,  title:"Startup Pitch Night",       category:"Business",  startDate:"2025-06-20", endDate:"2025-06-20", time:"6:00 PM",  venue:"Seminar Hall B",       price:0,    capacity:100,  registered:67,  tags:["Startups","Pitch","Free"],     image:"img_startup",        description:"Present your startup idea to investors and industry mentors. Get funded or get feedback.", accent:"#6BBF9E" },
  { id:4,  title:"Photography Workshop",      category:"Workshop",  startDate:"2025-06-25", endDate:"2025-06-25", time:"11:00 AM", venue:"Arts Block",           price:499,  capacity:40,   registered:38,  tags:["Photography","Hands-on"],      image:"img_photography",    description:"Hands-on photography and editing masterclass with professional photographers. Limited seats!", accent:"#D4A76A" },
  { id:5,  title:"E-Sports Championship",     category:"Gaming",    startDate:"2025-06-28", endDate:"2025-06-29", time:"12:00 PM", venue:"Computer Lab Complex", price:199,  capacity:64,   registered:48,  tags:["Gaming","BGMI","2 Days"],      image:"img_esports",        description:"Compete in BGMI, Valorant, and FIFA. Cash prizes worth ₹50,000 for winners.", accent:"#9B7FD4" },
  { id:6,  title:"Career Fair 2025",          category:"Career",    startDate:"2025-07-04", endDate:"2025-07-05", time:"9:00 AM",  venue:"Campus Grounds",       price:0,    capacity:1000, registered:543, tags:["Jobs","Internships","Free"],   image:"img_career",         description:"Meet 60+ companies over 2 days. On-the-spot interviews and internship offers.", accent:"#7AAED4" },
  { id:7,  title:"Robotics Expo",             category:"Tech",      startDate:"2025-07-07", endDate:"2025-07-09", time:"10:00 AM", venue:"Engineering Block",    price:399,  capacity:150,  registered:89,  tags:["Robotics","IoT","3 Days"],     image:"img_robotics",       description:"Build, program, and battle robots. Three days of cutting-edge robotics competition.", accent:"#6BBFC9" },
  { id:8,  title:"Hip-Hop Showdown",          category:"Cultural",  startDate:"2025-07-11", endDate:"2025-07-11", time:"7:00 PM",  venue:"College Amphitheatre", price:199,  capacity:300,  registered:210, tags:["Hip-Hop","Battle","Dance"],    image:"img_hiphop",         description:"The ultimate hip-hop battle event. Freestyle rap, breakdance battles, and DJ sets.", accent:"#D4956A" },
  { id:9,  title:"Debate Championship",       category:"Academic",  startDate:"2025-07-14", endDate:"2025-07-15", time:"9:00 AM",  venue:"Conference Hall",      price:99,   capacity:80,   registered:72,  tags:["Debate","GD","2 Days"],        image:"img_debate",         description:"Two-day national-level debate championship. Win certificates and cash prizes.", accent:"#7AC4A0" },
  { id:10, title:"Comedy Night Live",         category:"Cultural",  startDate:"2025-07-18", endDate:"2025-07-18", time:"8:00 PM",  venue:"Open Air Theatre",     price:249,  capacity:400,  registered:315, tags:["Comedy","Stand-Up"],           image:"img_comedy",         description:"A night of pure laughter with top stand-up comedians from across the country.", accent:"#E8A06A" },
  { id:11, title:"Data Science Bootcamp",     category:"Tech",      startDate:"2025-07-21", endDate:"2025-07-23", time:"9:00 AM",  venue:"CS Department",        price:599,  capacity:60,   registered:44,  tags:["Data","Python","3 Days"],      image:"img_datascience",    description:"Intensive 3-day bootcamp covering ML, data viz, and real-world datasets with industry mentors.", accent:"#9B8FD4" },
  { id:12, title:"Fashion Week Campus",       category:"Cultural",  startDate:"2025-07-25", endDate:"2025-07-26", time:"3:00 PM",  venue:"Main Stage",           price:349,  capacity:250,  registered:198, tags:["Fashion","Ramp","2 Days"],     image:"img_fashion",        description:"Campus fashion week — design, showcase, and walk the ramp. Open to all creative minds.", accent:"#C985B2" },
  { id:13, title:"Cyber Security CTF",        category:"Tech",      startDate:"2025-07-29", endDate:"2025-07-30", time:"10:00 AM", venue:"Cyber Lab",            price:299,  capacity:50,   registered:31,  tags:["CTF","Hacking","2 Days"],      image:"img_ctf",            description:"Capture the Flag competition. Crack codes, find vulnerabilities, win big prizes.", accent:"#7AC4A8" },
  { id:14, title:"Sanskrit & Yoga Day",       category:"Cultural",  startDate:"2025-08-01", endDate:"2025-08-01", time:"6:00 AM",  venue:"Yoga Grounds",         price:0,    capacity:200,  registered:87,  tags:["Yoga","Wellness","Free"],      image:"img_yoga",           description:"Start your morning right with sunrise yoga, meditation, and Sanskrit chanting.", accent:"#B8A0D4" },
  { id:15, title:"Music Production Workshop", category:"Workshop",  startDate:"2025-08-04", endDate:"2025-08-05", time:"2:00 PM",  venue:"Music Room",           price:749,  capacity:20,   registered:15,  tags:["Music","DJ","2 Days"],         image:"img_musicprod",      description:"Learn music production, mixing, and mastering from professional DJs and producers.", accent:"#D47A8A" },
  { id:16, title:"Independence Day Fest",     category:"Cultural",  startDate:"2025-08-15", endDate:"2025-08-17", time:"9:00 AM",  venue:"Campus Grounds",       price:0,    capacity:2000, registered:1243,tags:["Patriotic","Free","3 Days"],   image:"img_independence",   description:"Three-day Independence Day celebration with performances, exhibitions, and patriotic events.", accent:"#E8835A" },
  { id:17, title:"Entrepreneurship Summit",   category:"Business",  startDate:"2025-08-08", endDate:"2025-08-09", time:"10:00 AM", venue:"Business School",      price:499,  capacity:120,  registered:88,  tags:["Startup","VC","2 Days"],       image:"img_entrepreneur",   description:"Two days with successful founders, VCs, and business leaders sharing actionable insights.", accent:"#D4B06A" },
  { id:18, title:"Street Art Festival",       category:"Cultural",  startDate:"2025-08-11", endDate:"2025-08-12", time:"10:00 AM", venue:"Campus Walls",         price:199,  capacity:150,  registered:103, tags:["Graffiti","Art","2 Days"],     image:"img_streetart",      description:"Transform the campus into a living art gallery. Graffiti, murals, and street performances.", accent:"#7AC4A8" },
  { id:19, title:"Chess Tournament",          category:"Academic",  startDate:"2025-08-16", endDate:"2025-08-16", time:"10:00 AM", venue:"Student Center",       price:99,   capacity:64,   registered:58,  tags:["Chess","Strategy"],            image:"img_chess",          description:"National-level chess tournament. All skill levels welcome. Prizes for top 3.", accent:"#A0B8D4" },
  { id:20, title:"Blockchain Hackathon",      category:"Tech",      startDate:"2025-08-18", endDate:"2025-08-19", time:"8:00 AM",  venue:"Innovation Lab",       price:0,    capacity:80,   registered:62,  tags:["Blockchain","Web3","Free"],    image:"img_blockchain",     description:"Build the future of Web3. 36-hour hackathon with mentors from top crypto companies.", accent:"#D4A86A" },
  { id:21, title:"Food Festival",             category:"Cultural",  startDate:"2025-06-29", endDate:"2025-06-29", time:"11:00 AM", venue:"Campus Canteen Area",  price:149,  capacity:600,  registered:421, tags:["Food","Stalls","Fest"],        image:"img_food",           description:"30+ food stalls, live cooking demos, eating challenges, and the ultimate food war.", accent:"#E88A7A" },
  { id:22, title:"Stand-Up Comedy Open Mic",  category:"Cultural",  startDate:"2025-07-06", endDate:"2025-07-06", time:"7:30 PM",  venue:"Seminar Hall A",       price:149,  capacity:200,  registered:134, tags:["Comedy","Open Mic"],           image:"img_openmic",        description:"Open mic night for aspiring comedians. Anyone can perform. Audience votes the winner.", accent:"#D4A070" },
  { id:23, title:"App Dev Marathon",          category:"Tech",      startDate:"2025-07-26", endDate:"2025-07-27", time:"9:00 AM",  venue:"CS Department",        price:199,  capacity:100,  registered:75,  tags:["Flutter","React","24hr"],      image:"img_appdev",         description:"24-hour app development marathon. Build a working app from scratch. Prizes worth ₹1 Lakh.", accent:"#9B9FD4" },
  { id:24, title:"Classical Dance Recital",   category:"Cultural",  startDate:"2025-07-31", endDate:"2025-07-31", time:"6:00 PM",  venue:"Auditorium",           price:199,  capacity:300,  registered:187, tags:["Bharatnatyam","Kathak"],       image:"img_classicaldance", description:"An evening of classical Indian dance forms — Bharatnatyam, Kathak, and Odissi performances.", accent:"#C98FBE" },
  { id:25, title:"Astronomy Night",           category:"Academic",  startDate:"2025-08-05", endDate:"2025-08-05", time:"8:00 PM",  venue:"Terrace Garden",       price:99,   capacity:80,   registered:76,  tags:["Stargazing","Science"],        image:"img_astronomy",      description:"Telescope stargazing, astrophotography tips, and a live talk by an ISRO scientist.", accent:"#7AAFD4" },
  { id:26, title:"Green Campus Drive",        category:"Academic",  startDate:"2025-08-07", endDate:"2025-08-07", time:"7:00 AM",  venue:"Campus Grounds",       price:0,    capacity:500,  registered:212, tags:["Eco","Plantation","Free"],     image:"img_green",          description:"Mass tree plantation drive + sustainable living workshops. Make the campus greener.", accent:"#84C4A0" },
  { id:27, title:"Quiz Bowl Championship",    category:"Academic",  startDate:"2025-08-20", endDate:"2025-08-21", time:"10:00 AM", venue:"Conference Hall",      price:149,  capacity:120,  registered:93,  tags:["Quiz","GK","2 Days"],          image:"img_quiz",           description:"Two-day quiz extravaganza. General knowledge, tech, pop culture, and more categories.", accent:"#7AB4D4" },
  { id:28, title:"Spoken Word Poetry",        category:"Cultural",  startDate:"2025-08-22", endDate:"2025-08-22", time:"6:30 PM",  venue:"Library Hall",         price:99,   capacity:150,  registered:89,  tags:["Poetry","Spoken Word"],        image:"img_poetry",         description:"Express through verse. Spoken word, slam poetry, and original composition contest.", accent:"#C098CE" },
  { id:29, title:"Sports Fest — Velocity",    category:"Sports",    startDate:"2025-08-23", endDate:"2025-08-25", time:"8:00 AM",  venue:"Sports Complex",       price:299,  capacity:800,  registered:543, tags:["Cricket","Football","3 Days"], image:"img_sports",         description:"3-day multi-sport festival. Cricket, football, basketball, athletics, and more.", accent:"#7AC4A8" },
  { id:30, title:"Farewell Gala Night",       category:"Cultural",  startDate:"2025-08-28", endDate:"2025-08-28", time:"7:00 PM",  venue:"Grand Hall",           price:599,  capacity:400,  registered:289, tags:["Formal","Party","Gala"],       image:"img_farewell",       description:"The most glamorous night of the year. Red carpet, live band, and unforgettable memories.", accent:"#D4A0C4" },
];

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

/* ─── DESIGN TOKENS ─── */
const T = {
  bg:         "#FAF7F4",
  bgCard:     "rgba(255,255,255,0.62)",
  bgCardHover:"rgba(255,255,255,0.82)",
  bgGlass:    "rgba(255,255,255,0.45)",
  border:     "rgba(180,160,140,0.18)",
  borderHover:"rgba(180,160,140,0.38)",
  text:       "#2C2420",
  textMid:    "#6B5D54",
  textMute:   "#A89990",
  rose:       "#D4748A",
  sage:       "#7AA88C",
  lavender:   "#9B8FD4",
  peach:      "#E8A07A",
  blush:      "#F2C4CE",
  sky:        "#A8C4D8",
  cream:      "#F5EFE8",
  shadow:     "0 8px 40px rgba(100,70,60,0.10)",
  shadowMd:   "0 16px 60px rgba(100,70,60,0.14)",
  shadowLg:   "0 32px 80px rgba(100,70,60,0.18)",
  radius:     "20px",
  radiusSm:   "12px",
  radiusLg:   "28px",
};

/* ─── GLOBAL CSS ─── */
const GlobalStyle = () => (
  <style>{`
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body {
      background: ${T.bg};
      overflow-x: hidden;
      font-family: 'DM Sans', sans-serif;
      color: ${T.text};
    }
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #F0EAE4; }
    ::-webkit-scrollbar-thumb { background: linear-gradient(${T.rose}, ${T.lavender}); border-radius: 3px; }

    @keyframes fadeUp    { from { opacity:0; transform:translateY(30px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn    { from { opacity:0; } to { opacity:1; } }
    @keyframes float     { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-14px); } }
    @keyframes pulse     { 0%,100% { opacity:0.6; transform:scale(1); } 50% { opacity:1; transform:scale(1.2); } }
    @keyframes spin      { to { transform: rotate(360deg); } }
    @keyframes slideInRight { from{transform:translateX(100%);opacity:0} to{transform:translateX(0);opacity:1} }
    @keyframes shimmer   { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
    @keyframes softGlow  { 0%,100%{opacity:0.5;transform:scale(1)} 50%{opacity:0.85;transform:scale(1.08)} }
    @keyframes gradDrift { 0%,100%{background-position:0% 50%} 50%{background-position:100% 50%} }

    .card-glass {
      background: ${T.bgCard};
      backdrop-filter: blur(20px) saturate(1.4);
      -webkit-backdrop-filter: blur(20px) saturate(1.4);
      border: 1px solid ${T.border};
      transition: transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s ease, background 0.2s ease, border-color 0.2s ease;
    }
    .card-glass:hover {
      background: ${T.bgCardHover};
      border-color: ${T.borderHover};
      transform: translateY(-6px) scale(1.005);
      box-shadow: ${T.shadowMd};
    }
    .btn-press { transition: all 0.18s cubic-bezier(.34,1.56,.64,1); cursor: pointer; }
    .btn-press:hover { transform: scale(1.04); filter: brightness(1.06); }
    .btn-press:active { transform: scale(0.97); }
    input, select, textarea { outline: none; font-family: 'DM Sans', sans-serif; }
    input::placeholder { color: ${T.textMute}; }
    select option { background: #fff; color: ${T.text}; }

    .nav-active { position: relative; }
    .nav-active::after {
      content:''; position:absolute; bottom:-4px; left:50%; right:50%;
      height:2px; background:linear-gradient(90deg,${T.rose},${T.lavender});
      border-radius:2px; transition: all 0.3s;
    }
    .nav-active.on::after { left:0; right:0; }

    .ticket-lift { transition: all 0.3s ease; }
    .ticket-lift:hover { transform: translateY(-5px) rotate(0.4deg); box-shadow: ${T.shadowMd}; }

    /* Pastel mesh background */
    .mesh-bg {
      background:
        radial-gradient(ellipse 60% 55% at 15% 20%, rgba(212,116,138,0.13) 0%, transparent 55%),
        radial-gradient(ellipse at 85% 15%, rgba(155,143,212,0.12) 0%, transparent 45%),
        radial-gradient(ellipse at 80% 80%, rgba(122,168,140,0.11) 0%, transparent 45%),
        radial-gradient(ellipse at 5% 85%, rgba(232,160,122,0.10) 0%, transparent 40%),
        #FAF7F4;
    }
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
    setTimeout(() => setToast(null), 3200);
  };

  const handleLogin = (role, name, email) => {
    setUser({ role, name, email });
    setPage(role === "admin" ? "admin" : "events");
    showToast(`Welcome back, ${name}! 🌸`);
  };
  const handleLogout = () => {
    setUser(null);
    setPage("landing");
    showToast("See you soon! 👋", "info");
  };
  const handleRegister = (event) => {
    const ticket = {
      id: `EVH-${Date.now().toString(36).toUpperCase()}`,
      event, registeredAt: new Date().toLocaleString(),
      qrValue: `EVENTHIVE:${event.id}:USR:${Math.random().toString(36).substr(2,8).toUpperCase()}`
    };
    setMyTickets(p => [...p, ticket]);
    setTicketModal(ticket);
    showToast(`Registered for ${event.title}! 🎟️`);
  };

  return (
    <div className="mesh-bg" style={{ fontFamily:"'DM Sans', sans-serif", minHeight:"100vh", color:T.text }}>
      <FontLink />
      <GlobalStyle />

      {/* Toast */}
      {toast && (
        <div style={{
          position:"fixed", top:24, right:24, zIndex:9999,
          background: toast.type==="success"
            ? "linear-gradient(135deg,#D4748A,#9B8FD4)"
            : "linear-gradient(135deg,#7AA88C,#7AAFD4)",
          color:"#fff", padding:"14px 22px", borderRadius:T.radius, fontSize:14, fontWeight:600,
          boxShadow:T.shadowLg, backdropFilter:"blur(16px)",
          animation:"slideInRight 0.3s ease", maxWidth:320,
          border:"1px solid rgba(255,255,255,0.35)"
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
   LANDING PAGE
───────────────────────────────────────────────────────── */
function LandingPage({ onLogin, onSignup }) {
  const featuredEvents = EVENTS_DATA.filter(e => getStatus(e) !== "past").slice(0, 6);

  return (
    <div style={{ minHeight:"100vh", position:"relative", overflowX:"hidden" }}>

      {/* Decorative blobs */}
      {[
        ["#D4748A","8%","12%","320px",5],
        ["#9B8FD4","76%","6%","260px",7],
        ["#7AA88C","4%","68%","240px",6],
        ["#E8A07A","80%","65%","200px",8],
        ["#A8C4D8","45%","82%","180px",5],
      ].map(([c,l,t,s,dur],i)=>(
        <div key={i} style={{ position:"fixed", left:l, top:t, width:s, height:s, borderRadius:"50%", background:c, opacity:0.12, filter:"blur(90px)", animation:`softGlow ${dur}s ease-in-out infinite`, animationDelay:`${i*1.3}s`, zIndex:0, pointerEvents:"none" }} />
      ))}

      {/* Navbar */}
      <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, padding:"0 48px", height:68, display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(250,247,244,0.82)", backdropFilter:"blur(20px)", borderBottom:`1px solid ${T.border}` }}>
        <div style={{ fontFamily:"'Playfair Display', serif", fontSize:24, fontWeight:700, color:T.text, letterSpacing:"-0.5px" }}>
          <span style={{ color:T.rose }}>✦</span> EventHive
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn-press" onClick={onLogin} style={{ background:"transparent", border:`1.5px solid ${T.border}`, color:T.textMid, padding:"9px 24px", borderRadius:50, fontSize:14, fontWeight:500 }}>Login</button>
          <button className="btn-press" onClick={onSignup} style={{ background:`linear-gradient(135deg,${T.rose},${T.lavender})`, border:"none", color:"#fff", padding:"9px 24px", borderRadius:50, fontSize:14, fontWeight:600, boxShadow:`0 6px 24px rgba(212,116,138,0.30)` }}>Sign Up Free</button>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ position:"relative", zIndex:5, minHeight:"100vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"120px 24px 80px" }}>

        {/* Badge */}
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(212,116,138,0.10)", border:`1px solid rgba(212,116,138,0.25)`, borderRadius:50, padding:"8px 20px", fontSize:13, color:T.rose, marginBottom:32, fontWeight:500, animation:"fadeUp 0.6s ease both" }}>
          <span style={{ width:7, height:7, borderRadius:"50%", background:T.rose, display:"inline-block", animation:"pulse 1.8s infinite" }} />
          India's #1 College Event Platform 🎓
        </div>

        {/* Main Heading */}
        <h1 style={{
          fontFamily:"'Playfair Display', serif",
          fontSize:"clamp(48px,8vw,96px)", fontWeight:800, lineHeight:1.0, letterSpacing:"-3px",
          color:T.text, marginBottom:28,
          animation:"fadeUp 0.7s ease both"
        }}>
          Where Campus<br />
          <em style={{ fontStyle:"italic", backgroundImage:`linear-gradient(135deg,${T.rose},${T.lavender},${T.sage})`, backgroundClip:"text", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundSize:"200% 200%", animation:"gradDrift 5s ease infinite" }}>
            Comes Alive.
          </em>
        </h1>

        <p style={{ fontSize:"clamp(15px,2vw,18px)", color:T.textMid, maxWidth:540, margin:"0 auto 44px", lineHeight:1.85, animation:"fadeUp 0.8s ease 0.1s both", fontWeight:400 }}>
          Register for events, get instant QR tickets, and track attendance — all on one beautifully crafted platform built for college life.
        </p>

        {/* CTA Buttons */}
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:72, animation:"fadeUp 0.8s ease 0.2s both" }}>
          <button className="btn-press" onClick={onSignup} style={{
            background:`linear-gradient(135deg,${T.rose},${T.lavender})`, border:"none", color:"#fff",
            padding:"16px 44px", borderRadius:50, fontSize:16, fontWeight:600,
            boxShadow:`0 14px 40px rgba(212,116,138,0.32)`
          }}>
            Explore Events →
          </button>
          <button className="btn-press" onClick={onLogin} style={{
            background:T.bgCard, border:`1.5px solid ${T.border}`, color:T.textMid,
            padding:"16px 44px", borderRadius:50, fontSize:16, fontWeight:500,
            backdropFilter:"blur(16px)"
          }}>
            Login to Continue
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:"flex", justifyContent:"center", gap:"clamp(24px,6vw,100px)", flexWrap:"wrap", marginBottom:80, animation:"fadeUp 0.9s ease 0.3s both" }}>
          {[["30+","Live Events","🎪"],["5,000+","Students","👥"],["₹0","No Hidden Fees","✅"],["100%","QR Verified","🎟️"]].map(([v,l,icon])=>(
            <div key={l} style={{ textAlign:"center" }}>
              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(28px,4vw,48px)", fontWeight:700, color:T.text }}>{v}</div>
              <div style={{ fontSize:13, color:T.textMute, marginTop:4 }}>{icon} {l}</div>
            </div>
          ))}
        </div>

        {/* Featured Events */}
        <div style={{ width:"100%", overflow:"hidden", marginBottom:80 }}>
          <p style={{ fontSize:11, color:T.textMute, fontWeight:600, letterSpacing:3, textTransform:"uppercase", marginBottom:24, animation:"fadeUp 1s ease 0.4s both" }}>Featured This Season</p>
          <div style={{ display:"flex", gap:20, justifyContent:"center", flexWrap:"wrap", padding:"0 20px" }}>
            {featuredEvents.map((e,i)=>(
              <div key={e.id} className="card-glass" onClick={onSignup} style={{
                borderRadius:T.radius, overflow:"hidden", width:230, flexShrink:0, cursor:"pointer",
                animation:`fadeUp 0.6s ease ${0.1+i*0.08}s both`, boxShadow:T.shadow
              }}>
                <div style={{ height:140, overflow:"hidden", position:"relative" }}>
                  <img src={IMAGES[e.image]} alt={e.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s" }} />
                  <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg, transparent 30%, rgba(44,36,32,0.55) 100%)` }} />
                  {getStatus(e) === "ongoing" && (
                    <div style={{ position:"absolute", top:10, left:10, background:T.rose, color:"#fff", fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:20, display:"flex", alignItems:"center", gap:4 }}>
                      <span style={{ width:5, height:5, borderRadius:"50%", background:"#fff", animation:"pulse 1s infinite", display:"inline-block" }} />LIVE
                    </div>
                  )}
                  <div style={{ position:"absolute", top:10, right:10, background:"rgba(255,255,255,0.90)", color:e.price===0?"#7AA88C":T.text, fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:8 }}>
                    {e.price===0?"FREE":`₹${e.price}`}
                  </div>
                  <div style={{ position:"absolute", bottom:10, left:10, background:e.accent, color:"#fff", fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:20 }}>{e.category}</div>
                </div>
                <div style={{ padding:"13px 15px", background:"transparent" }}>
                  <div style={{ fontWeight:600, fontSize:13, color:T.text, marginBottom:3, lineHeight:1.35 }}>{e.title}</div>
                  <div style={{ fontSize:11, color:T.textMute }}>📅 {fmtDate(e.startDate)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Strip */}
        <div style={{ width:"100%", maxWidth:1100, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(230px,1fr))", gap:16, animation:"fadeUp 1s ease 0.6s both", padding:"0 20px" }}>
          {[
            { icon:"🎟️", title:"Instant QR Tickets", desc:"Register and get a unique QR ticket in seconds.", color:T.rose },
            { icon:"📊", title:"Live Seat Tracker", desc:"Real-time capacity bars so you never miss out.", color:T.lavender },
            { icon:"💳", title:"Razorpay Payments", desc:"Secure test-mode payments, UPI, cards, wallets.", color:T.sage },
            { icon:"📱", title:"Mobile First", desc:"Designed to work beautifully on every screen.", color:T.sky },
          ].map((f,i)=>(
            <div key={f.title} className="card-glass" style={{
              borderRadius:T.radius, padding:"24px 20px", textAlign:"left",
              boxShadow:T.shadow, animation:`fadeUp 0.5s ease ${0.1+i*0.08}s both`
            }}>
              <div style={{ fontSize:30, marginBottom:12 }}>{f.icon}</div>
              <div style={{ fontFamily:"'Playfair Display', serif", fontWeight:600, fontSize:16, color:T.text, marginBottom:7 }}>{f.title}</div>
              <div style={{ fontSize:13, color:T.textMid, lineHeight:1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* CTA Band */}
        <div style={{ width:"100%", marginTop:80, padding:"52px 24px",
          background:`linear-gradient(135deg, rgba(212,116,138,0.09), rgba(155,143,212,0.09), rgba(122,168,140,0.07))`,
          borderTop:`1px solid ${T.border}`, borderBottom:`1px solid ${T.border}`,
          backdropFilter:"blur(10px)" }}>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(26px,4vw,44px)", fontWeight:700, marginBottom:12, color:T.text }}>
            Ready to join the <em style={{ color:T.rose, fontStyle:"italic" }}>fun?</em>
          </h2>
          <p style={{ color:T.textMid, marginBottom:28, fontSize:15 }}>30+ events this summer. Tech, culture, sports, music, and more.</p>
          <button className="btn-press" onClick={onSignup} style={{
            background:`linear-gradient(135deg,${T.rose},${T.lavender})`, border:"none", color:"#fff",
            padding:"15px 44px", borderRadius:50, fontSize:15, fontWeight:600,
            boxShadow:`0 12px 32px rgba(212,116,138,0.32)`
          }}>Get Started Free →</button>
        </div>

        {/* Footer */}
        <div style={{ marginTop:40, fontSize:12, color:T.textMute }}>
          ✦ EventHive © 2025 · Built with React + Firebase + Razorpay
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   AUTH PAGE
───────────────────────────────────────────────────────── */
function AuthPage({ mode, setMode, onLogin, onBack }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const ADMIN = { email:"admin@eventhive.com", password:"admin123" };
  const accent = mode === "signup" ? T.lavender : T.rose;

  const handleSubmit = () => {
    if (!email || !password) { setErr("Please fill all fields."); return; }
    if (mode === "signup" && !name) { setErr("Enter your name."); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (role === "admin") {
        if (email === ADMIN.email && password === ADMIN.password) onLogin("admin","Admin","admin@eventhive.com");
        else { setErr("Invalid admin credentials."); }
      } else {
        onLogin("user", mode==="signup" ? name : email.split("@")[0], email);
      }
    }, 900);
  };

  const inputSt = {
    background:"rgba(255,255,255,0.72)", border:`1.5px solid ${T.border}`,
    color:T.text, padding:"13px 17px", borderRadius:T.radiusSm, fontSize:14, width:"100%",
    transition:"all 0.2s", backdropFilter:"blur(8px)"
  };

  return (
    <div style={{ minHeight:"100vh", display:"flex", background:T.bg, position:"relative", overflow:"hidden" }}>
      {/* BG blobs */}
      <div style={{ position:"fixed", inset:0,
        background:`radial-gradient(ellipse at 20% 40%, rgba(212,116,138,0.13), transparent 55%),
                    radial-gradient(ellipse at 80% 20%, rgba(155,143,212,0.12), transparent 45%),
                    radial-gradient(ellipse at 60% 85%, rgba(122,168,140,0.10), transparent 40%),
                    #FAF7F4` }} />

      {/* Left Panel */}
      <div style={{ flex:"0 0 auto", width:"min(520px,100%)", padding:"48px 52px", position:"relative", zIndex:5, display:"flex", flexDirection:"column", justifyContent:"center" }}>
        <button onClick={onBack} className="btn-press" style={{ background:T.bgCard, border:`1.5px solid ${T.border}`, color:T.textMid, padding:"8px 18px", borderRadius:50, fontSize:13, marginBottom:44, alignSelf:"flex-start", backdropFilter:"blur(12px)" }}>
          ← Back
        </button>

        <div style={{ fontFamily:"'Playfair Display', serif", fontSize:22, fontWeight:700, color:T.text, marginBottom:10 }}>
          <span style={{ color:T.rose }}>✦</span> EventHive
        </div>
        <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(26px,4vw,38px)", fontWeight:700, marginBottom:8, color:T.text, lineHeight:1.15, letterSpacing:"-1px" }}>
          {mode==="login" ? "Welcome back 👋" : "Join the fun 🌸"}
        </h2>
        <p style={{ color:T.textMid, marginBottom:32, fontSize:15, lineHeight:1.7 }}>
          {mode==="login" ? "Login to access your tickets and events." : "Create your free account in seconds."}
        </p>

        {/* Role Toggle */}
        <div style={{ display:"flex", background:"rgba(255,255,255,0.55)", border:`1.5px solid ${T.border}`, borderRadius:T.radiusSm, padding:4, marginBottom:22, gap:4, backdropFilter:"blur(10px)" }}>
          {[["user","🙋 Student"],["admin","👑 Admin"]].map(([r,l])=>(
            <button key={r} onClick={()=>{ setRole(r); setErr(""); }} className="btn-press" style={{
              flex:1, padding:"10px", borderRadius:9, border:"none", fontSize:13, fontWeight:600,
              background: role===r ? `linear-gradient(135deg,${accent},${T.sage})` : "transparent",
              color: role===r ? "#fff" : T.textMute, transition:"all 0.25s"
            }}>{l}</button>
          ))}
        </div>

        <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
          {mode==="signup" && role==="user" && (
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" style={inputSt}
              onFocus={e=>e.target.style.borderColor=accent} onBlur={e=>e.target.style.borderColor=T.border} />
          )}
          <input value={email} onChange={e=>setEmail(e.target.value)} placeholder={role==="admin"?"admin@eventhive.com":"College email"} type="email" style={inputSt}
            onFocus={e=>e.target.style.borderColor=accent} onBlur={e=>e.target.style.borderColor=T.border} />
          <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" style={inputSt}
            onFocus={e=>e.target.style.borderColor=accent} onBlur={e=>e.target.style.borderColor=T.border} />

          {role==="admin" && (
            <div style={{ background:"rgba(155,143,212,0.09)", border:`1px solid rgba(155,143,212,0.22)`, borderRadius:10, padding:"10px 14px", fontSize:12, color:T.textMid, fontFamily:"'DM Mono', monospace" }}>
              Demo → admin@eventhive.com / admin123
            </div>
          )}

          {err && (
            <div style={{ background:"rgba(212,116,138,0.08)", border:`1px solid rgba(212,116,138,0.25)`, borderRadius:10, padding:"10px 14px", color:T.rose, fontSize:13 }}>
              ⚠ {err}
            </div>
          )}

          <button className="btn-press" onClick={handleSubmit} disabled={loading} style={{
            background:`linear-gradient(135deg,${accent},${T.lavender})`, border:"none", color:"#fff",
            padding:"14px", borderRadius:T.radiusSm, fontSize:14, fontWeight:600, marginTop:4,
            boxShadow:`0 10px 28px rgba(155,143,212,0.30)`, opacity:loading?0.75:1,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8
          }}>
            {loading ? (
              <>
                <span style={{ width:15, height:15, border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} />
                Signing in...
              </>
            ) : mode==="login" ? "Login →" : "Create Account →"}
          </button>
        </div>

        <p style={{ textAlign:"center", marginTop:22, color:T.textMid, fontSize:13 }}>
          {mode==="login" ? "No account? " : "Already a member? "}
          <span style={{ color:accent, cursor:"pointer", fontWeight:600 }} onClick={()=>{ setMode(mode==="login"?"signup":"login"); setErr(""); }}>
            {mode==="login" ? "Sign up free" : "Login"}
          </span>
        </p>
      </div>

      {/* Right Panel */}
      <div style={{ flex:1, position:"relative", display:"flex", alignItems:"center", justifyContent:"center", overflow:"hidden", borderLeft:`1px solid ${T.border}` }}>
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, rgba(212,116,138,0.07), rgba(155,143,212,0.07), rgba(122,168,140,0.06))` }} />
        <div style={{ position:"relative", zIndex:2, padding:48, width:"100%", maxWidth:420 }}>
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ fontSize:60, marginBottom:12, animation:`float 4s ease-in-out infinite` }}>{mode==="login"?"🎟️":"🌸"}</div>
            <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:22, fontWeight:700, color:T.text, marginBottom:8 }}>
              {mode==="login" ? "Your Events Await" : "Join 5,000+ Students"}
            </h3>
            <p style={{ color:T.textMid, fontSize:14, lineHeight:1.75 }}>
              Tech fests, cultural nights, sports days, and workshops — all in one place.
            </p>
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {EVENTS_DATA.slice(0,5).map((e,i)=>(
              <div key={e.id} className="card-glass" style={{
                borderRadius:T.radius, padding:"13px 15px", display:"flex", alignItems:"center", gap:13,
                animation:`fadeUp 0.5s ease ${0.1+i*0.08}s both`, boxShadow:T.shadow
              }}>
                <img src={IMAGES[e.image]} alt={e.title} style={{ width:42, height:42, borderRadius:10, objectFit:"cover" }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:13, fontWeight:600, color:T.text, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{e.title}</div>
                  <div style={{ fontSize:11, color:T.textMute, marginTop:2 }}>📅 {fmtDate(e.startDate)}</div>
                </div>
                <div style={{ background:`${e.accent}22`, color:e.accent, fontSize:11, fontWeight:600, padding:"3px 10px", borderRadius:20, whiteSpace:"nowrap", border:`1px solid ${e.accent}40` }}>
                  {e.price===0?"FREE":`₹${e.price}`}
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop:18, display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" }}>
            {["🎨 Cultural","⚡ Tech","🏆 Sports","🎵 Music","💼 Career"].map(f=>(
              <span key={f} className="card-glass" style={{ borderRadius:50, padding:"5px 13px", fontSize:11, color:T.textMid }}>{f}</span>
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
      position:"fixed", top:0, left:0, right:0, zIndex:200, height:68,
      background: scrolled ? "rgba(250,247,244,0.94)" : "rgba(250,247,244,0.80)",
      backdropFilter:"blur(20px)",
      borderBottom:`1px solid ${T.border}`,
      display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 32px",
      transition:"all 0.3s"
    }}>
      <div style={{ fontFamily:"'Playfair Display', serif", fontSize:21, fontWeight:700, cursor:"pointer", color:T.text, letterSpacing:"-0.5px" }}
        onClick={()=>setPage("events")}>
        <span style={{ color:T.rose }}>✦</span> EventHive
      </div>

      <div style={{ display:"flex", gap:4 }}>
        {navItems.map(item=>(
          <button key={item.key} onClick={()=>setPage(item.key)} className="btn-press" style={{
            background: page===item.key ? `rgba(212,116,138,0.10)` : "transparent",
            border: page===item.key ? `1.5px solid rgba(212,116,138,0.28)` : "1.5px solid transparent",
            color: page===item.key ? T.rose : T.textMid,
            padding:"7px 17px", borderRadius:50, fontSize:13, fontWeight:500, transition:"all 0.2s"
          }}>
            {item.icon} {item.label}
          </button>
        ))}
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:9 }}>
          <div style={{ width:33, height:33, borderRadius:"50%", background:`linear-gradient(135deg,${T.rose},${T.lavender})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, fontWeight:700, color:"#fff" }}>
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{user.name}</div>
            <div style={{ fontSize:10, color: user.role==="admin" ? T.lavender : T.textMute }}>
              {user.role==="admin" ? "👑 Admin" : "🎓 Student"}
            </div>
          </div>
        </div>
        <button onClick={onLogout} className="btn-press" style={{ background:T.bgCard, border:`1.5px solid ${T.border}`, color:T.textMid, padding:"7px 14px", borderRadius:10, fontSize:12, backdropFilter:"blur(12px)" }}>Logout</button>
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

  const pillBtn = (active, onClick, children, color=T.rose) => (
    <button onClick={onClick} className="btn-press" style={{
      background: active ? `rgba(${hexToRgb(color)},0.12)` : T.bgCard,
      border: `1.5px solid ${active ? `rgba(${hexToRgb(color)},0.35)` : T.border}`,
      color: active ? color : T.textMid,
      padding:"8px 18px", borderRadius:50, fontSize:13, fontWeight:500,
      backdropFilter:"blur(12px)", transition:"all 0.2s", whiteSpace:"nowrap"
    }}>{children}</button>
  );

  return (
    <div style={{ maxWidth:1320, margin:"0 auto", padding:"36px 24px" }}>
      {/* Header */}
      <div style={{ marginBottom:30, animation:"fadeUp 0.5s ease" }}>
        <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(30px,5vw,48px)", fontWeight:700, color:T.text, marginBottom:10, letterSpacing:"-1.5px" }}>
          Discover Events
          <span style={{ marginLeft:10, fontSize:"0.7em" }}>✨</span>
        </h1>
        <div style={{ display:"flex", gap:14, alignItems:"center", flexWrap:"wrap" }}>
          <p style={{ color:T.textMid, fontSize:15 }}>June · July · August 2025</p>
          <div style={{ display:"flex", gap:8 }}>
            <span style={{ background:"rgba(212,116,138,0.10)", border:`1px solid rgba(212,116,138,0.25)`, color:T.rose, fontSize:12, fontWeight:500, padding:"4px 12px", borderRadius:50, display:"flex", alignItems:"center", gap:4 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:T.rose, animation:"pulse 1s infinite", display:"inline-block" }} />
              {ongoingCount} Live
            </span>
            <span style={{ background:"rgba(122,168,140,0.10)", border:`1px solid rgba(122,168,140,0.25)`, color:T.sage, fontSize:12, fontWeight:500, padding:"4px 12px", borderRadius:50 }}>
              ⏰ {upcomingCount} Upcoming
            </span>
          </div>
        </div>
      </div>

      {/* Status Pills */}
      <div style={{ display:"flex", gap:8, marginBottom:16, flexWrap:"wrap" }}>
        {pillBtn(statusFilter==="all", ()=>setStatusFilter("all"), "All Events", T.textMid)}
        {pillBtn(statusFilter==="ongoing", ()=>setStatusFilter("ongoing"), "🔴 Live Now", T.rose)}
        {pillBtn(statusFilter==="upcoming", ()=>setStatusFilter("upcoming"), "⏰ Upcoming", T.sage)}
      </div>

      {/* Search + Sort */}
      <div style={{ display:"flex", gap:12, marginBottom:16, flexWrap:"wrap" }}>
        <div style={{ flex:1, minWidth:200, position:"relative" }}>
          <span style={{ position:"absolute", left:15, top:"50%", transform:"translateY(-50%)", fontSize:15, pointerEvents:"none", color:T.textMute }}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search events, tags, categories..."
            style={{ background:T.bgCard, border:`1.5px solid ${T.border}`, color:T.text, padding:"12px 15px 12px 42px", borderRadius:T.radiusSm, fontSize:13, width:"100%", transition:"border 0.2s", backdropFilter:"blur(12px)" }}
            onFocus={e=>e.target.style.borderColor=T.rose} onBlur={e=>e.target.style.borderColor=T.border} />
        </div>
        <select value={sort} onChange={e=>setSort(e.target.value)} style={{ background:T.bgCard, border:`1.5px solid ${T.border}`, color:T.text, padding:"12px 16px", borderRadius:T.radiusSm, fontSize:13, cursor:"pointer", minWidth:180, backdropFilter:"blur(12px)" }}>
          <option value="date-asc">📅 Earliest First</option>
          <option value="date-desc">📅 Latest First</option>
          <option value="price-asc">💰 Price: Low → High</option>
          <option value="price-desc">💰 Price: High → Low</option>
          <option value="name">🔤 Name A–Z</option>
        </select>
      </div>

      {/* Category Pills */}
      <div style={{ display:"flex", gap:8, marginBottom:28, overflowX:"auto", paddingBottom:4, flexWrap:"wrap" }}>
        {CATEGORIES.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className="btn-press" style={{
            background: cat===c ? `linear-gradient(135deg,${T.rose},${T.lavender})` : T.bgCard,
            border:`1.5px solid ${cat===c?"transparent":T.border}`,
            color: cat===c ? "#fff" : T.textMid,
            padding:"7px 18px", borderRadius:50, fontSize:12, fontWeight:500, whiteSpace:"nowrap",
            backdropFilter:"blur(12px)", transition:"all 0.2s"
          }}>{c}</button>
        ))}
      </div>

      <p style={{ color:T.textMute, fontSize:13, marginBottom:20 }}>{filtered.length} event{filtered.length!==1?"s":""} found</p>

      {filtered.length === 0 ? (
        <div style={{ textAlign:"center", padding:"100px 0", color:T.textMute }}>
          <div style={{ fontSize:60, marginBottom:16 }}>🔍</div>
          <p style={{ fontSize:17 }}>No events found. Try different filters.</p>
        </div>
      ) : (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(300px, 1fr))", gap:22 }}>
          {filtered.map((e,i)=> <EventCard key={e.id} event={e} idx={i} onClick={()=>onSelect(e)} />)}
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

function EventCard({ event:e, idx, onClick }) {
  const status = getStatus(e);
  const pct = slotsPct(e);
  const slots = e.capacity - e.registered;
  const dur = getDuration(e);
  const cd = getCountdown(e.startDate);
  const [hovered, setHovered] = useState(false);

  return (
    <div className="card-glass" onClick={onClick}
      onMouseEnter={()=>setHovered(true)} onMouseLeave={()=>setHovered(false)}
      style={{ borderRadius:T.radiusLg, overflow:"hidden", cursor:"pointer", animation:`fadeUp 0.45s ease ${idx*0.04}s both`, boxShadow:hovered?T.shadowMd:T.shadow,
        borderColor: hovered ? `${e.accent}50` : T.border }}>

      {/* Image */}
      <div style={{ position:"relative", height:200, overflow:"hidden" }}>
        <img src={IMAGES[e.image]} alt={e.title} style={{ width:"100%", height:"100%", objectFit:"cover", transition:"transform 0.5s", transform:hovered?"scale(1.07)":"scale(1)" }} />
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(180deg, transparent 40%, rgba(44,36,32,0.65) 100%)` }} />
        <div style={{ position:"absolute", inset:0, background:`${e.accent}20`, opacity:hovered?1:0.6, transition:"opacity 0.3s" }} />

        {status === "ongoing" && (
          <div style={{ position:"absolute", top:12, left:12, background:T.rose, color:"#fff", fontSize:10, fontWeight:700, padding:"4px 10px", borderRadius:20, display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ width:5, height:5, borderRadius:"50%", background:"#fff", animation:"pulse 1s infinite", display:"inline-block" }} />LIVE NOW
          </div>
        )}
        {dur > 1 && (
          <div style={{ position:"absolute", top:12, right:12, background:"rgba(255,255,255,0.88)", color:T.textMid, fontSize:10, fontWeight:600, padding:"4px 10px", borderRadius:20 }}>
            {dur}-Day Event
          </div>
        )}
        <div style={{ position:"absolute", bottom:12, left:12, background:e.accent, color:"#fff", fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20 }}>{e.category}</div>
        <div style={{ position:"absolute", bottom:12, right:12, background:"rgba(255,255,255,0.92)", color:e.price===0?T.sage:T.text, fontSize:14, fontWeight:700, padding:"3px 11px", borderRadius:9 }}>
          {e.price===0?"FREE":`₹${e.price}`}
        </div>
      </div>

      <div style={{ padding:"18px 20px" }}>
        <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:16, fontWeight:600, color:T.text, marginBottom:6, lineHeight:1.35 }}>{e.title}</h3>
        <p style={{ fontSize:12, color:T.textMid, lineHeight:1.65, marginBottom:12, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{e.description}</p>

        <div style={{ display:"flex", gap:12, fontSize:12, color:T.textMute, marginBottom:12, flexWrap:"wrap" }}>
          <span>📅 {fmtDate(e.startDate)}{dur>1?` – ${fmtDate(e.endDate)}`:""}</span>
          <span>📍 {e.venue.length>22?e.venue.slice(0,22)+"…":e.venue}</span>
        </div>

        {/* Tags */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:13 }}>
          {e.tags.slice(0,3).map(t=>(
            <span key={t} style={{ background:`${e.accent}15`, border:`1px solid ${e.accent}30`, color:e.accent, fontSize:10, fontWeight:600, padding:"2px 9px", borderRadius:50 }}>{t}</span>
          ))}
        </div>

        {/* Countdown */}
        {cd && status==="upcoming" && (
          <div className="card-glass" style={{ borderRadius:9, padding:"7px 11px", marginBottom:11, fontSize:11, color:T.peach, fontWeight:600 }}>
            ⏳ Starts in {cd.days}d {cd.hrs}h
          </div>
        )}

        {/* Capacity bar */}
        <div style={{ marginBottom:14 }}>
          <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.textMute, marginBottom:5 }}>
            <span>{e.registered} registered</span>
            <span style={{ color: slots<=0?"#D47A8A":slots<=10?T.peach:T.sage, fontWeight:600 }}>
              {slots<=0?"Sold Out!":slots<=10?`⚠ ${slots} left`:`${slots} seats left`}
            </span>
          </div>
          <div style={{ height:4, background:"rgba(100,70,60,0.09)", borderRadius:3, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${e.accent},${e.accent}aa)`, borderRadius:3, transition:"width 0.6s ease" }} />
          </div>
        </div>

        <button className="btn-press" style={{ width:"100%", background:`linear-gradient(135deg,${e.accent},${e.accent}bb)`, border:"none", color:"#fff", padding:"11px", borderRadius:T.radiusSm, fontSize:12, fontWeight:600, letterSpacing:"0.3px" }}>
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

  const handleRegister = () => {
    if (alreadyRegistered || slots <= 0) return;
    setPaying(true);
    setTimeout(() => { setPaying(false); onRegister(e); }, 1400);
  };

  return (
    <div style={{ maxWidth:1000, margin:"0 auto", padding:"32px 24px", animation:"fadeUp 0.4s ease" }}>
      <button onClick={onBack} className="btn-press" style={{ background:T.bgCard, border:`1.5px solid ${T.border}`, color:T.textMid, padding:"8px 18px", borderRadius:50, fontSize:13, marginBottom:26, display:"flex", alignItems:"center", gap:6, backdropFilter:"blur(12px)" }}>
        ← Back to Events
      </button>

      {/* Hero Image */}
      <div style={{ position:"relative", borderRadius:T.radiusLg, overflow:"hidden", height:"clamp(200px,35vw,400px)", marginBottom:30 }}>
        <img src={IMAGES[e.image]} alt={e.title} style={{ width:"100%", height:"100%", objectFit:"cover" }} />
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg, ${e.accent}44, rgba(44,36,32,0.35))` }} />
        <div style={{ position:"absolute", inset:0, background:"linear-gradient(180deg, transparent 40%, rgba(44,36,32,0.75) 100%)" }} />
        {status==="ongoing" && (
          <div style={{ position:"absolute", top:18, left:18, background:T.rose, color:"#fff", fontSize:12, fontWeight:700, padding:"5px 13px", borderRadius:20, display:"flex", alignItems:"center", gap:5 }}>
            <span style={{ width:7, height:7, borderRadius:"50%", background:"#fff", animation:"pulse 1s infinite", display:"inline-block" }} />LIVE NOW
          </div>
        )}
        <div style={{ position:"absolute", bottom:22, left:26 }}>
          <div style={{ background:e.accent, color:"#fff", fontSize:11, fontWeight:700, padding:"4px 11px", borderRadius:20, marginBottom:9, display:"inline-block" }}>{e.category}</div>
          <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(22px,4vw,40px)", fontWeight:700, color:"#fff", lineHeight:1.15, letterSpacing:"-1px" }}>{e.title}</h1>
        </div>
        {dur>1 && (
          <div style={{ position:"absolute", top:18, right:18, background:"rgba(255,255,255,0.85)", color:T.textMid, fontSize:11, fontWeight:600, padding:"5px 13px", borderRadius:20 }}>
            {dur}-Day Event
          </div>
        )}
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr auto", gap:28, alignItems:"start" }}>
        <div>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:20, fontWeight:700, color:T.text, marginBottom:12, letterSpacing:"-0.5px" }}>About this Event</h2>
          <p style={{ color:T.textMid, lineHeight:1.85, fontSize:15, marginBottom:24 }}>{e.description}</p>

          {/* Tags */}
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24 }}>
            {e.tags.map(t=>(
              <span key={t} style={{ background:`${e.accent}14`, border:`1px solid ${e.accent}30`, color:e.accent, fontSize:12, fontWeight:600, padding:"5px 13px", borderRadius:50 }}>{t}</span>
            ))}
          </div>

          {/* Info Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:11 }}>
            {[
              ["📅 Date", fmtDate(e.startDate) + (dur>1?` – ${fmtDate(e.endDate)}`:"")],
              ["⏰ Time", e.time],
              ["📍 Venue", e.venue],
              ["💰 Price", e.price===0?"FREE":`₹${e.price}`],
              ["🎯 Capacity", `${e.capacity} seats`],
              ["⏳ Duration", `${dur} day${dur>1?"s":""}`],
            ].map(([k,v])=>(
              <div key={k} className="card-glass" style={{ borderRadius:T.radiusSm, padding:"13px 15px", boxShadow:"0 2px 12px rgba(100,70,60,0.07)" }}>
                <div style={{ fontSize:11, color:T.textMute, marginBottom:4, fontWeight:500 }}>{k}</div>
                <div style={{ fontSize:14, fontWeight:600, color:T.text }}>{v}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Registration Card */}
        <div className="card-glass" style={{ width:270, flexShrink:0, borderRadius:T.radiusLg, padding:22, position:"sticky", top:92, boxShadow:T.shadowMd, border:`1.5px solid ${e.accent}30` }}>
          <div style={{ textAlign:"center", marginBottom:18 }}>
            <div style={{ fontFamily:"'Playfair Display', serif", fontSize:34, fontWeight:700, color:e.price===0?T.sage:T.text }}>
              {e.price===0?"FREE":`₹${e.price}`}
            </div>
            <div style={{ fontSize:12, color:T.textMute, marginTop:2 }}>per person</div>
          </div>

          {/* Capacity */}
          <div style={{ marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:T.textMute, marginBottom:5 }}>
              <span>{e.registered}/{e.capacity} registered</span>
              <span style={{ fontWeight:700, color:pct>=90?"#D47A8A":pct>=70?T.peach:T.sage }}>{pct}% full</span>
            </div>
            <div style={{ height:5, background:"rgba(100,70,60,0.09)", borderRadius:3 }}>
              <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${e.accent},${e.accent}88)`, borderRadius:3 }} />
            </div>
            <div style={{ fontSize:11, marginTop:5, color:slots<=5?"#D47A8A":slots<=20?T.peach:T.textMute }}>
              {slots<=0?"❌ Sold Out":slots<=5?`⚠ Only ${slots} seats left!`:slots<=20?`⚠ ${slots} seats left`:`✓ ${slots} seats available`}
            </div>
          </div>

          {/* Countdown */}
          {cd && (
            <div className="card-glass" style={{ borderRadius:T.radiusSm, padding:"9px 13px", marginBottom:14, textAlign:"center", fontSize:12, color:T.peach, fontWeight:600 }}>
              ⏳ Starts in {cd.days}d {cd.hrs}h
            </div>
          )}

          <button className="btn-press" onClick={handleRegister} disabled={alreadyRegistered || slots<=0 || paying} style={{
            width:"100%", border:"none", color:"#fff", padding:"14px", borderRadius:T.radiusSm, fontSize:14, fontWeight:600,
            background: alreadyRegistered ? `rgba(122,168,140,0.25)` : slots<=0 ? "rgba(150,140,130,0.25)" : `linear-gradient(135deg,${e.accent},${T.lavender})`,
            borderColor: alreadyRegistered ? T.sage : "transparent", borderWidth:1.5, borderStyle:"solid",
            cursor: alreadyRegistered || slots<=0 ? "not-allowed" : "pointer",
            boxShadow: alreadyRegistered || slots<=0 ? "none" : `0 10px 28px ${e.accent}40`,
            display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            color: alreadyRegistered ? T.sage : "#fff"
          }}>
            {paying ? (
              <><span style={{ width:15, height:15, border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} />Processing...</>
            ) : alreadyRegistered ? "✓ Already Registered" : slots<=0 ? "Sold Out" : e.price===0?"Register Free →":"Pay & Register →"}
          </button>

          {user.role==="admin" && (
            <p style={{ textAlign:"center", fontSize:11, color:T.textMute, marginTop:9 }}>👑 Admin view — cannot register</p>
          )}

          <div style={{ marginTop:18, display:"flex", flexDirection:"column", gap:6 }}>
            {["🎟️ Instant QR ticket","📧 Email confirmation","💳 Secure payment"].map(f=>(
              <div key={f} style={{ fontSize:12, color:T.textMute }}>{f}</div>
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
      <div style={{ fontSize:72, marginBottom:18, animation:`float 3s ease-in-out infinite` }}>🎟️</div>
      <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:30, fontWeight:700, color:T.text, marginBottom:10, letterSpacing:"-1px" }}>No Tickets Yet</h2>
      <p style={{ color:T.textMid, fontSize:15, marginBottom:28, lineHeight:1.7 }}>Register for events to get your QR tickets here.</p>
      <button className="btn-press" onClick={()=>setPage("events")} style={{ background:`linear-gradient(135deg,${T.rose},${T.lavender})`, border:"none", color:"#fff", padding:"13px 34px", borderRadius:50, fontSize:14, fontWeight:600, boxShadow:`0 10px 28px rgba(212,116,138,0.28)` }}>Browse Events →</button>
    </div>
  );

  return (
    <div style={{ maxWidth:900, margin:"0 auto", padding:"32px 24px" }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:38, fontWeight:700, color:T.text, marginBottom:6, letterSpacing:"-1.5px" }}>My Tickets 🎟️</h1>
        <p style={{ color:T.textMid, fontSize:14 }}>{tickets.length} ticket{tickets.length!==1?"s":""} · Tap any to view QR code</p>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))", gap:18 }}>
        {tickets.map((tk,i)=>(
          <div key={tk.id} className="ticket-lift card-glass" onClick={()=>onOpen(tk)} style={{ borderRadius:T.radiusLg, overflow:"hidden", cursor:"pointer", animation:`fadeUp 0.45s ease ${i*0.07}s both`, boxShadow:T.shadow }}>
            <div style={{ background:`linear-gradient(135deg,${tk.event.accent},${tk.event.accent}99)`, padding:"20px 20px 16px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", right:-18, top:-18, width:100, height:100, borderRadius:"50%", background:"rgba(255,255,255,0.14)" }} />
              <div style={{ fontSize:10, color:"rgba(255,255,255,0.72)", fontWeight:600, letterSpacing:1.2, marginBottom:4 }}>🎟️ EVENT TICKET</div>
              <div style={{ fontFamily:"'Playfair Display', serif", fontSize:17, fontWeight:700, color:"#fff", lineHeight:1.25, marginBottom:3 }}>{tk.event.title}</div>
              <div style={{ fontSize:11, color:"rgba(255,255,255,0.70)" }}>{tk.event.category}</div>
            </div>
            <div style={{ height:"2px", background:`repeating-linear-gradient(90deg,${tk.event.accent} 0,${tk.event.accent} 7px,transparent 7px,transparent 14px)`, opacity:0.3 }} />
            <div style={{ padding:"14px 20px", background:"transparent" }}>
              {[["📅", fmtDateLong(tk.event.startDate)],["📍", tk.event.venue],["🔖", tk.id]].map(([ic,v])=>(
                <div key={v} style={{ display:"flex", gap:9, alignItems:"flex-start", fontSize:12, color:T.textMid, marginBottom:7 }}>
                  <span style={{ flexShrink:0 }}>{ic}</span>
                  <span style={{ fontFamily:ic==="🔖"?"'DM Mono',monospace":"inherit", fontSize:ic==="🔖"?11:12 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ padding:"8px 20px 14px", fontSize:12, color:tk.event.accent, fontWeight:600 }}>
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
    { label:"Total Events", value:events.length, icon:"🎪", color:T.lavender },
    { label:"Live Now", value:ongoing, icon:"🔴", color:T.rose },
    { label:"Upcoming", value:upcoming, icon:"⏰", color:T.sage },
    { label:"Total Registrations", value:totalReg.toLocaleString(), icon:"👥", color:T.peach },
    { label:"Revenue (Test)", value:`₹${totalRev.toLocaleString()}`, icon:"💰", color:"#D4A86A" },
    { label:"Avg Fill Rate", value:`${avgFill}%`, icon:"📊", color:T.sky },
  ];

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
      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:16 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display', serif", fontSize:"clamp(26px,4vw,40px)", fontWeight:700, color:T.text, marginBottom:4, letterSpacing:"-1px" }}>Admin Dashboard 👑</h1>
          <p style={{ color:T.textMid, fontSize:14 }}>Full overview — events, registrations, and revenue.</p>
        </div>
        <button className="btn-press" onClick={exportCSV} style={{ background:T.bgCard, border:`1.5px solid ${T.border}`, color:T.textMid, padding:"9px 20px", borderRadius:T.radiusSm, fontSize:13, fontWeight:500, display:"flex", alignItems:"center", gap:7, backdropFilter:"blur(12px)" }}>
          📤 Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(170px,1fr))", gap:14, marginBottom:28 }}>
        {statCards.map((s,i)=>(
          <div key={s.label} className="card-glass" style={{ borderRadius:T.radius, padding:"18px 16px", animation:`fadeUp 0.4s ease ${i*0.06}s both`, boxShadow:T.shadow, borderColor:`${s.color}30` }}>
            <div style={{ fontSize:26, marginBottom:9 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Playfair Display', serif", fontSize:28, fontWeight:700, color:s.color }}>{s.value}</div>
            <div style={{ fontSize:12, color:T.textMid, marginTop:3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:22, background:T.bgCard, border:`1.5px solid ${T.border}`, borderRadius:T.radiusSm, padding:4, alignSelf:"start", width:"fit-content", backdropFilter:"blur(12px)" }}>
        {[["overview","📊 Overview"],["events","🎪 All Events"]].map(([k,l])=>(
          <button key={k} onClick={()=>setTab(k)} className="btn-press" style={{
            padding:"8px 18px", borderRadius:9, border:"none", fontSize:13, fontWeight:500,
            background: tab===k ? `linear-gradient(135deg,${T.rose},${T.lavender})` : "transparent",
            color: tab===k ? "#fff" : T.textMid, transition:"all 0.2s"
          }}>{l}</button>
        ))}
      </div>

      {tab === "overview" && (
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:18 }}>
          <div className="card-glass" style={{ borderRadius:T.radiusLg, padding:22, animation:"fadeUp 0.4s ease", boxShadow:T.shadow }}>
            <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:17, fontWeight:600, color:T.text, marginBottom:18, letterSpacing:"-0.5px" }}>Top Categories by Registrations</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:13 }}>
              {topCats.map(([cat,count])=>{
                const ev = events.find(e=>e.category===cat);
                const color = ev?.accent||T.rose;
                return (
                  <div key={cat}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:5 }}>
                      <span style={{ color:T.textMid, fontWeight:500 }}>{cat}</span>
                      <span style={{ color, fontWeight:700 }}>{count.toLocaleString()}</span>
                    </div>
                    <div style={{ height:5, background:"rgba(100,70,60,0.08)", borderRadius:3 }}>
                      <div style={{ height:"100%", width:`${(count/maxCat)*100}%`, background:`linear-gradient(90deg,${color},${color}77)`, borderRadius:3, transition:"width 0.8s ease" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="card-glass" style={{ borderRadius:T.radiusLg, padding:22, animation:"fadeUp 0.4s ease 0.1s", boxShadow:T.shadow }}>
            <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:17, fontWeight:600, color:T.text, marginBottom:18, letterSpacing:"-0.5px" }}>Revenue Breakdown (Test Mode)</h3>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {events.filter(e=>e.price>0).sort((a,b)=>(b.price*b.registered)-(a.price*a.registered)).slice(0,6).map(e=>(
                <div key={e.id} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 13px", background:"rgba(255,255,255,0.50)", borderRadius:T.radiusSm, border:`1px solid ${T.border}` }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:600, color:T.text }}>{e.title.slice(0,24)}{e.title.length>24?"…":""}</div>
                    <div style={{ fontSize:11, color:T.textMute }}>{e.registered} × ₹{e.price}</div>
                  </div>
                  <div style={{ fontFamily:"'Playfair Display', serif", fontSize:15, fontWeight:700, color:"#D4A86A" }}>₹{(e.price*e.registered).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === "events" && (
        <div className="card-glass" style={{ borderRadius:T.radiusLg, overflow:"auto", animation:"fadeUp 0.4s ease", boxShadow:T.shadow }}>
          <table style={{ width:"100%", borderCollapse:"collapse", minWidth:850 }}>
            <thead>
              <tr style={{ background:"rgba(250,247,244,0.7)" }}>
                {["Event","Category","Dates","Status","Fill Rate","Revenue","Seats Left"].map(h=>(
                  <th key={h} style={{ padding:"13px 15px", textAlign:"left", fontSize:10, fontWeight:700, color:T.textMute, textTransform:"uppercase", letterSpacing:1.2, borderBottom:`1px solid ${T.border}`, whiteSpace:"nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {events.map(e=>{
                const status = getStatus(e);
                const pct = slotsPct(e);
                const slots = e.capacity - e.registered;
                return (
                  <tr key={e.id} style={{ borderBottom:`1px solid ${T.border}`, transition:"background 0.2s" }}
                    onMouseEnter={ev=>ev.currentTarget.style.background="rgba(255,255,255,0.50)"}
                    onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
                    <td style={{ padding:"13px 15px" }}>
                      <div style={{ fontWeight:600, color:T.text, fontSize:13 }}>{e.title}</div>
                      <div style={{ fontSize:10, color:T.textMute }}>{getDuration(e)}-day · {e.venue.slice(0,22)}</div>
                    </td>
                    <td style={{ padding:"13px 15px" }}>
                      <span style={{ background:`${e.accent}18`, border:`1px solid ${e.accent}35`, color:e.accent, fontSize:10, padding:"2px 9px", borderRadius:20, fontWeight:700 }}>{e.category}</span>
                    </td>
                    <td style={{ padding:"13px 15px", fontSize:12, color:T.textMid, whiteSpace:"nowrap" }}>
                      {fmtDate(e.startDate)}{getDuration(e)>1?` – ${fmtDate(e.endDate)}`:""}</td>
                    <td style={{ padding:"13px 15px" }}>
                      <span style={{ background:status==="ongoing"?"rgba(212,116,138,0.12)":"rgba(122,168,140,0.12)", color:status==="ongoing"?T.rose:T.sage, fontSize:10, padding:"3px 10px", borderRadius:20, fontWeight:700 }}>
                        {status==="ongoing"?"🔴 LIVE":"⏰ Upcoming"}
                      </span>
                    </td>
                    <td style={{ padding:"13px 15px", minWidth:130 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <div style={{ flex:1, height:4, background:"rgba(100,70,60,0.08)", borderRadius:3 }}>
                          <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${e.accent},${e.accent}77)`, borderRadius:3 }} />
                        </div>
                        <span style={{ fontSize:11, color:T.textMute, minWidth:28 }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ padding:"13px 15px", fontFamily:"'Playfair Display', serif", fontSize:14, fontWeight:700, color:"#D4A86A" }}>
                      {e.price===0?"—":`₹${(e.price*e.registered).toLocaleString()}`}
                    </td>
                    <td style={{ padding:"13px 15px", fontSize:12, fontWeight:700, color:slots<=0?"#D47A8A":slots<=10?T.peach:T.sage }}>
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
    <div onClick={onClose} style={{ position:"fixed", inset:0, background:"rgba(44,36,32,0.45)", backdropFilter:"blur(16px)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1000, padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{
        background:"rgba(255,253,250,0.96)", backdropFilter:"blur(24px)",
        border:`1.5px solid ${T.border}`, borderRadius:T.radiusLg,
        width:"100%", maxWidth:390, overflow:"hidden",
        boxShadow:"0 48px 100px rgba(44,36,32,0.28)", animation:"fadeUp 0.35s cubic-bezier(.34,1.56,.64,1)"
      }}>

        {/* Header */}
        <div style={{ background:`linear-gradient(135deg,${tk.event.accent},${tk.event.accent}99)`, padding:"24px 24px 18px", position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", right:-24, top:-24, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.15)" }} />
          <div style={{ position:"absolute", left:-16, bottom:-36, width:90, height:90, borderRadius:"50%", background:"rgba(255,255,255,0.10)" }} />
          <button onClick={onClose} style={{ position:"absolute", top:13, right:13, background:"rgba(255,255,255,0.25)", border:"none", color:"#fff", width:27, height:27, borderRadius:"50%", cursor:"pointer", fontSize:13, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
          <div style={{ fontSize:10, color:"rgba(255,255,255,0.70)", fontWeight:700, letterSpacing:1.5, marginBottom:5 }}>🎟️ YOUR TICKET</div>
          <div style={{ fontFamily:"'Playfair Display', serif", fontSize:20, fontWeight:700, color:"#fff", marginBottom:3, lineHeight:1.25 }}>{tk.event.title}</div>
          <div style={{ fontSize:12, color:"rgba(255,255,255,0.70)" }}>{tk.event.venue} · {fmtDate(tk.event.startDate)}</div>
        </div>

        {/* Tear line */}
        <div style={{ height:2, background:`repeating-linear-gradient(90deg,${tk.event.accent} 0,${tk.event.accent} 7px,transparent 7px,transparent 14px)`, opacity:0.35 }} />

        <div style={{ padding:24 }}>
          {/* QR Code Display */}
          <div style={{ display:"flex", justifyContent:"center", marginBottom:14 }}>
            <div style={{ background:"#fff", padding:13, borderRadius:16, boxShadow:`0 0 0 4px ${tk.event.accent}25, ${T.shadow}` }}>
              <MiniQR value={tk.qrValue} size={158} />
            </div>
          </div>

          {/* QR Value label */}
          <div style={{ textAlign:"center", fontFamily:"'DM Mono', monospace", fontSize:12, fontWeight:500, color:T.textMid, marginBottom:3, letterSpacing:1.5 }}>{tk.id}</div>
          <p style={{ textAlign:"center", color:T.textMute, fontSize:11, marginBottom:20 }}>Show this QR at the event entrance</p>

          <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:16 }}>
            {[["📅 Date",fmtDateLong(tk.event.startDate)],["⏰ Time",tk.event.time],["💰 Paid",tk.event.price===0?"FREE":`₹${tk.event.price}`]].map(([k,v])=>(
              <div key={k} style={{ display:"flex", justifyContent:"space-between", fontSize:12, marginBottom:9 }}>
                <span style={{ color:T.textMute }}>{k}</span>
                <span style={{ color:T.text, fontWeight:600 }}>{v}</span>
              </div>
            ))}
          </div>

          <button className="btn-press" onClick={onClose} style={{ width:"100%", background:`linear-gradient(135deg,${tk.event.accent},${T.lavender})`, border:"none", color:"#fff", padding:"13px", borderRadius:T.radiusSm, fontSize:13, fontWeight:600, marginTop:10, boxShadow:`0 8px 24px ${tk.event.accent}35` }}>
            Done ✓
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Mini QR (visual mock — same hashing logic, new styling) ─── */
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
      {grid.map((row,r)=>row.map((on,c)=>on?<rect key={`${r}-${c}`} x={c*cell} y={r*cell} width={cell} height={cell} fill="#2C2420"/>:null))}
    </svg>
  );
}
