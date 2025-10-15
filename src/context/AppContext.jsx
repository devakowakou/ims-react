import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import UserService from '../service/UserService';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingUser, setIsLoadingUser] = useState(false);
  const userFetchedRef = useRef(false); // Prevent double fetch

  // Fetch user with caching and single call guarantee
  const fetchUser = useCallback(async (force = false) => {
    // If already fetched and not forcing, return cached data
    if (userFetchedRef.current && !force && user) {
      return user;
    }

    // If already loading, don't start another request
    if (isLoadingUser) {
      return null;
    }

    setIsLoadingUser(true);
    try {
      const response = await UserService.getLoggedInUsesInfo();
      const userData = response.user || response.data?.user || response.data || response;
      setUser(userData);
      userFetchedRef.current = true;
      return userData;
    } catch (error) {
      console.error('Error fetching user:', error);
      userFetchedRef.current = false;
      return null;
    } finally {
      setIsLoadingUser(false);
    }
  }, [user, isLoadingUser]);

  // Clear user cache (on logout)
  const clearUser = useCallback(() => {
    setUser(null);
    userFetchedRef.current = false;
  }, []);

  // Update user data
  const updateUser = useCallback((userData) => {
    setUser(userData);
  }, []);

  const value = {
    user,
    isLoadingUser,
    fetchUser,
    clearUser,
    updateUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
