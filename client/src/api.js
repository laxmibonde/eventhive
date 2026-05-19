/**
 * EventHive API Service
 * Connects the React frontend to the Express backend.
 *
 * Usage in App.jsx:
 *   import api from './api'
 *   const { token, user } = await api.auth.login(email, password)
 */

const BASE_URL = "/api"; // Vite proxies this to http://localhost:5000

function getToken() {
  return localStorage.getItem("eventhive_token");
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({ error: "Invalid response from server" }));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data;
}

const api = {
  /* ── Auth ── */
  auth: {
    signup: (name, email, password) =>
      request("/auth/signup", { method: "POST", body: JSON.stringify({ name, email, password }) }),

    login: (email, password) =>
      request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),

    googleLogin: (idToken) =>
      request("/auth/google", { method: "POST", body: JSON.stringify({ idToken }) }),

    me: () => request("/auth/me"),
  },

  /* ── Events ── */
  events: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/events${qs ? `?${qs}` : ""}`);
    },
    get: (id) => request(`/events/${id}`),
    create: (data) => request("/events", { method: "POST", body: JSON.stringify(data) }),
    update: (id, data) => request(`/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    delete: (id) => request(`/events/${id}`, { method: "DELETE" }),
    seedAll: () => request("/events/seed/all", { method: "POST" }),
  },

  /* ── Payments ── */
  payment: {
    createOrder: (eventId) =>
      request("/payment/create-order", { method: "POST", body: JSON.stringify({ eventId }) }),

    verify: (paymentData) =>
      request("/payment/verify", { method: "POST", body: JSON.stringify(paymentData) }),

    freeRegister: (eventId) =>
      request("/payment/free-register", { method: "POST", body: JSON.stringify({ eventId }) }),
  },

  /* ── Tickets ── */
  tickets: {
    myTickets: () => request("/tickets/my"),
    get: (ticketId) => request(`/tickets/${ticketId}`),
    validate: (ticketId) => request(`/tickets/validate/${ticketId}`),
  },

  /* ── Admin ── */
  admin: {
    stats: () => request("/admin/stats"),
    registrations: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/admin/registrations${qs ? `?${qs}` : ""}`);
    },
    exportCsv: (eventId) => {
      const token = getToken();
      const url = `${BASE_URL}/admin/export-csv${eventId ? `?eventId=${eventId}` : ""}`;
      // Trigger file download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "registrations.csv");
      // Attach token via a temp form (since headers can't be set on link clicks)
      fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.blob())
        .then(blob => {
          const blobUrl = URL.createObjectURL(blob);
          link.href = blobUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(blobUrl);
        });
    },
    scanQr: (qrData) =>
      request("/admin/scan-qr", { method: "POST", body: JSON.stringify({ qrData }) }),
    users: () => request("/admin/users"),
    updateUserRole: (uid, role) =>
      request(`/admin/users/${uid}/role`, { method: "PATCH", body: JSON.stringify({ role }) }),
  },

  /* ── Token helpers ── */
  setToken: (token) => localStorage.setItem("eventhive_token", token),
  clearToken: () => localStorage.removeItem("eventhive_token"),
};

export default api;
