// const path = require('path');
// const { app, BrowserWindow } = require('electron');
// const express = require('express');

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       contextIsolation: true,
//       nodeIntegration: false,
//     },
//   });

//   // Check if we're in development mode or production
//   if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
//     // In both development and production, load the React app served by Vite
//     win.loadURL('http://localhost:8000'); // Ensure this matches the port Vite is using
//     win.webContents.openDevTools(); // Enable DevTools in development and optionally in production
//   } else {
//     // Fallback for serving a built React app (not needed if always using Vite dev server)
//     const server = express();
//     const port = 3000; // You can choose any available port

//     server.use(express.static(path.join(__dirname, 'dist')));

//     server.listen(port, () => {
//       console.log(`Server running on http://localhost:${port}`);
//       win.loadURL(`http://localhost:${port}`);
//     });

//     // Optionally, enable DevTools in production by pressing F12
//     win.webContents.on('before-input-event', (event, input) => {
//       if (input.key === 'F12') {
//         win.webContents.openDevTools();
//       }
//     });
//   }

//   // Additional debugging: log errors
//   win.webContents.on('crashed', () => {
//     console.error('The window has crashed');
//   });

//   win.webContents.on('unresponsive', () => {
//     console.warn('The window is unresponsive');
//   });
// }

// app.whenReady().then(() => {
//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// const path = require('path');
// const url = require('url');
// const { app, BrowserWindow } = require('electron');
// const express = require('express');

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       contextIsolation: true,
//       nodeIntegration: false,
//     },
//   });

//   if (process.env.NODE_ENV === 'development') {
//     // Load the React app served by Vite in development
//     win.loadURL('http://localhost:8000'); // Ensure this matches the port Vite is using
//     win.webContents.openDevTools(); // Enable DevTools in development
//   } else {
//     // Set up Express server to serve the built React app
//     const server = express();
//     const port = 3000; // You can choose any available port

//     server.use(express.static(path.join(__dirname, 'dist')));

//     server.listen(port, () => {
//       console.log(`Server running on http://localhost:${port}`);
//       win.loadURL(`http://localhost:${port}`);
//     });

//     // Optionally, enable DevTools in production by pressing F12
//     win.webContents.on('before-input-event', (event, input) => {
//       if (input.key === 'F12') {
//         win.webContents.openDevTools();
//       }
//     });
//   }

//   // Additional debugging: log errors
//   win.webContents.on('crashed', () => {
//     console.error('The window has crashed');
//   });

//   win.webContents.on('unresponsive', () => {
//     console.warn('The window is unresponsive');
//   });
// }

// app.whenReady().then(() => {
//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

const { app, BrowserWindow } = require('electron');
const path = require('path');

// Use dynamic import for ESM module
(async () => {
  await import('./miniserver.js');
})();

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: false,
    },
  });

  const startURL = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8000'
    : `file://${path.join(__dirname, 'dist', 'index.html')}`;

  win.loadURL(startURL);

  if (process.env.NODE_ENV === 'development') {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// const { app, BrowserWindow } = require('electron');
// const path = require('path');

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       contextIsolation: true,
//       nodeIntegration: false,
//       webSecurity: false,
//     },
//   });

//   // Conditionally load based on environment
//   const startURL = process.env.NODE_ENV === 'development'
//     ? 'http://localhost:8000' // Vite dev server
//     : `file://${path.join(__dirname, 'dist', 'index.html')}`; // Production build

//   win.loadURL(startURL);

//   if (process.env.NODE_ENV === 'development') {
//     win.webContents.openDevTools();
//   }
// }

// app.whenReady().then(() => {
//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// process.on('uncaughtException', (error) => {
//   console.error('Uncaught Exception:', error);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Rejection at:', promise, 'reason:', reason);
// });

// const { app, BrowserWindow } = require('electron');
// const { exec } = require('child_process');
// const path = require('path');
// const fs = require('fs');
// const logPath = path.join(app.getPath('userData'), 'error-log.txt');

// function logError(message) {
//   console.error(message);
//   fs.appendFileSync(logPath, `${new Date().toISOString()} - ${message}\n`);
// }

// function createWindow() {
//   logError('Creating BrowserWindow');
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       contextIsolation: true,
//       nodeIntegration: false,
//       webSecurity: false,
//     },
//   });

//   const startURL = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'dist', 'index.html')}`;
//   logError(`Loading URL: ${startURL}`);
//   win.loadURL(startURL).then(() => {
//     logError('URL Loaded successfully');
//   }).catch((err) => {
//     logError(`Failed to load URL: ${err}`);
//   });

//   win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
//     logError(`Failed to load: ${errorCode} - ${errorDescription}`);
//   });

//   win.webContents.on('crashed', () => {
//     logError('Window crashed');
//   });

//   win.webContents.on('did-finish-load', () => {
//     logError('Window finished loading');
//   });

//   win.webContents.openDevTools();
// }

// app.whenReady().then(() => {
//   logError('App is ready');
//   exec('npm run start-mini-server', (error, stdout, stderr) => {
//     if (error) {
//       logError(`Error starting mini server: ${error}`);
//       return;
//     }
//     logError(`Mini server stdout: ${stdout}`);
//     if (stderr) {
//       logError(`Mini server stderr: ${stderr}`);
//     }
//   });

//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });

// process.on('uncaughtException', (error) => {
//   logError(`Uncaught Exception: ${error}`);
// });

// process.on('unhandledRejection', (reason, promise) => {
//   logError(`Unhandled Rejection at: ${promise} - reason: ${reason}`);
// });

// const path = require('path');
// const { app, BrowserWindow } = require('electron');

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 800,
//     height: 600,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'), // Optional, if you have a preload script
//       contextIsolation: true,  // Better security
//       nodeIntegration: false,  // Better security
//     },
//   });

//   // Load the React app served by Vite
//   win.loadURL('http://localhost:8000'); // Ensure this matches the port Vite is using
// }

// app.whenReady().then(() => {
//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') {
//     app.quit();
//   }
// });
