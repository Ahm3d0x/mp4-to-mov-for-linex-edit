# MP4 to MOV Video Converter

A powerful and user-friendly desktop application built with Electron.js for converting MP4 video files into the professional MOV format using the Apple ProRes codec. Designed specifically for video editors and content creators who need high-quality video conversion on Linux systems.

![Application Screenshot](screenshot.png)

## ✨ Features

- **High-Quality Conversion**: Convert MP4 videos to MOV format with ProRes codec
- **Multiple Quality Presets**: Choose from different quality settings (High, Medium, Low)
- **Batch Processing**: Convert multiple files or entire folders at once
- **Intuitive Interface**: Simple drag-and-drop functionality
- **Cross-Platform**: Works on Linux (primary) and other desktop platforms
- **Native Performance**: Built with Electron for optimal performance

## 🚀 Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher) or Yarn
- FFmpeg (will be installed automatically as a dependency)

### Installing the Application

#### From Pre-built Package (Recommended)

1. Download the latest `.deb` package from the releases page
2. Install using your package manager:
   ```bash
   sudo dpkg -i mp4-to-mov-converter_*.deb
   sudo apt-get install -f  # Install any missing dependencies
   ```

#### From Source

1. Clone the repository:
   ```bash
   git clone https://github.com/Ahm3d0x/mp4-to-mov-converter.git
   cd mp4-to-mov-converter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

## 🛠 Building from Source

To build the application for your platform:

```bash
# Install build dependencies
npm install

# Build the application
npm run dist

# The built package will be in the 'dist' directory
```

## 🎬 Usage

1. **Select Files/Folders**:
   - Click "Select File" to choose individual MP4 files
   - Click "Select Folder" to convert all MP4 files in a directory
   - Or simply drag and drop files/folders into the application window

2. **Choose Output Quality**:
   - Select your preferred quality preset (High, Medium, or Low)
   - High: Best quality (ProRes 4444)
   - Medium: Balanced quality and size (ProRes 422 HQ)
   - Low: Smaller file size (ProRes Proxy)

3. **Select Output Directory**:
   - Click "Select Output Folder" to choose where to save the converted files
   - If no output folder is selected, files will be saved in the same directory as the source

4. **Start Conversion**:
   - Click "Convert" to begin the conversion process
   - Progress will be shown in the status area

## 📁 Output

- Converted files will be saved with `_high`, `_medium`, or `_low` suffix based on the selected quality
- Original files remain unchanged
- Conversion logs are displayed in the application console

## 🛠 Dependencies

- Electron
- ffmpeg-static
- Node.js native modules (fs, path, child_process)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 About the Developer

👋 **Ahmed Mohamed Attia Mohamed**  
🎓 Student at Faculty of Engineering, Zagazig University  
📚 Major: Communications and Electronics Engineering  
📍 From Kafr Saqr, El-Sharqia, Egypt  
📧 Email: [ahm3d.m.attia@gmail.com](mailto:ahm3d.m.attia@gmail.com)  
🔗 GitHub: [github.com/Ahm3d0x](https://github.com/Ahm3d0x)  
🔗 LinkedIn: [linkedin.com/in/ahmed-m-attia-757aa6292](https://www.linkedin.com/in/ahmed-m-attia-757aa6292/)

## 🙏 Acknowledgments

- Thanks to the Electron.js team for the amazing framework
- Special thanks to the FFmpeg project for powerful video processing
- Inspired by the need for better video conversion tools on Linux
