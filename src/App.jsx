import React, { useEffect, useState } from "react";
import VideoCard from "./components/VideoCard";
import VideoModal from "./components/VideoModal";

export default function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openVideo, setOpenVideo] = useState(null);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'videos', 'shorts'
  const [limit, setLimit] = useState(50);
  const [theme, setTheme] = useState(() => {
    // Read from localStorage on initial load
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  function toggleTheme() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  const [channelInfo, setChannelInfo] = useState({ title: "KK Dev", logo: null });

  useEffect(() => {
    async function loadChannelInfo() {
      try {
        const res = await fetch("/api/channel");
        if (res.ok) {
          const json = await res.json();
          if (json.ok && json.channel) {
            setChannelInfo(json.channel);
            document.title = json.channel.title;

            // Update favicon
            let link = document.querySelector("link[rel~='icon']");
            if (!link) {
              link = document.createElement('link');
              link.rel = 'icon';
              document.head.appendChild(link);
            }
            link.href = json.channel.logo;
          }
        }
      } catch (err) {
        console.error("Failed to load channel info", err);
      }
    }
    loadChannelInfo();
  }, []);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/video?limit=${limit}`); // proxy or serverless
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Network error: ${res.status} ${txt}`);
        }
        const json = await res.json();
        if (!json.ok) throw new Error(json.error || "Failed to fetch");
        setVideos(json.videos || []);
      } catch (err) {
        setError(String(err));
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [limit]);

  const filteredVideos = videos.filter((v) => {
    const matchesSearch = v.title.toLowerCase().includes(searchQuery.toLowerCase());

    if (filter === "shorts") return matchesSearch && v.isShort;
    if (filter === "videos") return matchesSearch && !v.isShort;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans selection:bg-cyan-500/30 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/70 dark:bg-black/50 border-b border-gray-200 dark:border-white/10 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 shrink-0">
            {channelInfo.logo ? (
              <img src={channelInfo.logo} alt={channelInfo.title} className="w-8 h-8 rounded-full shadow-lg" />
            ) : (
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <span className="font-bold text-white text-sm">KK</span>
              </div>
            )}
            <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 hidden sm:block">
              {channelInfo.title}
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-white/10 rounded-full leading-5 bg-gray-100 dark:bg-white/5 text-gray-900 dark:text-gray-300 placeholder-gray-500 focus:outline-none focus:bg-white dark:focus:bg-white/10 focus:ring-1 focus:ring-cyan-500/50 focus:border-cyan-500/50 focus:shadow-md sm:text-sm transition-all shadow-sm"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 shadow-sm transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
            <nav>
              <a
                href="https://www.youtube.com/@kkdevtamil"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors px-4 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 hover:shadow-sm"
              >
                View Channel
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {["all", "videos", "shorts"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all capitalize whitespace-nowrap ${filter === type
                  ? "bg-gray-900 dark:bg-white text-white dark:text-black shadow-lg shadow-gray-900/10 dark:shadow-white/10"
                  : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white shadow-sm"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Limit Selector */}
          <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 p-1 rounded-lg shadow-md">
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 px-2 hidden sm:block">Load:</span>
            {[10, 25, 50, 100, 500].map((l) => (
              <button
                key={l}
                onClick={() => setLimit(l)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${limit === l
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  }`}
              >
                {l === 500 ? "500 (Max)" : l}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mb-4"></div>
            <div className="text-gray-500 dark:text-gray-400 animate-pulse">Loading videos...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-6 text-center text-red-600 dark:text-red-400 max-w-lg mx-auto">
            <p className="font-semibold mb-1">Unable to load videos</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        )}

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
          {filteredVideos.map((v) => (
            <VideoCard key={v.id} video={v} onOpen={() => setOpenVideo(v)} />
          ))}
        </section>

        {!loading && filteredVideos.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No videos found matching your criteria.</p>
            {videos.length === 0 && (
              <p className="text-gray-600 text-sm mt-2">Check your Channel ID and API key configuration.</p>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm shadow-sm mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            Copyright © {new Date().getFullYear()} <span className="text-gray-700 dark:text-gray-300 font-medium">KK Dev</span>. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {openVideo && (
        <VideoModal
          video={openVideo}
          onClose={() => setOpenVideo(null)}
          onNext={() => {
            const idx = filteredVideos.findIndex(v => v.id === openVideo.id);
            if (idx < filteredVideos.length - 1) setOpenVideo(filteredVideos[idx + 1]);
          }}
          onPrev={() => {
            const idx = filteredVideos.findIndex(v => v.id === openVideo.id);
            if (idx > 0) setOpenVideo(filteredVideos[idx - 1]);
          }}
          hasNext={filteredVideos.findIndex(v => v.id === openVideo.id) < filteredVideos.length - 1}
          hasPrev={filteredVideos.findIndex(v => v.id === openVideo.id) > 0}
        />
      )}
    </div>
  );
}
