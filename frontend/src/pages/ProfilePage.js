import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext'; // Assuming your AuthContext has 'user' and 'logout'

const ProfilePage = () => {
  const theme = useTheme();
  const { user, logout } = useAuth();

  const cardStyle = {
    backgroundColor: theme.bgCard,
    color: theme.text,
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: theme.shadow,
    maxWidth: '500px',
    margin: '40px auto',
    textAlign: 'center',
    border: `1px solid ${theme.border}`
  };

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '90vh', padding: '20px' }}>
      <div style={cardStyle}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: theme.teal, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white', fontSize: '2rem' }}>
          {user?.name?.charAt(0) || 'U'}
        </div>
        <h2>Account Settings</h2>
        <p style={{ color: theme.textMuted }}>Manage your NurtureCare profile</p>
        
        <div style={{ textAlign: 'left', margin: '20px 0' }}>
          <label style={{ fontSize: '0.8rem', color: theme.teal }}>FULL NAME</label>
          <p style={{ fontSize: '1.1rem', marginBottom: '15px' }}>{user?.name || "Guest User"}</p>
          
          <label style={{ fontSize: '0.8rem', color: theme.teal }}>EMAIL ADDRESS</label>
          <p style={{ fontSize: '1.1rem' }}>{user?.email || "No email linked"}</p>
        </div>

        <button 
          onClick={logout}
          style={{ width: '100%', padding: '12px', backgroundColor: theme.rose, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;