# YouTube Channel Video Gallery

A beautiful, responsive video gallery website that displays videos from any YouTube channel. Built with React, Vite, and Tailwind CSS, featuring a premium dark/light theme, Shorts detection, and seamless deployment to Vercel.

![Screenshot](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## Live Demo

[Click to open](https://you-tube-channel-video-gallery.vercel.app/)

## ✨ Features

- 🎥 **YouTube Integration** - Fetch and display videos from any YouTube channel
- 🔍 **Smart Search** - Real-time video search functionality
- 📱 **Shorts Detection** - Automatically detects and displays YouTube Shorts with vertical layout
- 🎨 **Premium Design** - Beautiful dark/light theme with glassmorphism effects
- 📊 **Video Filtering** - Filter by All, Videos, or Shorts
- 🔢 **Dynamic Loading** - Choose how many videos to load (10, 25, 50, 100, 500)
- ⚡ **Responsive** - Fully responsive design for all screen sizes
- 🎯 **Theme Persistence** - Remembers your theme preference
- 🚀 **Optimized Performance** - Fast loading with serverless functions
- 🔐 **Secure** - API keys hidden in environment variables

## 📁 Project Structure

```
my-youtube-site/
├── api/                          # Vercel Serverless Functions
│   ├── video.js                  # Fetches videos with Shorts detection
│   └── channel.js                # Fetches channel info (logo, title)
│
├── server/                       # Local Development Server (not deployed)
│   ├── index.js                  # Express server for local development
│   └── .env                      # Environment variables (local only)
│
├── src/                          # React Frontend
│   ├── components/
│   │   ├── VideoCard.jsx         # Individual video card component
│   │   └── VideoModal.jsx        # Video player modal with Shorts support
│   ├── App.jsx                   # Main application component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles with Tailwind
│
├── public/                       # Static assets
│
├── vercel.json                   # Vercel deployment configuration
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── package.json                  # Dependencies and scripts
├── DEPLOYMENT.md                 # Detailed Vercel deployment guide
└── README.md                     # This file
```

### Key Files Explained

- **`api/video.js`** - Serverless function that fetches videos from YouTube API and detects Shorts
- **`api/channel.js`** - Serverless function that fetches channel branding (logo, title)
- **`server/index.js`** - Local Express server for development (mirrors serverless functions)
- **`src/App.jsx`** - Main React component with all UI logic
- **`vercel.json`** - Tells Vercel how to build and route the application
- **`.env`** - Local environment variables (never committed to Git)

## 🚀 Getting Started

### Prerequisites

1. **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
2. **YouTube Data API Key** - [Get one here](https://developers.google.com/youtube/v3/getting-started)
3. **Your YouTube Channel ID** - [Find it here](https://www.youtube.com/account_advanced)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-youtube-site
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   
   Create `server/.env` file:
   ```env
   YT_API_KEY=your_youtube_api_key_here
   CHANNEL_ID=your_channel_id_here
   PORT=3000
   ```

4. **Start the development servers**
   
   Open **two terminal windows**:
   
   **Terminal 1** - Frontend (Vite):
   ```bash
   npm run dev
   ```
   
   **Terminal 2** - Backend (Express):
   ```bash
   cd server
   node index.js
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

The frontend (Vite) runs on port 5173 and proxies API requests to the backend (Express) on port 3000.

## 🌐 Vercel Deployment

### Quick Deploy

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Vercel auto-detects Vite
   - Click **Deploy**

3. **Add Environment Variables**
   - Go to Project → **Settings** → **Environment Variables**
   - Add:
     - `YT_API_KEY` = Your YouTube API key
     - `CHANNEL_ID` = Your YouTube Channel ID
   - Click **Save**

4. **Redeploy**
   - Go to **Deployments** tab
   - Click **Redeploy** on the latest deployment

**That's it!** Your site is live on `your-project.vercel.app`

For detailed deployment instructions, see [`DEPLOYMENT.md`](./DEPLOYMENT.md)

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `YT_API_KEY` | YouTube Data API v3 key | ✅ Yes |
| `CHANNEL_ID` | Your YouTube Channel ID | ✅ Yes |
| `PORT` | Server port (local dev only) | ❌ No (default: 3000) |

### Getting YouTube API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable **YouTube Data API v3**
4. Create credentials → **API Key**
5. Copy the key

### Finding Your Channel ID

1. Go to [YouTube Advanced Settings](https://www.youtube.com/account_advanced)
2. Your Channel ID is at the bottom
3. Starts with `UC...`

## 🎨 Customization

### Change Channel
Update `CHANNEL_ID` in environment variables to display any YouTube channel's videos.

### Modify Theme Colors
Edit `tailwind.config.js` to customize colors:
```js
theme: {
  extend: {
    colors: {
      // Add your custom colors
    }
  }
}
```

### Adjust Video Limits
Edit the limit options in `src/App.jsx`:
```javascript
{[10, 25, 50, 100, 500].map((l) => ...)}
```

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Vercel Serverless Functions (Node.js)
- **API:** YouTube Data API v3
- **Deployment:** Vercel
- **Development Server:** Express.js

## 📝 Scripts

```bash
npm run dev          # Start Vite dev server (frontend)
npm run build        # Build for production
npm run preview      # Preview production build
```

For backend (local development):
```bash
cd server
node index.js        # Start Express server
```

## 🔒 Security

- ✅ API keys stored in environment variables
- ✅ `.env` file excluded from Git
- ✅ Serverless functions hide API keys from frontend
- ✅ No sensitive data in client-side code

**Never commit your `.env` file!** It's already in `.gitignore`.

## 🐛 Troubleshooting

### Videos not loading
- Verify `YT_API_KEY` is set correctly
- Check API quota in Google Cloud Console
- Ensure `CHANNEL_ID` is correct

### Shorts not detected
- Shorts detection uses asynchronous URL checks
- May take a moment to load
- Check browser console for errors

### Local development issues
- Make sure both servers are running (Vite + Express)
- Check that port 3000 and 5173 are available
- Clear browser cache and reload

## 📄 License

MIT License - feel free to use this project for your own channel!

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📧 Support

For issues and questions:
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
- Open an issue on GitHub
- Review [Vercel documentation](https://vercel.com/docs)

---

**Made with ❤️ using React, Vite, and YouTube API**
