// Get references to DOM elements
const dropZone = document.getElementById('drop-zone');
const selectFileBtn = document.getElementById('select-file-btn');
const selectFolderBtn = document.getElementById('select-folder-btn');
const selectOutputFolderBtn = document.getElementById('select-output-folder-btn');
const outputFolderPathSpan = document.getElementById('output-folder-path');
const statusMessage = document.getElementById('status-message');
const qualitySelect = document.getElementById('quality-select');

let currentOutputDirectory = ''; // Variable to store the selected output directory path

/**
 * Update the status message displayed to the user.
 * @param {string} message - The message to display.
 * @param {string} [type='info'] - The type of message ('info', 'success', 'error'). Affects the color.
 */
function setStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.style.color = ''; // Reset color
    if (type === 'success') {
        statusMessage.style.color = '#98c379'; // Green
    } else if (type === 'error') {
        statusMessage.style.color = '#e06c75'; // Red
    } else {
        statusMessage.style.color = '#abb2bf'; // Default gray
    }
}

/**
 * Converts a single video file from MP4 to MOV (ProRes).
 * @param {string} inputPath - The full path to the input .mp4 file.
 */
async function convertVideo(inputPath) {
    if (!inputPath.toLowerCase().endsWith('.mp4')) {
        setStatus(`Skipping non-MP4 file: ${inputPath.split(/[\/\\]/).pop()}`, 'error');
        return;
    }

    const fileName = inputPath.split(/[\/\\]/).pop(); // Get just the filename
    const baseName = fileName.replace(/\.mp4$/i, ''); // Get filename without extension
    
    // Get the selected quality
    const quality = qualitySelect.value;

    // Determine the output directory
    const outputDir = currentOutputDirectory || await window.electronAPI.getDirname(inputPath);
    
    // Create output filename with quality suffix
    const qualitySuffix = `_${quality}`;
    const outputFileName = `${baseName}${qualitySuffix}.mov`;
    const finalOutputPath = await window.electronAPI.pathJoin(outputDir, outputFileName);

    setStatus(`Converting: ${fileName}...`, 'info');

    try {
        // Call the main process to perform the FFmpeg conversion with the specified output path and quality
        const result = await window.electronAPI.convertVideo(inputPath, finalOutputPath, quality);
        setStatus(`${fileName}: ${result}`, 'success');
    } catch (error) {
        setStatus(`${fileName}: ${error}`, 'error');
        console.error(`Conversion failed for ${fileName}:`, error);
    }
}

// --- Button Event Handlers ---

// Click event listener for "Select Video File" button
selectFileBtn.addEventListener('click', async () => {
    setStatus('Waiting for file selection...');
    // Call IPC handler to open file dialog
    const filePath = await window.electronAPI.selectFile();
    if (filePath) {
        await convertVideo(filePath); // Start conversion if file is selected
    } else {
        setStatus('File selection cancelled.', 'info');
    }
});

// Click event listener for "Select Folder" button
selectFolderBtn.addEventListener('click', async () => {
    setStatus('Waiting for folder selection...');
    // Call IPC handler to open folder dialog
    const folderPath = await window.electronAPI.selectFolder();
    if (folderPath) {
        setStatus(`Reading files in: ${folderPath}...`, 'info');
        // Call IPC handler to read directory contents
        const files = await window.electronAPI.readDirectory(folderPath);
        const mp4Files = files.filter(file => file.toLowerCase().endsWith('.mp4'));

        if (mp4Files.length === 0) {
            setStatus('No MP4 files found in the selected folder.', 'info');
            return;
        }

        setStatus(`Found ${mp4Files.length} MP4 file(s). Starting conversion...`, 'info');
        // Loop through each MP4 file and start conversion
        for (const file of mp4Files) {
            // Create full input file path using IPC (path.join)
            const fullPath = await window.electronAPI.pathJoin(folderPath, file);
            await convertVideo(fullPath); // Wait for each conversion to complete
        }
        setStatus('All conversions in the folder completed!', 'success');
    } else {
        setStatus('Folder selection cancelled.', 'info');
    }
});

