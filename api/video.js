// api/video.js
// Vercel serverless function that returns channel uploads
// Uses process.env.YT_API_KEY and process.env.CHANNEL_ID

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

  const limit = Math.min(parseInt(req.query.limit || "50", 10), 500);

  try {
    // 1) get uploads playlist id
    const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${encodeURIComponent(
      channelId
    )}&key=${API_KEY}`;
    const channelRes = await fetch(channelUrl);
    if (!channelRes.ok) {
      const text = await channelRes.text();
      throw new Error(`channels.list error ${channelRes.status}: ${text}`);
    }
    const channelJson = await channelRes.json();
    const item = (channelJson.items && channelJson.items[0]) || null;
    if (!item) throw new Error("Channel not found");
    const uploadsPlaylistId = item.contentDetails.relatedPlaylists.uploads;

    // 2) fetch playlist items (paginated)
    const videos = [];
    let pageToken = "";
    const pageSize = 50;
    while (videos.length < limit) {
      const url = new URL("https://www.googleapis.com/youtube/v3/playlistItems");
      url.searchParams.set("part", "snippet,contentDetails");
      url.searchParams.set("playlistId", uploadsPlaylistId);
      url.searchParams.set("maxResults", String(pageSize));
      if (pageToken) url.searchParams.set("pageToken", pageToken);
      url.searchParams.set("key", API_KEY);

      const r = await fetch(url.toString());
      if (!r.ok) {
        const text = await r.text();
        throw new Error(`playlistItems.list error ${r.status}: ${text}`);
      }
      const j = await r.json();

      // Process items in parallel to check for Shorts
      const items = j.items || [];
      const processed = await Promise.all(items.map(async (it) => {
        const snippet = it.snippet || {};
        const resourceId = snippet.resourceId || {};
        const videoId = resourceId.videoId || (it.contentDetails && it.contentDetails.videoId);
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

    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300"); // CDN cache
    res.json({ ok: true, channelId, count: videos.length, videos: videos.slice(0, limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ ok: false, error: String(err) });
  }
}
