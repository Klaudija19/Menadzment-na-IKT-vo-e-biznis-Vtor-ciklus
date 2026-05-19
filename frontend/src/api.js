export const API_BASE =
  process.env.REACT_APP_API_URL || "http://localhost/beauty-salon-api";

export function apiUrl(path) {
  const p = path.startsWith("/") ? path.slice(1) : path;
  return `${API_BASE}/${p}`;
}

export function authHeaders(user) {
  if (!user?.role) return {};
  return { "X-User-Role": user.role };
}

function withRoleParam(url, user) {
  if (!user?.role) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}role=${encodeURIComponent(user.role)}`;
}

/**
 * Authenticated fetch — role via header + query (works on XAMPP).
 */
export async function apiFetch(path, options = {}, user = null) {
  const url = withRoleParam(apiUrl(path), user);
  const headers = {
    ...authHeaders(user),
    ...(options.headers || {}),
  };
  return fetch(url, { ...options, headers });
}

/** Parse JSON; return { ok, data, error } */
export async function parseApiResponse(res) {
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return {
      ok: false,
      data: null,
      error: text?.slice(0, 200) || "Invalid response from server (is XAMPP running?)",
    };
  }
  if (data?.error) {
    return { ok: false, data, error: data.error };
  }
  if (!res.ok) {
    return { ok: false, data, error: data?.message || `HTTP ${res.status}` };
  }
  return { ok: true, data, error: null };
}

export async function parseApiList(res) {
  const { ok, data, error } = await parseApiResponse(res);
  if (!ok) return { list: [], error };
  return { list: Array.isArray(data) ? data : [], error: null };
}
