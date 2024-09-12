import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import FolderIcon from '@mui/icons-material/Folder';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SearchIcon from '@mui/icons-material/Search';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  TextField,
  Toolbar,
  Typography
} from '@mui/material';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../auth/config/firebase-config';

const Navbar = () => {
  const [userPhotoURL, setUserPhotoURL] = useState('');
  const [userName, setUserName] = useState('');
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [docsAnchorEl, setDocsAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserPhotoURL(user.photoURL || '');
        setUserName(user.displayName || "Marian Carson");
      } else {
        setUserPhotoURL('');
        setUserName('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleDocsMenu = (event) => {
    setDocsAnchorEl(event.currentTarget);
  };

  const handleDocsMenuClose = () => {
    setDocsAnchorEl(null);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        console.error('Sign out error', error);
      });
  };

  const isDocsMenuOpen = Boolean(docsAnchorEl);
  const isProfileMenuOpen = Boolean(profileAnchorEl);

  return (
    <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1, boxShadow: 'none', padding: '0 20px', background: 'linear-gradient(135deg, #6e8efb, #a777e3)', fontFamily: 'Roboto, sans-serif' }}>
      <Toolbar sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left Side: Logo and Search Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h5"
            sx={{ fontWeight: 'bold', color: '#fff' }}
            component={Link}
            to="/"
            style={{ textDecoration: 'none' }}
          >
            YoGPT Miner
          </Typography>
          <TextField
            placeholder="Search resources, apps or ip address..."
            variant="outlined"
            size="small"
            sx={{
              backgroundColor: '#f5f5f5',
              borderRadius: '20px',
              marginLeft: '20px',
              width: '300px',
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9e9e9e' }} />
                </InputAdornment>
              ),
              disableUnderline: true,
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>

          {/* Docs Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '15px', cursor: 'pointer' }} onClick={handleDocsMenu}>
            <Typography sx={{ color: '#fff' }}>Docs</Typography>
            <ArrowDropDownIcon sx={{ color: '#fff' }} />
          </Box>

          <Divider orientation="vertical" flexItem sx={{ bgcolor: '#F9F4F4', height: '40px', marginRight: '15px' }} />

          <IconButton aria-label="folder" sx={{ marginRight: '15px' }}>
            <Badge badgeContent={1} color="success">
              <FolderIcon sx={{ color: '#d4af37 ' }} />
            </Badge>
          </IconButton>

          {/* User Profile Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleProfileMenuOpen}>
            <Divider orientation="vertical" flexItem sx={{ bgcolor: '#F9F4F4', height: '40px', marginRight: '10px' }} />
            <Box sx={{ textAlign: 'right', marginRight: '10px' }}>
              <Typography variant="body2" sx={{ fontWeight: '500', color: '#fff' }}>
                {userName || "Miner Admin"}
              </Typography>
              <Typography variant="caption" sx={{ color: '#fff' }}>
                Administrator
              </Typography>
            </Box>
            <Avatar sx={{ bgcolor: '#EEF0F3', color: '#a777e3', width: 40, height: 40 }}>
              {userName ? userName.charAt(0) : 'MC'}
            </Avatar>
            <MoreVertIcon sx={{ color: '#9e9e9e', marginLeft: '10px' }} />
          </Box>
        </Box>
      </Toolbar>

      {/* Docs Menu */}
      <Menu
        anchorEl={docsAnchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        open={isDocsMenuOpen}
        onClose={handleDocsMenuClose}
        PaperProps={{
          style: {
            borderRadius: 8,
            marginTop: 8,
            minWidth: 180,
            color: '#fff',
            backgroundColor: '#333',
          }
        }}
      >
        <MenuItem component={Link} to="/miner-docs">Miner Docs</MenuItem>
        <MenuItem component={Link} to="/userdocs">Job Setup Docs</MenuItem>
      </Menu>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileAnchorEl}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isProfileMenuOpen}
        onClose={handleProfileMenuClose}
        PaperProps={{
          style: {
            borderRadius: 8,
            marginTop: 8,
            minWidth: 180,
            color: '#333',
            backgroundColor: '#fff',
          }
        }}
      >
        <MenuItem onClick={() => navigate('/profile')}>View Profile</MenuItem>
        <MenuItem onClick={handleSignOut}>Logout</MenuItem>
      </Menu>
    </AppBar>
  );
};

export default Navbar;
