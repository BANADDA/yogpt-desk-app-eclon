import { Box, Button, Typography } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

const TerminalController = ({ terminalData }) => {
    const terminalRef = useRef(null);
    const [displayedLogs, setDisplayedLogs] = useState([]);

    useEffect(() => {
        // Append new terminal data to displayed logs
        setDisplayedLogs((prevLogs) => [...prevLogs, ...terminalData]);

        // Auto-scroll to the bottom when new logs arrive
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalData]);

    const handleClearConsole = () => {
        setDisplayedLogs([]); // Clear the displayed logs
    };

    return (
        <Box sx={styles.terminalContainer}>
            <Box sx={styles.terminalHeader}>
                <Box sx={styles.headerButtonContainer}>
                    <Box sx={{ ...styles.headerButton, backgroundColor: '#ff5f56' }} />
                    <Box sx={{ ...styles.headerButton, backgroundColor: '#ffbd2e' }} />
                    <Box sx={{ ...styles.headerButton, backgroundColor: '#27c93f' }} />
                </Box>
                <Typography sx={styles.headerTitle}>YoGPT Terminal</Typography>
                <Button sx={styles.clearButton} onClick={handleClearConsole}>
                    Clear Console
                </Button>
            </Box>
            <Box ref={terminalRef} sx={styles.terminalBody}>
                {displayedLogs.flatMap((log, index) =>
                    log.split('\n').map((line, subIndex) => (
                        <Typography key={`${index}-${subIndex}`} sx={styles.logEntry}>{line}</Typography>
                    ))
                )}
            </Box>
        </Box>
    );
};

const styles = {
    terminalContainer: {
        backgroundColor: '#000',
        borderRadius: '5px',
        overflow: 'hidden',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
        height: '410px', 
    },
    terminalHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#333',
        color: '#fff',
        padding: '5px 10px',
    },
    headerButtonContainer: {
        display: 'flex',
        gap: '5px',
    },
    headerButton: {
        width: '12px',
        height: '12px',
        borderRadius: '50%',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: '14px',
        color: '#fff',
    },
    clearButton: {
        backgroundColor: '#ff5f56',
        color: '#fff',
        fontSize: '12px',
        padding: '2px 8px',
        borderRadius: '4px',
        '&:hover': {
            backgroundColor: '#ff8a80',
        },
    },
    terminalBody: {
        backgroundColor: '#1e1e1e',
        color: 'green',
        padding: '10px',
        height: '360px',
        overflowY: 'scroll',
        fontFamily: 'monospace',
        fontSize: '14px',
        whiteSpace: 'pre-wrap', // Ensures that whitespace and newlines are preserved
    },
    logEntry: {
        lineHeight: '1.5',
    },
};

export default TerminalController;
