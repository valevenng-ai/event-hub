const TOKEN_KEY = 'token';
const ROLE_KEY  = 'role';
const USER_KEY  = 'username';

export const getToken    = () => localStorage.getItem(TOKEN_KEY);
export const getRole     = () => localStorage.getItem(ROLE_KEY);
export const getUsername = () => localStorage.getItem(USER_KEY);

export const setAuth = (token, role, username) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ROLE_KEY, role);
  localStorage.setItem(USER_KEY, username);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthed  = () => Boolean(getToken());
export const isAdmin   = () => getRole() === 'admin';
export const isViewer  = () => getRole() === 'viewer';