import React, { useEffect, useRef } from "react";

export default function VideoModal({ video, onClose, onNext, onPrev, hasNext, hasPrev }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
      if (video.isShort) {
        if (e.key === "ArrowUp" && hasPrev) onPrev();
        if (e.key === "ArrowDown" && hasNext) onNext();
      }
    }
    document.addEventListener("keydown", onKey);
    // Lock scroll
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      // Unlock scroll
      document.body.style.overflow = "auto";
    };
  }, [onClose, onNext, onPrev, hasNext, hasPrev, video.isShort]);

  const isShort = video.isShort;

  // Swipe handling
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);

  const onTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const onTouchMove = (e) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const onTouchEnd = () => {
    if (!touchStartY.current || !touchEndY.current) return;
    const distance = touchStartY.current - touchEndY.current;
    const isSwipeUp = distance > 50;
    const isSwipeDown = distance < -50;

    if (isSwipeUp && hasNext) {
      onNext();
    }
    if (isSwipeDown && hasPrev) {
      onPrev();
    }

    // Reset
    touchStartY.current = 0;
    touchEndY.current = 0;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      <div
        className={`relative mx-auto animate-in fade-in zoom-in-95 duration-300 ${isShort ? 'w-auto' : 'w-full max-w-5xl'}`}
        style={isShort ? { height: '85vh' } : {}}
      >
        <div className={`relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl shadow-cyan-500/10 border border-white/10 w-full h-full flex ${isShort ? 'flex-col md:flex-row' : 'flex-col'}`}>

          {/* Video Section */}
          <div className={`relative ${isShort ? 'w-full h-full aspect-[9/16]' : 'w-full pb-[56.25%]'}`}>
            <iframe
              title={video.title}
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
            {/* Transparent Overlay for Swipe Detection (Shorts Only) */}
            {isShort && (
              <div
                className="absolute inset-0 z-10"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
                style={{ height: '75%' }} // Leave bottom 25% for controls
              />
            )}
          </div>

          {/* Shorts Navigation Buttons */}
          {isShort && (
            <div className="absolute right-4 md:right-[-80px] top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50">
              {hasPrev && (
                <button
                  onClick={onPrev}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110"
                  title="Previous Short (Up Arrow)"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              )}
              {hasNext && (
                <button
                  onClick={onNext}
                  className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110"
                  title="Next Short (Down Arrow)"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              )}
            </div>
          )}

          {/* Info Section */}
          <div className={`
            ${isShort
              ? 'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-20 pb-8 px-6 md:static md:w-96 md:bg-gray-900 md:border-l md:border-white/10 md:pt-6 md:pb-6'
              : 'bg-gray-900 p-6'} 
            z-20 flex flex-col justify-between
          `}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h2 className={`font-bold text-white leading-tight ${isShort ? 'text-lg md:text-xl' : 'text-xl'}`}>
                  {video.title}
                </h2>
                {video.description && (
                  <p className="text-sm text-gray-300 mt-3 line-clamp-2 hover:line-clamp-none transition-all cursor-pointer">
                    {video.description}
                  </p>
                )}
              </div>

              {/* Close Button (Desktop only for Shorts split view, or always visible?) */}
              {/* On mobile Shorts, close button might be obscured or need to be floating top right. 
                  Let's keep it here for now but maybe move it for mobile Shorts. */}
              <button
                onClick={onClose}
                className={`group flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 transition-colors shrink-0 ${isShort ? 'md:flex hidden' : 'flex'}`}
                aria-label="Close modal"
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Mobile Close Button for Shorts (Floating Top Right) */}
            {isShort && (
              <button
                onClick={onClose}
                className="absolute top-4 right-4 md:hidden w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white z-50"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
