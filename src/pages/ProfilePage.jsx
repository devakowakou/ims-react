import React, { useState, useEffect } from "react";
import Layout from "../component/Layout";
import ApiService from "../service/ApiService";
import { useTheme } from '../context/ThemeContext';

const ProfilePage = () => {
  const { isDarkTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await ApiService.getLoggedInUsesInfo();
        setUser(userInfo);
      } catch (error) {
        showMessage(
          error.response?.data?.message || "Error Loggin in a User: " + error
        );
      }
    };
    fetchUserInfo();
  }, []);

  // Method to show message or errors
  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => {
      setMessage("");
    }, 4000);
  };

  // Get role-specific emoji
  const getRoleEmoji = (role) => {
    switch (role?.toLowerCase()) {
      case 'admin': return '👑';
      case 'manager': return '💼';
      case 'user': return '👤';
      default: return '😊';
    }
  };

  return (
    <Layout>
      {message && <div className="message">{message}</div>}
      <div className={`profile-page ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
        {user && (
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-avatar">
                <span className="avatar-emoji">👋</span>
              </div>
              <h1>Hello, {user.name} {getRoleEmoji(user.role)}</h1>
              <p className="profile-subtitle">Welcome to your personal dashboard</p>
            </div>
            
            <div className="profile-info">
              <div className="profile-item">
                <label>👤 Name</label>
                <span className="user-name">{user.name}</span>
              </div>
              <div className="profile-item">
                <label>📧 Email</label>
                <span className="user-email">{user.email}</span>
              </div>
              <div className="profile-item">
                <label>📞 Phone Number</label>
                <span className="user-phone">{user.phoneNumber}</span>
              </div>
              <div className="profile-item">
                <label>🎯 Role</label>
                <span className="user-role">{user.role} {getRoleEmoji(user.role)}</span>
              </div>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-emoji">⭐</span>
                <div className="stat-info">
                  <span className="stat-value">Active</span>
                  <span className="stat-label">Status</span>
                </div>
              </div>
              <div className="stat-item">
                <span className="stat-emoji">📅</span>
                <div className="stat-info">
                  <span className="stat-value">Today</span>
                  <span className="stat-label">Last Login</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default ProfilePage;