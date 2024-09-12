import { Typography } from "@material-tailwind/react";
import { styled } from '@mui/system';
import React from 'react';

const currentYear = new Date().getFullYear();

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontFamily: 'Poppins',
  fontSize: '14px',
}));

export function Footer() {
  return (
    <footer 
      className="fixed bottom-0 w-full text-center py-2" 
      style={{ 
        backgroundColor: '#6e8efb', 
        color: '#fff', 
        fontFamily: 'Poppins', 
        fontSize: '12px',
        zIndex: 1300, // Set z-index to ensure it's above other elements
        boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)' // Optional: add shadow for better visibility
      }}
    >
      © {currentYear} Copyright:
      <a
        className="text-white"
        href="#"
        style={{ marginLeft: '5px', fontWeight: 'bold' }}
      >
        YOGPT
      </a>
    </footer>
  );
}
