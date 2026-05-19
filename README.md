# 🎪 EventHive — College Event Registration & Ticketing Platform

A full-stack event management platform with Razorpay payments, QR tickets, Firebase Auth, and an Admin dashboard.

---

## 📁 Project Structure

```
eventhive/
├── client/          ← React + Vite Frontend
└── server/          ← Node.js + Express Backend
```

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` in the `server/` folder and fill in your keys:

```bash
cd server
cp .env.example .env
```

Fill in:
- **Firebase** — Go to Firebase Console → Project Settings → Service Accounts → Generate New Private Key
- **Razorpay** — Go to razorpay.com → Settings → API Keys → Generate Test Key
- **JWT_SECRET** — Any long random string (e.g. run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- **EMAIL** — Use a Gmail account + App Password (Google Account → Security → App Passwords)

### 3. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project called `eventhive`
3. Enable **Authentication** → Sign-in method → Email/Password + Google
4. Create **Firestore Database** (start in test mode)
5. Go to Project Settings → Service Accounts → **Generate new private key** → download JSON
6. Copy values from that JSON into your `.env`

### 4. Run the App

```bash
# Terminal 1 — Start backend
cd server
npm run dev

# Terminal 2 — Start frontend
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

---

## 🔑 Admin Login

To make a user an admin, go to **Firestore → users → [uid]** and set `role: "admin"`.

Or use the default admin credentials set in your `.env`:
```
ADMIN_EMAIL=admin@eventhive.com
ADMIN_PASSWORD=Admin@1234
```

---

## 📦 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/events` | Get all events |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create event (admin) |
| POST | `/api/payment/create-order` | Create Razorpay order |
| POST | `/api/payment/verify` | Verify payment & issue ticket |
| GET | `/api/tickets/my` | Get user's tickets |
| GET | `/api/tickets/validate/:ticketId` | Validate QR (admin) |
| GET | `/api/admin/stats` | Dashboard stats (admin) |
| GET | `/api/admin/registrations` | All registrations (admin) |
| GET | `/api/admin/export-csv` | Export CSV (admin) |

---

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | Firebase Firestore |
| Auth | Firebase Auth + JWT |
| Payments | Razorpay (Test Mode) |
| Email | Nodemailer (Gmail) |
| QR | qrcode npm package |

---

## 🎯 Features

- ✅ User signup / login (Firebase Auth)
- ✅ Admin panel with live stats
- ✅ 30 events (June–August)
- ✅ Razorpay test-mode payment
- ✅ Auto QR ticket generation on payment
- ✅ Email ticket delivery (Nodemailer)
- ✅ QR validation for check-in (Admin)
- ✅ CSV export of attendees
- ✅ Capacity lock when full
- ✅ JWT-protected routes

---

## 📸 Image URLs

All event images use Unsplash URLs defined in `client/src/App.jsx` inside the `IMAGES` object. To replace with your own:

```js
const IMAGES = {
  img_technovate: "YOUR_IMAGE_URL_HERE",
  // ...
};
```

Use any direct image URL (Unsplash, Cloudinary, Firebase Storage, etc.)
