const express = require("express");
const router = express.Router();
const { admin, db } = require("../config/firebase");
const { authMiddleware, adminMiddleware } = require("../middleware/authMiddleware");

/* ── Seed data — mirrors the frontend EVENTS_DATA ── */
const SEED_EVENTS = [
  { id:"1",  title:"Technovate Summit",        category:"Tech",      startDate:"2025-06-07", endDate:"2025-06-09", time:"10:00 AM", venue:"Main Auditorium",      price:299,  capacity:200,  registered:178, tags:["Hackathon","AI","3 Days"],     image:"img_technovate",     description:"The biggest college tech summit. AI workshops, hackathon, and 50+ speakers over 3 epic days.", accent:"#FF6B35" },
  { id:"2",  title:"Utsav Cultural Fest",       category:"Cultural",  startDate:"2025-06-14", endDate:"2025-06-15", time:"5:00 PM",  venue:"Open Air Theatre",     price:149,  capacity:500,  registered:312, tags:["Music","Dance","2 Days"],      image:"img_cultural",       description:"Music, dance, art, and food from across India. A two-day celebration of culture and creativity.", accent:"#FF3CAC" },
  { id:"3",  title:"Startup Pitch Night",       category:"Business",  startDate:"2025-06-20", endDate:"2025-06-20", time:"6:00 PM",  venue:"Seminar Hall B",       price:0,    capacity:100,  registered:67,  tags:["Startups","Pitch","Free"],     image:"img_startup",        description:"Present your startup idea to investors and industry mentors. Get funded or get feedback.", accent:"#00D4AA" },
  { id:"4",  title:"Photography Workshop",      category:"Workshop",  startDate:"2025-06-25", endDate:"2025-06-25", time:"11:00 AM", venue:"Arts Block",           price:499,  capacity:40,   registered:38,  tags:["Photography","Hands-on"],      image:"img_photography",    description:"Hands-on photography and editing masterclass with professional photographers. Limited seats!", accent:"#FFBE0B" },
  { id:"5",  title:"E-Sports Championship",     category:"Gaming",    startDate:"2025-06-28", endDate:"2025-06-29", time:"12:00 PM", venue:"Computer Lab Complex", price:199,  capacity:64,   registered:48,  tags:["Gaming","BGMI","2 Days"],      image:"img_esports",        description:"Compete in BGMI, Valorant, and FIFA. Cash prizes worth ₹50,000 for winners.", accent:"#8B5CF6" },
  { id:"6",  title:"Career Fair 2025",          category:"Career",    startDate:"2025-07-04", endDate:"2025-07-05", time:"9:00 AM",  venue:"Campus Grounds",       price:0,    capacity:1000, registered:543, tags:["Jobs","Internships","Free"],   image:"img_career",         description:"Meet 60+ companies over 2 days. On-the-spot interviews and internship offers.", accent:"#3B82F6" },
  { id:"7",  title:"Robotics Expo",             category:"Tech",      startDate:"2025-07-07", endDate:"2025-07-09", time:"10:00 AM", venue:"Engineering Block",    price:399,  capacity:150,  registered:89,  tags:["Robotics","IoT","3 Days"],     image:"img_robotics",       description:"Build, program, and battle robots. Three days of cutting-edge robotics competition.", accent:"#06B6D4" },
  { id:"8",  title:"Hip-Hop Showdown",          category:"Cultural",  startDate:"2025-07-11", endDate:"2025-07-11", time:"7:00 PM",  venue:"College Amphitheatre", price:199,  capacity:300,  registered:210, tags:["Hip-Hop","Battle","Dance"],    image:"img_hiphop",         description:"The ultimate hip-hop battle event. Freestyle rap, breakdance battles, and DJ sets.", accent:"#F59E0B" },
  { id:"9",  title:"Debate Championship",       category:"Academic",  startDate:"2025-07-14", endDate:"2025-07-15", time:"9:00 AM",  venue:"Conference Hall",      price:99,   capacity:80,   registered:72,  tags:["Debate","GD","2 Days"],        image:"img_debate",         description:"Two-day national-level debate championship. Win certificates and cash prizes.", accent:"#10B981" },
  { id:"10", title:"Comedy Night Live",         category:"Cultural",  startDate:"2025-07-18", endDate:"2025-07-18", time:"8:00 PM",  venue:"Open Air Theatre",     price:249,  capacity:400,  registered:315, tags:["Comedy","Stand-Up"],           image:"img_comedy",         description:"A night of pure laughter with top stand-up comedians from across the country.", accent:"#F97316" },
  { id:"11", title:"Data Science Bootcamp",     category:"Tech",      startDate:"2025-07-21", endDate:"2025-07-23", time:"9:00 AM",  venue:"CS Department",        price:599,  capacity:60,   registered:44,  tags:["Data","Python","3 Days"],      image:"img_datascience",    description:"Intensive 3-day bootcamp covering ML, data viz, and real-world datasets with industry mentors.", accent:"#6366F1" },
  { id:"12", title:"Fashion Week Campus",       category:"Cultural",  startDate:"2025-07-25", endDate:"2025-07-26", time:"3:00 PM",  venue:"Main Stage",           price:349,  capacity:250,  registered:198, tags:["Fashion","Ramp","2 Days"],     image:"img_fashion",        description:"Campus fashion week — design, showcase, and walk the ramp. Open to all creative minds.", accent:"#EC4899" },
  { id:"13", title:"Cyber Security CTF",        category:"Tech",      startDate:"2025-07-29", endDate:"2025-07-30", time:"10:00 AM", venue:"Cyber Lab",            price:299,  capacity:50,   registered:31,  tags:["CTF","Hacking","2 Days"],      image:"img_ctf",            description:"Capture the Flag competition. Crack codes, find vulnerabilities, win big prizes.", accent:"#22C55E" },
  { id:"14", title:"Sanskrit & Yoga Day",       category:"Cultural",  startDate:"2025-08-01", endDate:"2025-08-01", time:"6:00 AM",  venue:"Yoga Grounds",         price:0,    capacity:200,  registered:87,  tags:["Yoga","Wellness","Free"],      image:"img_yoga",           description:"Start your morning right with sunrise yoga, meditation, and Sanskrit chanting.", accent:"#A78BFA" },
  { id:"15", title:"Music Production Workshop", category:"Workshop",  startDate:"2025-08-04", endDate:"2025-08-05", time:"2:00 PM",  venue:"Music Room",           price:749,  capacity:20,   registered:15,  tags:["Music","DJ","2 Days"],         image:"img_musicprod",      description:"Learn music production, mixing, and mastering from professional DJs and producers.", accent:"#F43F5E" },
  { id:"16", title:"Independence Day Fest",     category:"Cultural",  startDate:"2025-08-15", endDate:"2025-08-17", time:"9:00 AM",  venue:"Campus Grounds",       price:0,    capacity:2000, registered:1243,tags:["Patriotic","Free","3 Days"],   image:"img_independence",   description:"Three-day Independence Day celebration with performances, exhibitions, and patriotic events.", accent:"#FF6B35" },
  { id:"17", title:"Entrepreneurship Summit",   category:"Business",  startDate:"2025-08-08", endDate:"2025-08-09", time:"10:00 AM", venue:"Business School",      price:499,  capacity:120,  registered:88,  tags:["Startup","VC","2 Days"],       image:"img_entrepreneur",   description:"Two days with successful founders, VCs, and business leaders sharing actionable insights.", accent:"#FBBF24" },
  { id:"18", title:"Street Art Festival",       category:"Cultural",  startDate:"2025-08-11", endDate:"2025-08-12", time:"10:00 AM", venue:"Campus Walls",         price:199,  capacity:150,  registered:103, tags:["Graffiti","Art","2 Days"],     image:"img_streetart",      description:"Transform the campus into a living art gallery. Graffiti, murals, and street performances.", accent:"#34D399" },
  { id:"19", title:"Chess Tournament",          category:"Academic",  startDate:"2025-08-16", endDate:"2025-08-16", time:"10:00 AM", venue:"Student Center",       price:99,   capacity:64,   registered:58,  tags:["Chess","Strategy"],            image:"img_chess",          description:"National-level chess tournament. All skill levels welcome. Prizes for top 3.", accent:"#94A3B8" },
  { id:"20", title:"Blockchain Hackathon",      category:"Tech",      startDate:"2025-08-18", endDate:"2025-08-19", time:"8:00 AM",  venue:"Innovation Lab",       price:0,    capacity:80,   registered:62,  tags:["Blockchain","Web3","Free"],    image:"img_blockchain",     description:"Build the future of Web3. 36-hour hackathon with mentors from top crypto companies.", accent:"#F59E0B" },
  { id:"21", title:"Food Festival",             category:"Cultural",  startDate:"2025-06-29", endDate:"2025-06-29", time:"11:00 AM", venue:"Campus Canteen Area",  price:149,  capacity:600,  registered:421, tags:["Food","Stalls","Fest"],        image:"img_food",           description:"30+ food stalls, live cooking demos, eating challenges, and the ultimate food war.", accent:"#FB7185" },
  { id:"22", title:"Stand-Up Comedy Open Mic",  category:"Cultural",  startDate:"2025-07-06", endDate:"2025-07-06", time:"7:30 PM",  venue:"Seminar Hall A",       price:149,  capacity:200,  registered:134, tags:["Comedy","Open Mic"],           image:"img_openmic",        description:"Open mic night for aspiring comedians. Anyone can perform. Audience votes the winner.", accent:"#FDBA74" },
  { id:"23", title:"App Dev Marathon",          category:"Tech",      startDate:"2025-07-26", endDate:"2025-07-27", time:"9:00 AM",  venue:"CS Department",        price:199,  capacity:100,  registered:75,  tags:["Flutter","React","24hr"],      image:"img_appdev",         description:"24-hour app development marathon. Build a working app from scratch. Prizes worth ₹1 Lakh.", accent:"#818CF8" },
  { id:"24", title:"Classical Dance Recital",   category:"Cultural",  startDate:"2025-07-31", endDate:"2025-07-31", time:"6:00 PM",  venue:"Auditorium",           price:199,  capacity:300,  registered:187, tags:["Bharatnatyam","Kathak"],       image:"img_classicaldance", description:"An evening of classical Indian dance forms — Bharatnatyam, Kathak, and Odissi performances.", accent:"#E879F9" },
  { id:"25", title:"Astronomy Night",           category:"Academic",  startDate:"2025-08-05", endDate:"2025-08-05", time:"8:00 PM",  venue:"Terrace Garden",       price:99,   capacity:80,   registered:76,  tags:["Stargazing","Science"],        image:"img_astronomy",      description:"Telescope stargazing, astrophotography tips, and a live talk by an ISRO scientist.", accent:"#38BDF8" },
  { id:"26", title:"Green Campus Drive",        category:"Academic",  startDate:"2025-08-07", endDate:"2025-08-07", time:"7:00 AM",  venue:"Campus Grounds",       price:0,    capacity:500,  registered:212, tags:["Eco","Plantation","Free"],     image:"img_green",          description:"Mass tree plantation drive + sustainable living workshops. Make the campus greener.", accent:"#4ADE80" },
  { id:"27", title:"Quiz Bowl Championship",    category:"Academic",  startDate:"2025-08-20", endDate:"2025-08-21", time:"10:00 AM", venue:"Conference Hall",      price:149,  capacity:120,  registered:93,  tags:["Quiz","GK","2 Days"],          image:"img_quiz",           description:"Two-day quiz extravaganza. General knowledge, tech, pop culture, and more categories.", accent:"#60A5FA" },
  { id:"28", title:"Spoken Word Poetry",        category:"Cultural",  startDate:"2025-08-22", endDate:"2025-08-22", time:"6:30 PM",  venue:"Library Hall",         price:99,   capacity:150,  registered:89,  tags:["Poetry","Spoken Word"],        image:"img_poetry",         description:"Express through verse. Spoken word, slam poetry, and original composition contest.", accent:"#C084FC" },
  { id:"29", title:"Sports Fest — Velocity",    category:"Sports",    startDate:"2025-08-23", endDate:"2025-08-25", time:"8:00 AM",  venue:"Sports Complex",       price:299,  capacity:800,  registered:543, tags:["Cricket","Football","3 Days"], image:"img_sports",         description:"3-day multi-sport festival. Cricket, football, basketball, athletics, and more.", accent:"#34D399" },
  { id:"30", title:"Farewell Gala Night",       category:"Cultural",  startDate:"2025-08-28", endDate:"2025-08-28", time:"7:00 PM",  venue:"Grand Hall",           price:599,  capacity:400,  registered:289, tags:["Formal","Party","Gala"],       image:"img_farewell",       description:"The most glamorous night of the year. Red carpet, live band, and unforgettable memories.", accent:"#F0ABFC" },
];

