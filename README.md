


# MP4 to MOV Video Converter

A powerful and user-friendly desktop application built with [Electron.js](https://www.electronjs.org/) for converting MP4 video files into the professional MOV format using the Apple ProRes codec. Specifically designed for video editors and content creators who need high-quality video conversion on Linux systems.

---

## 📸 Application Screenshot

![Screenshot of the MP4 to MOV Video Converter Application](https://raw.githubusercontent.com/Ahm3d0x/mp4-to-mov-for-linex-edit/main/assets/Screenshot%20from%202025-06-30%2012-26-30.png)

---

## ✨ Features

* **High-Quality Conversion:** Converts MP4 videos to MOV format with ProRes codec and uncompressed PCM audio, ensuring optimal quality for editing workflows.
* **Multiple Quality Presets:** Choose from different ProRes quality settings to balance file size and visual fidelity:
    * **High:** Best quality (ProRes 4444). Ideal for scenarios where maximum fidelity and color depth are critical, resulting in larger file sizes.
    * **Medium:** Balanced quality and size (ProRes 422 HQ). A great all-rounder for most professional editing tasks.
    * **Low:** Smaller file size (ProRes Proxy). Suitable for offline editing or situations where storage space is a concern, while still offering better performance than compressed formats.
* **Batch Processing:** Convert multiple files or entire folders at once for efficient workflows.
* **Intuitive Interface:** Simple drag-and-drop functionality makes conversion quick and easy.
* **Cross-Platform:** While primarily designed for Linux, it leverages Electron for potential compatibility across other desktop platforms.
* **Native Performance:** Built with Electron to deliver optimal performance and a native feel.
* **Intelligent Video Description Generator (Powered by Gemini AI):** After conversion, get creative descriptions and relevant hashtags for your videos based on provided keywords.
* **Smart Conversion Tips (Powered by Gemini AI):** Access quick and helpful tips on ProRes best practices and DaVinci Resolve workflows.

---

## 🚀 Installation

### Prerequisites

* [Node.js](https://nodejs.org/) (v14 or higher)
* [npm](https://www.npmjs.com/) (v6 or higher) or [Yarn](https://yarnpkg.com/)
* [FFmpeg](https://ffmpeg.org/) (will be installed automatically as a dependency via `ffmpeg-static`)

### Installing the Application

#### From Pre-built Package (Recommended)

1.  Download the latest `.deb` package from the [releases page](https://github.com/Ahm3d0x/mp4-to-mov-for-linex-edit/releases) on GitHub.
2.  Install using your package manager:

    ```bash
    sudo dpkg -i mp4-to-mov-converter_*.deb
    sudo apt-get install -f # Install any missing dependencies
    ```

#### From Source

1.  Clone the repository:

    ```bash
    git clone [https://github.com/Ahm3d0x/mp4-to-mov-for-linex-edit.git](https://github.com/Ahm3d0x/mp4-to-mov-for-linex-edit.git)
    cd mp4-to-mov-for-linex-edit
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Start the application:

    ```bash
    npm start
    ```

### 🛠 Building from Source

To build the application for your platform:

```bash
# Install build dependencies
npm install

# Build the application
npm run dist
```

The built package will be in the `dist` directory.



## 🎬 Usage

1.  **Select Files/Folders:**
      * Click "Select a Video File" to choose individual MP4 files.
      * Click "Select a Folder" to convert all MP4 files in a directory.
      * Or simply drag and drop files/folders into the application window.
2.  **Choose Output Quality:**
      * Select your preferred quality preset (High, Medium, or Low) from the available options.
3.  **Select Output Directory:**
      * Click "Select Output Folder" to choose where to save the converted files.
      * If no output folder is selected, files will be saved in the same directory as the source.
4.  **Start Conversion:**
      * The conversion begins automatically once files/folders are selected or dropped.
      * Progress and status messages will be shown in the application's status area.
5.  **Use AI Features:**
      * **Generate Video Description:** After a single conversion is complete, a button will appear. Click it and provide keywords to generate a content-relevant description and hashtags.
      * **Get Conversion Tip:** Click the dedicated button to receive general tips about ProRes and DaVinci Resolve.

-----

## 📁 Output

  * Converted files will be saved with `_high`, `_medium`, or `_low` suffix based on the selected quality (e.g., `my_video_high.mov`).
  * Original MP4 files remain unchanged.
  * Conversion logs are displayed in the application console (for debugging/detailed info).

-----

## 🛠 Dependencies

  * **Electron:** The framework for building cross-platform desktop apps with web technologies.
  * **ffmpeg-static:** Provides a static FFmpeg binary, bundled with the application, ensuring it works out-of-the-box.
  * **Node.js native modules:** `fs` (File System), `path` (Path manipulation), `child_process` (Spawning processes like FFmpeg) for backend operations.

-----

## 🤝 Contributing

Contributions are welcome\! Please feel free to submit a Pull Request to the [GitHub repository](https://www.google.com/search?q=https://github.com/Ahm3d0x/mp4-to-mov-for-linex-edit).

### Contribution Steps

1.  Fork the repository.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

-----

## 📜 License

This project is licensed under the MIT License - see the [LICENSE file](https://www.google.com/search?q=https://github.com/Ahm3d0x/mp4-to-mov-for-linex-edit/blob/main/LICENSE) for details.

-----

## 👨‍💻 About the Developer

👋 **Name:** Ahmed Mohamed Attia Mohamed

🎓 **Education:** Student at Faculty of Engineering, Zagazig University

📚 **Major:** Communications and Electronics Engineering

📍 **Location:** From Kafr Saqr, El-Sharqia, Egypt

📧 **Email:** [ahm3d.m.attia@gmail.com](mailto:ahm3d.m.attia@gmail.com)

🔗 **GitHub:** [Ahm3d0x/mp4-to-mov-for-linex-edit](https://www.google.com/search?q=https://github.com/Ahm3d0x/mp4-to-mov-for-linex-edit)

🔗 **LinkedIn:** [linkedin.com/in/ahmed-m-attia-757aa6292](https://www.google.com/search?q=https://www.linkedin.com/in/ahmed-m-attia-757aa6292)

### 🙏 Acknowledgments

  * Thanks to the [Electron.js](https://www.electronjs.org/) team for the amazing framework.
  * Special thanks to the [FFmpeg](https://ffmpeg.org/) project for powerful video processing.
  * Inspired by the need for better video conversion tools on Linux.


