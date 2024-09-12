import FolderIcon from '@mui/icons-material/Folder';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Box, Button, Divider, Typography } from '@mui/material';
import React from 'react';

const ProjectCard = ({ user, commit, applications, programStatus, onToggleProgram, onStartProgram }) => {

  const BlinkingDot = ({ color }) => (
    <Box display="flex" alignItems="center">
      <Box
        sx={{
          width: 10,
          height: 10,
          backgroundColor: color,
          borderRadius: '50%',
          marginRight: 1,
          animation: 'blink 1.5s infinite',
          '@keyframes blink': {
            '0%': { opacity: 1 },
            '50%': { opacity: 0 },
            '100%': { opacity: 1 },
          }
        }}
      />
      <Typography variant="body2" sx={{ color }}>
        {programStatus === 'online' ? 'Online' : 'Offline'}
      </Typography>
    </Box>
  );

  const toggleProgramStatus = async () => {
    if (programStatus === 'online') {
      try {
        const response = await fetch('http://localhost:3007/stop-program', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.text();
        console.log("Server response:", result);

        if (response.ok) {
          console.log("Stop command sent successfully, waiting for WebSocket confirmation...");
          // Wait for WebSocket confirmation before setting the status to offline
        } else {
          console.error('Failed to stop the program');
        }
      } catch (error) {
        console.error(`Error stopping program: ${error.message}`);
      }
    } else {
      onStartProgram();  // Open the start program modal
    }
  };

  const handleButtonClick = () => {
    console.log('Button clicked. Current programStatus:', programStatus);
  
    if (programStatus === 'offline') {
      if (typeof onStartProgram === 'function') {
        console.log('Starting program...');
        onStartProgram();  // Trigger the modal to open and start the program
      } else {
        console.error('onStartProgram is not a function or was not passed correctly to ProjectCard.');
      }
    } else {
      console.log('Stopping program...');
      toggleProgramStatus();  // Trigger the program stop process
    }
  };      

  return (
    <Box
      sx={{
        border: '1px solid #E0E0E0',
        borderRadius: '8px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ marginRight: '16px' }}>
            <FolderIcon fontSize="large" sx={{ color: '#00b0ff' }} />
          </Box>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: '600', color: '#333' }}>
              {user.name}
            </Typography>
            <Typography variant="body2" sx={{ color: '#757575' }}>
              {user.email}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ marginBottom: '8px' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
            {commit}
          </Typography>
          <Typography variant="caption" sx={{ color: '#757575' }}>
            Miner Key
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ marginX: '8px', height: '24px' }} />
        <Box sx={{ textAlign: 'left' }}>
          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#333' }}>
            {applications}
          </Typography>
          <Typography variant="caption" sx={{ color: '#757575' }}>
            Jobs Completed
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem sx={{ marginX: '8px', height: '24px' }} />
        <Box sx={{ textAlign: 'left' }}>
          <BlinkingDot color={programStatus === 'online' ? 'green' : 'red'} />
          <Typography variant="caption" sx={{ color: '#757575' }}>
            Program Status
          </Typography>
        </Box>
        <Box sx={{ marginLeft: 'auto' }}>
          <Button
            variant="outlined"
            startIcon={<PowerSettingsNewIcon />}
            onClick={handleButtonClick}
            sx={{
              borderColor: programStatus === 'online' ? '#FF1744' : '#00C49F',
              color: programStatus === 'online' ? '#FF1744' : '#00C49F',
              textTransform: 'none',
              fontWeight: '500',
            }}
          >
            {programStatus === 'online' ? 'Stop Program' : 'Start Program'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectCard;