// Click event listener for "Select Output Folder" button
selectOutputFolderBtn.addEventListener('click', async () => {
    setStatus('Waiting for output folder selection...');
    const folderPath = await window.electronAPI.selectOutputFolder();
    if (folderPath) {
        currentOutputDirectory = folderPath;
        outputFolderPathSpan.textContent = `Output Folder: ${folderPath}`;
        setStatus('Output folder selected successfully.', 'success');
    } else {
        setStatus('Output folder selection cancelled.', 'info');
    }
});

// --- Drag and Drop Event Handlers ---

// Prevent default drag behaviors and add visual feedback
dropZone.addEventListener('dragover', (event) => {
    event.preventDefault(); // Prevent default drag behavior
    event.stopPropagation(); // Stop event propagation
    dropZone.classList.add('drag-over'); // Add CSS class for visual feedback
    setStatus('Release to drop files...', 'info');
});

// Remove visual feedback when leaving the drop zone
dropZone.addEventListener('dragleave', (event) => {
    event.preventDefault();
    event.stopPropagation();
    dropZone.classList.remove('drag-over');
    setStatus('Drag and drop video(s) or folder here', 'info');
});

// Handle dropped files/folders
dropZone.addEventListener('drop', async (event) => {
    event.preventDefault(); // Prevent default drop behavior (like opening the file in the browser)
    event.stopPropagation();
    dropZone.classList.remove('drag-over'); // Remove drag-over class

    setStatus('Processing dropped items...', 'info');

    const files = event.dataTransfer.files; // Get the dropped files/items
    let convertedCount = 0;
    let skippedCount = 0;

    for (let i = 0; i < files.length; i++) {
        const item = files[i];
        // Check if the dropped item is a file and ends with .mp4
        if (item.path.toLowerCase().endsWith('.mp4')) {
            await convertVideo(item.path);
            convertedCount++;
        } else if (item.path) { // If it's a folder or other file type, try to read it as a directory
            try {
                // Read the directory if it's a folder
                const folderContents = await window.electronAPI.readDirectory(item.path);
                if (folderContents && folderContents.length >= 0) { // If it's a directory
                    const mp4Files = folderContents.filter(file => file.toLowerCase().endsWith('.mp4'));
                    if (mp4Files.length > 0) {
                        setStatus(`Converting files from folder: ${item.path.split(/[\\/]/).pop()}`, 'info');
                        for (const file of mp4Files) {
                            // Create full input file path using IPC (path.join)
                            const fullPath = await window.electronAPI.pathJoin(item.path, file);
                            await convertVideo(fullPath); // Custom output folder will be respected
                            convertedCount++;
                        }
                    } else {
                        setStatus(`No MP4 files found in dropped folder: ${item.path.split(/[\\/]/).pop()}`, 'info');
                        skippedCount++;
                    }
                } else {
                    setStatus(`Skipping unsupported file/folder: ${item.path.split(/[\\/]/).pop()}`, 'error');
                    skippedCount++;
                }
            } catch (dirError) {
                // If readDirectory fails, it's probably not a directory or an inaccessible path
                setStatus(`Skipping unsupported item: ${item.path.split(/[\\/]/).pop()} (not MP4 or a readable folder)`, 'error');
                skippedCount++;
            }
        } else {
            setStatus(`Skipping unsupported item: ${item.name || 'unknown item'}`, 'error');
            skippedCount++;
        }
    }

    if (convertedCount > 0) {
        setStatus(`Processed all items. Converted: ${convertedCount}, Skipped: ${skippedCount}.`, 'success');
    } else {
        setStatus('No valid MP4 files were dragged or selected for conversion.', 'info');
    }
});

// Initial status message when the app loads
document.addEventListener('DOMContentLoaded', () => {
    setStatus('Ready');
    outputFolderPathSpan.textContent = 'Output Folder: (Same as input folder by default)';
});
