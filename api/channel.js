// api/channel.js
// Vercel serverless function that returns channel details
// Uses process.env.YT_API_KEY and process.env.CHANNEL_ID

export default async function handler(req, res) {
    const API_KEY = process.env.YT_API_KEY;
    const DEFAULT_CHANNEL = process.env.CHANNEL_ID;

    if (!API_KEY) {
        res.status(500).json({ ok: false, error: "Missing server env YT_API_KEY" });
        return;
    }

    const channelId = req.query.channelId || DEFAULT_CHANNEL;
    if (!channelId) {
        res.status(400).json({ ok: false, error: "Missing channelId (query or env CHANNEL_ID)" });
        return;
    }

    try {
        const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${API_KEY}`;
        const response = await fetch(url);

        if (!response.ok) {
            const text = await response.text();
            throw new Error(`channels.list error ${response.status}: ${text}`);
        }

        const json = await response.json();
        const channel = json.items && json.items[0];

        if (!channel) {
            return res.status(404).json({ ok: false, error: 'Channel not found' });
        }

        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600"); // CDN cache
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
}
