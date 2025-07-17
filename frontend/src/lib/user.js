const KEY = "lifeos_user";

// Save user object to localStorage
export const setUser = (user) => {
  localStorage.setItem(KEY, JSON.stringify(user));
};

// Load user object from localStorage
export const getUser = () => {
  const data = localStorage.getItem(KEY);
  return data ? JSON.parse(data) : null;
};

// Clear user info (optional: for logout)
export const clearUser = () => {
  localStorage.removeItem(KEY);
};
