const RAW_API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const normalizedBaseUrl = RAW_API_BASE_URL.replace(/\/+$/, '');
const API_BASE_URL = normalizedBaseUrl.endsWith('/api')
  ? normalizedBaseUrl.slice(0, -4)
  : normalizedBaseUrl;
const TOKEN_KEY = 'authToken';
const REMEMBER_ME_KEY = 'authRememberMe';
const API_TIMEOUT_MS = Number(import.meta.env.VITE_API_TIMEOUT_MS || 15000);

const safeStorage = (kind: 'local' | 'session') => {
  if (typeof window === 'undefined') return null;
  return kind === 'local' ? window.localStorage : window.sessionStorage;
};

export const getAuthToken = () => {
  const local = safeStorage('local')?.getItem(TOKEN_KEY);
  if (local) return local;
  return safeStorage('session')?.getItem(TOKEN_KEY) || null;
};

export const getRememberMePreference = () => {
  const value = safeStorage('local')?.getItem(REMEMBER_ME_KEY);
  return value !== 'false';
};

export const setRememberMePreference = (rememberMe: boolean) => {
  safeStorage('local')?.setItem(REMEMBER_ME_KEY, String(rememberMe));
};

export const setAuthToken = (token: string, rememberMe = true) => {
  const local = safeStorage('local');
  const session = safeStorage('session');
  if (!local || !session) return;
  if (rememberMe) {
    local.setItem(TOKEN_KEY, token);
    session.removeItem(TOKEN_KEY);
  } else {
    session.setItem(TOKEN_KEY, token);
    local.removeItem(TOKEN_KEY);
  }
};

export const clearAuthToken = () => {
  safeStorage('local')?.removeItem(TOKEN_KEY);
  safeStorage('session')?.removeItem(TOKEN_KEY);
};

export const apiFetch = async <T>(path: string, options: RequestInit = {}): Promise<T> => {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  const token = getAuthToken();
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: options.signal ?? controller.signal
    });
  } catch (error) {
    if ((error as Error)?.name === 'AbortError') {
      throw new Error('درخواست بیش از حد طول کشید. اتصال خود را بررسی کنید و دوباره تلاش کنید.');
    }
    throw new Error('ارتباط با سرور برقرار نشد. اتصال اینترنت یا VPN را بررسی کنید.');
  } finally {
    window.clearTimeout(timeoutId);
  }

  if (!response.ok) {
    let message = 'خطای سرور';
    try {
      const payload = await response.json();
      if (payload?.message) message = payload.message;
    } catch (error) {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return null as T;
  }

  return response.json() as Promise<T>;
};
