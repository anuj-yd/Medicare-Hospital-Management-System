// admin/src/config/api.js
export const DEFAULT_API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development"
    ? "http://localhost:4000"
    : "https://medicare-backend-tj8g.onrender.com");

export const getApiBase = (override) => {
  if (override) return String(override).replace(/\/$/, "");
  return DEFAULT_API_URL.replace(/\/$/, "");
};