/* ─────────────────────────────────────────
   GET /api/events — List all events
   Query params: category, status (ongoing/upcoming), sort
───────────────────────────────────────── */
router.get("/", async (req, res) => {
  try {
    const { category, status, sort } = req.query;
    let eventsRef = db.collection("events");

    // Fetch all events (Firestore filtering)
    const snapshot = await eventsRef.get();
    let events = [];

    if (snapshot.empty) {
      // Return seed data if DB is empty
      events = SEED_EVENTS;
    } else {
      snapshot.forEach(doc => events.push({ id: doc.id, ...doc.data() }));
    }

    // Filter by category
    if (category && category !== "All") {
      events = events.filter(e => e.category === category);
    }

    // Filter by status
    const today = new Date();
    if (status === "ongoing") {
      events = events.filter(e => {
        const start = new Date(e.startDate), end = new Date(e.endDate);
        return today >= start && today <= end;
      });
    } else if (status === "upcoming") {
      events = events.filter(e => new Date(e.startDate) > today);
    }

    // Sort
    if (sort === "date_asc") {
      events.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
    } else if (sort === "date_desc") {
      events.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
    } else if (sort === "price_asc") {
      events.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      events.sort((a, b) => b.price - a.price);
    }

    res.json({ events, total: events.length });
  } catch (err) {
    console.error("Get events error:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   GET /api/events/:id — Single event
───────────────────────────────────────── */
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const doc = await db.collection("events").doc(id).get();

    if (!doc.exists) {
      // Fallback to seed data
      const seed = SEED_EVENTS.find(e => e.id === id);
      if (!seed) return res.status(404).json({ error: "Event not found." });
      return res.json(seed);
    }

    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   POST /api/events — Create event (Admin only)
   Body: event fields
───────────────────────────────────────── */
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const {
      title, category, startDate, endDate, time,
      venue, price, capacity, description, image, tags, accent
    } = req.body;

    if (!title || !startDate || !endDate || !venue) {
      return res.status(400).json({ error: "Title, dates, and venue are required." });
    }

    const eventData = {
      title,
      category: category || "General",
      startDate,
      endDate,
      time: time || "10:00 AM",
      venue,
      price: Number(price) || 0,
      capacity: Number(capacity) || 100,
      registered: 0,
      description: description || "",
      image: image || "",
      tags: tags || [],
      accent: accent || "#FF6B35",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: req.user.uid,
    };

    const docRef = await db.collection("events").add(eventData);

    res.status(201).json({
      message: "Event created successfully!",
      event: { id: docRef.id, ...eventData },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   PUT /api/events/:id — Update event (Admin)
───────────────────────────────────────── */
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updatedAt: admin.firestore.FieldValue.serverTimestamp() };
    delete updates.id;

    await db.collection("events").doc(id).update(updates);
    res.json({ message: "Event updated successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────────────────────────────────
   DELETE /api/events/:id — Delete event (Admin)
───────────────────────────────────────── */
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await db.collection("events").doc(req.params.id).delete();
    res.json({ message: "Event deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── Seed Firestore with all 30 events (Admin) ── */
router.post("/seed/all", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const batch = db.batch();
    SEED_EVENTS.forEach(event => {
      const ref = db.collection("events").doc(event.id);
      batch.set(ref, { ...event, registered: event.registered || 0 });
    });
    await batch.commit();
    res.json({ message: `✅ Seeded ${SEED_EVENTS.length} events to Firestore!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
