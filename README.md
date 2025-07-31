# Threat Intelligence Dashboard

A **90's hacker-themed** threat intelligence dashboard that pulls live data from AlienVault OTX, visualizes threats in a custom chart, and provides file/URL malware scanning with enriched details. The interface features a bits dropping background video, blinking text effects, and a neon terminal aesthetic.

---

## 🚀 Features

* **Live Threat Feed**: Fetches subscribed pulses from the AlienVault OTX API and displays indicators, descriptions, and dates.
* **Threat Chart**: Dynamic bar chart visualizing threat severity with label truncation for readability.
* **Malware File Upload**: Users can upload files which are submitted to OTX for analysis; results are retrieved and displayed.
* **URL Submission**: Submit URLs for investigation, with results and detailed metadata fetched from OTX.
* **90's Hacker Theme**: Full-screen background video, blinking text, neon-green terminal font, and custom CSS animations.
* **Embedded Threat Map**: Live Radware threat map iframe for real-time global threat visualization.

---

## 🛠️ Tech Stack

* **Backend**: Node.js, Express.js
* **API**: Axios for HTTP requests
* **File Uploads**: Multer + FormData
* **Frontend**: HTML, CSS, JavaScript, Chart.js
* **Styling**: Custom CSS with blinking effects and background video
* **Security**: CORS, environment variables via `dotenv`

---

## 📦 Prerequisites

* **Node.js & npm** installed (engine requirement: `>= 0.4` as per `package.json`)
* **AlienVault OTX API Key** (register at [OTX AlienVault](https://otx.alienvault.com) to obtain)

---

## ⚙️ Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/Threat-Intelligence-Dashboard.git
   cd Threat-Intelligence-Dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**

   * Create a `.env` file in the project root:

     ```ini
     OTX_API_KEY=your_otx_api_key_here
     ```
   * Ensure `.env` is in `.gitignore`.

4. **Run the server**

   ```bash
   npm start
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000` to view the dashboard.

---

## 📝 Usage

* **View Live Threat Feed**: Data auto-refreshes when you reload the page.
* **Submit a File**: Use the "Choose File" button under **Malware Detection Form** and click **Submit**.
* **Submit a URL**: Enter a URL in the input field and click **Submit**.
* **Inspect Results**: View summary and detailed metadata below the form.
* **Enjoy the Theme**: Background video loops, terminal font blinks, and threat indicators pulse.

---

## 📁 Project Structure

```
├── public/             # Frontend assets (HTML, CSS, JS, video)
├── uploads/            # Temp storage for uploaded files
├── server.js           # Express server and API routes
├── package.json        # Dependency & engine definitions
├── .env                # Environment variables (ignored by Git)
└── .gitignore
```

---

## 🎉 License

This project is open source under the **MIT License**. Feel free to fork, modify, and share!

---

© 2025 Threat Intelligence Dashboard Project. Enjoy the 90's hacker vibes! Keep it green, keep it mean.
