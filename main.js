// Import necessary modules from Electron
const { app, BrowserWindow, ipcMain, dialog, Menu } = require('electron');
// Import Node.js path module for handling file paths
const path = require('path');
// Import Node.js child_process for executing FFmpeg commands
const { execFile } = require('child_process');
// Import ffmpeg-static to get the path to the FFmpeg executable
const ffmpegStatic = require('ffmpeg-static');
// Import Node.js fs module for file system operations
const fs = require('fs/promises'); // Using promises API for async operations

/**
 * Creates the main application window.
 */
Menu.setApplicationMenu(null);
function createWindow() {
  // Create a new browser window with specific dimensions and properties
  const mainWindow = new BrowserWindow({
    width: 800, // Fixed width
    height: 900, // Fixed height
    title: 'MP4 to MOV Video Converter',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.resolve(__dirname, 'assets/icon.png'),
    show: false
  });

  // Show window when ready to prevent flickering
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Load the index.html file into the main window
  mainWindow.loadFile('app.html');

  // Open the DevTools. This is useful for debugging.
  // mainWindow.webContents.openDevTools();
}

// Window control handlers
ipcMain.on('window:minimize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) window.minimize();
});

ipcMain.on('window:maximize', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) {
    if (window.isMaximized()) {
      window.unmaximize();
    } else {
      window.maximize();
    }
  }
});

ipcMain.on('window:close', (event) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window) window.close();
});

// Event listener: App is ready to create browser windows
app.whenReady().then(() => {
  createWindow(); // Call the function to create the window

  // Event listener: If no windows are open and the app is activated (e.g., clicking dock icon on macOS)
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(); // Create a new window if none exist
    }
  });
});

// Event listener: Quit the app when all windows are closed, unless on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit(); // Quit the application if not on macOS
  }
});

// IPC Handler: Opens a system file dialog to select a single .mp4 file.
ipcMain.handle('dialog:openFile', async () => {
  try {
    // Show an open dialog to select files
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openFile'], // Allow selecting files
      filters: [{ name: 'MP4 Videos', extensions: ['mp4'] }] // Filter for .mp4 files
    });
    // Return the selected file path or null if canceled
    return canceled ? null : filePaths[0];
  } catch (error) {
    console.error('Error opening file dialog:', error);
    return null;
  }
});

// IPC Handler: Opens a system folder dialog to select a directory.
ipcMain.handle('dialog:openFolder', async () => {
  try {
    // Show an open dialog to select directories
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory'] // Allow selecting directories
    });
    // Return the selected folder path or null if canceled
    return canceled ? null : filePaths[0];
  } catch (error) {
    console.error('Error opening folder dialog:', error);
    return null;
  }
});

// IPC Handler: Opens a system folder dialog to select an output directory.
ipcMain.handle('dialog:openOutputFolder', async () => {
  try {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory'] // Allow selecting and creating directories
    });
    return canceled ? null : filePaths[0];
  } catch (error) {
    console.error('Error opening output folder dialog:', error);
    return null;
  }
});

// IPC Handler: Reads the contents of a directory and returns a list of file names.
ipcMain.handle('fs:readDirectory', async (event, folderPath) => {
  try {
    // Read all entries in the given directory
    const files = await fs.readdir(folderPath);
    return files;
  } catch (error) {
    console.error(`Error reading directory ${folderPath}:`, error);
    return [];
  }
});

// IPC Handler: Gets the directory name of a path.
ipcMain.handle('path:dirname', async (event, filePath) => {
  try {
    return path.dirname(filePath);
  } catch (error) {
    console.error(`Error getting directory name for path ${filePath}:`, error);
    throw error;
  }
});

// IPC Handler: Joins all given path segments together.
ipcMain.handle('path:join', async (event, ...paths) => {
  try {
    return path.join(...paths);
  } catch (error) {
    console.error('Error joining paths:', paths, error);
    throw error;
  }
});

// IPC Handler: Converts a video file using FFmpeg with quality settings.
ipcMain.handle('video:convert', async (event, inputPath, outputPath, quality = 'medium') => {
  // If outputPath is not provided, derive it from inputPath
  const finalOutputPath = outputPath || inputPath.replace(/\.mp4$/i, '.mov');

  return new Promise((resolve, reject) => {
    // Base FFmpeg arguments
    const args = ['-i', inputPath]; // Input file
    
    // Video codec settings based on quality
    switch (quality) {
      case 'high':
        // High quality: ProRes 4444 (best quality, largest file size)
        args.push(
          '-c:v', 'prores_ks',
          '-profile:v', '4',  // ProRes 4444
          '-qscale:v', '9',   // Highest quality (lower is better, range is 9-13 for ProRes)
          '-vendor', 'ap10',  // Apple ProRes 4444
          '-pix_fmt', 'yuv444p10le'  // 10-bit 4:4:4 color
        );
        break;
        
      case 'low':
        // Low quality: ProRes Proxy (smallest file size, lower quality)
        args.push(
          '-c:v', 'prores_ks',
          '-profile:v', '0',  // ProRes Proxy
          '-qscale:v', '31',  // Lower quality (higher value = lower quality/better compression)
          '-vf', 'scale=iw/2:ih/2'  // Scale down to half resolution
        );
        break;
        
      case 'medium':
      default:
        // Medium quality: ProRes 422 HQ (good balance of quality and size)
        args.push(
          '-c:v', 'prores_ks',
          '-profile:v', '3',  // ProRes 422 HQ
          '-qscale:v', '11'   // Balanced quality (default for ProRes 422)
        );
    }
    
    // Common audio settings (uncompressed audio for editing)
    args.push(
      '-c:a', 'pcm_s16le',
      finalOutputPath
    );

    // Execute the FFmpeg command
    // ffmpegStatic.path provides the path to the bundled FFmpeg executable
    const ffmpegProcess = execFile(ffmpegStatic, args, (error, stdout, stderr) => {
      if (error) {
        console.error(`FFmpeg conversion error for ${inputPath}:`, error);
        reject(`Conversion failed: ${error.message}. Check console for details.`);
        return;
      }
      console.log(`FFmpeg stdout for ${inputPath}:`, stdout);
      console.log(`FFmpeg stderr for ${inputPath}:`, stderr);
      resolve('Conversion complete!');
    });

    // Optional: Listen for FFmpeg process exit to log success/failure
    ffmpegProcess.on('exit', (code) => {
      if (code === 0) {
        console.log(`FFmpeg process for ${inputPath} exited successfully.`);
      } else {
        console.error(`FFmpeg process for ${inputPath} exited with code ${code}.`);
      }
    });
  });
});
