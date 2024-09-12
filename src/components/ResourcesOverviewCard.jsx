import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Button, Card, CardContent, Grid, IconButton, Typography } from '@mui/material';
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

// Utility function to format numbers to GB
const formatToGB = (num) => {
  const gbValue = num / (1024 ** 3); // Convert bytes to GB
  return gbValue.toFixed(2) + ' GB'; // Format to two decimal places
};

// Reusable ResourcesOverviewCard Component
const ResourcesOverviewCard = ({
  title,
  dateRange,
  activeTitle,
  activeValue,
  inactiveTitle,
  inactiveValue,
  totalTitle,
  totalValue, // This can be passed in or calculated dynamically as shown below
  buttonText,
  buttonLink, // Optional link for the button
  onClick, // Optional onClick handler for the button
}) => {
  // Calculate total if not passed as a prop
  const totalResources = totalValue !== undefined ? totalValue : activeValue + inactiveValue;

  // Conditionally format values to GB if the title indicates memory usage
  const formatValue = (value) => {
    return title === "Miner Memory Usage Overview" ? formatToGB(value) : value.toLocaleString();
  };

  const data = [
    { name: activeTitle, value: activeValue, color: '#00C49F' },
    { name: inactiveTitle, value: inactiveValue, color: '#FF8042' },
  ];

  return (
    <Card sx={{ height: '100%', padding: '16px' }}>
      <CardContent>
        {/* Header Section with Optional Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <Box>
            <Typography variant="h6" sx={{ color: '#444', fontWeight: '600', fontSize: '16px' }}>
              {title}
            </Typography>
            <Typography variant="body2" sx={{ color: '#888', fontSize: '12px' }}>
              {dateRange}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {buttonText && (
              <Button 
                variant="outlined" 
                sx={{ 
                  fontWeight: '500', 
                  textTransform: 'none', 
                  fontSize: '12px',
                  borderColor: '#888',
                  color: '#888',
                  marginRight: '8px'
                }}
                href={buttonLink} // Button becomes a link if provided
                onClick={onClick} // Handle the button click event
              >
                {buttonText}
              </Button>
            )}
            <IconButton sx={{ color: '#888' }}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Pie Chart and Resource Details in a Single Row */}
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid item xs={3}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
              <ResponsiveContainer width={90} height={90}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={40}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Typography variant="h6" sx={{ color: '#555', fontWeight: 'bold' }}>
                  {formatValue(totalResources)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={9}>
            <Grid container spacing={2} sx={{ textAlign: 'left', alignItems: 'center' }}>
              <Grid item xs={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#00C49F',
                      marginRight: '5px',
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#888', fontWeight: '500' }}>
                    {activeTitle}
                  </Typography>
                </Box>
                <Typography variant="h7" sx={{ color: '#00C49F', textAlign: 'left' }}>
                  {formatValue(activeValue)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      backgroundColor: '#FF8042',
                      marginRight: '5px',
                    }}
                  />
                  <Typography variant="body2" sx={{ color: '#888', fontWeight: '500' }}>
                    {inactiveTitle}
                  </Typography>
                </Box>
                <Typography variant="h7" sx={{ color: '#FF8042', textAlign: 'left' }}>
                  {formatValue(inactiveValue)}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <Typography variant="body2" sx={{ color: '#888', fontWeight: '500' }}>
                    {totalTitle}
                  </Typography>
                </Box>
                <Typography variant="h7" sx={{ color: '#555', textAlign: 'left' }}>
                  {formatValue(totalResources)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ResourcesOverviewCard;
