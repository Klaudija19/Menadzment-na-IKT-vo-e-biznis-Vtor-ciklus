export const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost/beauty-salon-api";

export function apiUrl(path) {
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE}/${p}`;
}
