// server/index.js
import express from "express";
import dotenv from "dotenv";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.YT_API_KEY;
const DEFAULT_CHANNEL = process.env.CHANNEL_ID;

if (!API_KEY) {
    console.error("Missing YT_API_KEY in .env");
    process.exit(1);
}



async function fetchJson(url) {
    const r = await fetch(url);
    if (!r.ok) {
        const text = await r.text();
        throw new Error(`Fetch error ${r.status}: ${text}`);
    }
    return r.json();
}

async function isShortsUrl(videoId) {
    try {
        const res = await fetch(`https://www.youtube.com/shorts/${videoId}`, {
            method: "HEAD",
            redirect: "manual"
        });
        return res.status === 200;
    } catch (e) {
        return false;
    }
}

async function getUploadsPlaylistId(channelId) {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${API_KEY}`;
    const j = await fetchJson(url);
    const item = (j.items && j.items[0]) || null;
    if (!item) throw new Error("Channel not found");
    return item.contentDetails.relatedPlaylists.uploads;
}

async function getVideosFromPlaylist(playlistId, limit = 50) {
    const videos = [];
    let pageToken = "";
    const pageSize = 50;

    while (videos.length < limit) {
        const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
        url.searchParams.set("part", "snippet,contentDetails");
        url.searchParams.set("playlistId", playlistId);
        url.searchParams.set("maxResults", String(pageSize));
        if (pageToken) url.searchParams.set("pageToken", pageToken);
        url.searchParams.set("key", API_KEY);

        const j = await fetchJson(url.toString());
        const items = j.items || [];

        // Process items in parallel to check for Shorts
        const processed = await Promise.all(items.map(async (it) => {
            const snippet = it.snippet || {};
            const videoId = (snippet.resourceId && snippet.resourceId.videoId) || (it.contentDetails && it.contentDetails.videoId);
            if (!videoId) return null;

            const isShort = await isShortsUrl(videoId);

            return {
                id: videoId,
                title: snippet.title,
                description: snippet.description,
                publishedAt: snippet.publishedAt,
                thumbnails: snippet.thumbnails,
                isShort: isShort
            };
        }));

        processed.forEach(v => {
            if (v) videos.push(v);
        });

        pageToken = j.nextPageToken || "";
        if (!pageToken) break;
    }
    return videos.slice(0, limit);
}

app.get("/api/videos", async (req, res) => {
    try {
        const channelId = req.query.channelId || DEFAULT_CHANNEL;
        const limit = Math.min(parseInt(req.query.limit || "50", 10), 500);
        if (!channelId) return res.status(400).json({ ok: false, error: "Missing channelId" });
        const uploads = await getUploadsPlaylistId(channelId);
        const videos = await getVideosFromPlaylist(uploads, limit);
        res.json({ ok: true, count: videos.length, videos });
    } catch (err) {
        console.error(err);
        res.status(500).json({ ok: false, error: String(err) });
    }
});

// Endpoint to get channel details (logo, title)
app.get('/api/channel', async (req, res) => {
    try {
        const channelId = req.query.channelId || DEFAULT_CHANNEL;
        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`;
        const j = await fetchJson(url);

        const channel = j.items && j.items[0];
        if (!channel) {
            return res.status(404).json({ ok: false, error: 'Channel not found' });
        }

        res.json({
            ok: true,
            channel: {
                title: channel.snippet.title,
                logo: channel.snippet.thumbnails.default.url,
            },
        });
    } catch (error) {
        console.error('Error fetching channel:', error);
        res.status(500).json({ ok: false, error: 'Failed to fetch channel info' });
    }
});

app.listen(PORT, () => {
    console.log(`Local API listening at http://localhost:${PORT}`);
    console.log("Make sure you run Vite dev (npm run dev) and this server for /api proxy.");
});
