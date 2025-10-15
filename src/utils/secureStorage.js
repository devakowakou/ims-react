// Secure storage utility with encryption (basic implementation)
// For production, consider using httpOnly cookies or a more robust solution

const STORAGE_PREFIX = 'ims_';

// Simple encryption (for demo - use a proper library in production)
const encrypt = (data) => {
  try {
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch (error) {
    console.error('Encryption error:', error);
    return null;
  }
};

const decrypt = (data) => {
  try {
    return JSON.parse(decodeURIComponent(atob(data)));
  } catch (error) {
    console.error('Decryption error:', error);
    return null;
  }
};

export const secureStorage = {
  setItem: (key, value) => {
    try {
      const encrypted = encrypt(value);
      if (encrypted) {
        sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, encrypted);
      }
    } catch (error) {
      console.error('Error storing data:', error);
    }
  },

  getItem: (key) => {
    try {
      const encrypted = sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return encrypted ? decrypt(encrypted) : null;
    } catch (error) {
      console.error('Error retrieving data:', error);
      return null;
    }
  },

  removeItem: (key) => {
    try {
      sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error('Error removing data:', error);
    }
  },

  clear: () => {
    try {
      // Only clear items with our prefix
      Object.keys(sessionStorage).forEach(key => {
        if (key.startsWith(STORAGE_PREFIX)) {
          sessionStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }
};

// Fallback to localStorage for non-sensitive data
export const persistentStorage = {
  setItem: (key, value) => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (error) {
      console.error('Error storing persistent data:', error);
    }
  },

  getItem: (key) => {
    try {
      const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error retrieving persistent data:', error);
      return null;
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      console.error('Error removing persistent data:', error);
    }
  }
};
