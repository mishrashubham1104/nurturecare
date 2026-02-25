import React from 'react';
import { useTheme } from '../context/ThemeContext';

const MyBookings = () => {
  const theme = useTheme();

  // Mock data - in a real app, this would come from an API
  const bookings = [
    { id: 1, service: "Elderly Care", date: "Oct 24, 2023", status: "Confirmed" },
    { id: 2, service: "Post-Surgery Support", date: "Nov 02, 2023", status: "Pending" },
  ];

  return (
    <div style={{ backgroundColor: theme.bg, minHeight: '90vh', padding: theme.isMobile ? '20px' : '40px' }}>
      <h1 style={{ color: theme.text, textAlign: 'center' }}>My Bookings</h1>
      
      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {bookings.map(booking => (
          <div key={booking.id} style={{ 
            backgroundColor: theme.bgCard, 
            padding: '20px', 
            borderRadius: '10px', 
            borderLeft: `5px solid ${theme.teal}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: theme.shadow
          }}>
            <div>
              <h3 style={{ color: theme.text, margin: 0 }}>{booking.service}</h3>
              <p style={{ color: theme.textMuted, margin: '5px 0 0' }}>{booking.date}</p>
            </div>
            <span style={{ 
              backgroundColor: booking.status === 'Confirmed' ? '#e6fffa' : '#fffaf0', 
              color: booking.status === 'Confirmed' ? '#2c7a7b' : '#b7791f',
              padding: '5px 12px',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: 'bold'
            }}>
              {booking.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBookings;