import React from "react";

function bestThumbnail(thumbnails) {
    // thumbnails is YouTube snippet.thumbnails object
    if (!thumbnails) return null;
    return (
        thumbnails.maxres?.url ||
        thumbnails.standard?.url ||
        thumbnails.high?.url ||
        thumbnails.medium?.url ||
        thumbnails.default?.url
    );
}

export default function VideoCard({ video, onOpen }) {
    const thumb = bestThumbnail(video.thumbnails) || `https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`;
    return (
        <div
            className="group bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            onClick={onOpen}
        >
            <div className="relative pb-[56.25%] overflow-hidden">
                <img
                    src={thumb}
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 dark:bg-black/20 dark:group-hover:bg-black/40 transition-colors" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-white/90 dark:bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-gray-200 dark:border-white/20 shadow-lg">
                        <svg className="w-5 h-5 text-gray-900 dark:text-white fill-current" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    </div>
                </div>

                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-md border border-white/10">
                    YouTube
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {video.title}
                </h3>
                {video.publishedAt && (
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                        {new Date(video.publishedAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                )}
            </div>
        </div>
    );
}