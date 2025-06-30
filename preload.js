// Import contextBridge and ipcRenderer from Electron
const { contextBridge, ipcRenderer } = require('electron');

// Expose a global API (electronAPI) to the renderer process
// This is a secure way to allow renderer process to communicate with the main process
contextBridge.exposeInMainWorld('electronAPI', {
  /**
   * Gets the directory name of a path.
   * @param {string} filePath - The file path.
   * @returns {Promise<string>} The directory name.
   */
  getDirname: (filePath) => ipcRenderer.invoke('path:dirname', filePath),
  
  /**
   * Joins all given path segments together.
   * @param {...string} paths - The path segments to join.
   * @returns {Promise<string>} The joined path.
   */
  pathJoin: (...paths) => ipcRenderer.invoke('path:join', ...paths),
  /**
   * Invokes the 'dialog:openFile' IPC handler in the main process
   * to open a file selection dialog.
   * @returns {Promise<string|null>} A promise that resolves with the selected file path, or null if canceled.
   */
  selectFile: () => ipcRenderer.invoke('dialog:openFile'),

  /**
   * Invokes the 'dialog:openFolder' IPC handler in the main process
   * to open a folder selection dialog.
   * @returns {Promise<string|null>} A promise that resolves with the selected folder path, or null if canceled.
   */
  selectFolder: () => ipcRenderer.invoke('dialog:openFolder'),

  /**
   * Invokes the 'dialog:openOutputFolder' IPC handler in the main process
   * to open a dialog for selecting an output directory.
   * @returns {Promise<string|null>} A promise that resolves with the selected folder path, or null if canceled.
   */
  selectOutputFolder: () => ipcRenderer.invoke('dialog:openOutputFolder'),

  /**
   * Invokes the 'fs:readDirectory' IPC handler in the main process
   * to read the contents of a specified directory.
   * @param {string} folderPath The path to the directory to read.
   * @returns {Promise<string[]>} A promise that resolves with an array of file/folder names inside the directory.
   */
  readDirectory: (folderPath) => ipcRenderer.invoke('fs:readDirectory', folderPath),

  /**
   * Invokes the 'video:convert' IPC handler in the main process
   * to convert a video file.
   * @param {string} inputPath - The path to the input video file.
   * @param {string} [outputPath] The path to the output video file. If not provided, it defaults to the same directory as input with .mov extension.
   * @param {string} [quality='medium'] The quality setting for the output video ('high', 'medium', or 'low').
   * @returns {Promise<string>} A promise that resolves with a success message or rejects with an error message.
   */
  convertVideo: (inputPath, outputPath, quality = 'medium') => ipcRenderer.invoke('video:convert', inputPath, outputPath, quality)
});
