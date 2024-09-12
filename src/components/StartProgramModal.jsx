import { Box, Button, MenuItem, Modal, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';

const StartProgramModal = ({ open, onClose, onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [environment, setEnvironment] = useState('Local');
  const [sshDetails, setSshDetails] = useState('');

  const handleSubmit = () => {
    onSubmit({ username, password, environment, sshDetails });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>Start Program</Typography>
        <TextField
          label="Username"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Select
          fullWidth
          value={environment}
          onChange={(e) => setEnvironment(e.target.value)}
          margin="normal"
        >
          <MenuItem value="Local">Local</MenuItem>
          <MenuItem value="RunPod">RunPod</MenuItem>
        </Select>
        {environment === 'RunPod' && (
          <TextField
            label="SSH Details"
            fullWidth
            margin="normal"
            value={sshDetails}
            onChange={(e) => setSshDetails(e.target.value)}
          />
        )}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Start
        </Button>
      </Box>
    </Modal>
  );
};

export default StartProgramModal;
