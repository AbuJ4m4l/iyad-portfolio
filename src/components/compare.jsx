"use client";
import React, { useState, useRef, useEffect } from "react";

const VideoComparison = ({ afterVideo, beforeVideo }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const beforeVideoRef = useRef(null);
  const afterVideoRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    setSliderPosition(Math.max(0, Math.min(100, percentage)));
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalTouchMove = (e) => handleTouchMove(e);

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
      document.addEventListener("touchmove", handleGlobalTouchMove);
      document.addEventListener("touchend", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.removeEventListener("touchmove", handleGlobalTouchMove);
      document.removeEventListener("touchend", handleGlobalMouseUp);
    };
  }, [isDragging]);

  const syncVideos = (sourceVideo, targetVideo) => {
    if (targetVideo && sourceVideo) {
      targetVideo.currentTime = sourceVideo.currentTime;
      if (!sourceVideo.paused) {
        targetVideo.play();
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        ref={containerRef}
        className="relative w-full h-96 bg-black rounded-lg overflow-hidden cursor-pointer select-none"
      >
        <video
          ref={beforeVideoRef}
          src={beforeVideo}
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          onTimeUpdate={() =>
            syncVideos(beforeVideoRef.current, afterVideoRef.current)
          }
        />

        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            clipPath: `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)`,
          }}
        >
          <video
            ref={afterVideoRef}
            src={afterVideo}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
          />
        </div>

        <div
          className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
          style={{ left: `${sliderPosition}%`, transform: "translateX(-50%)" }}
        >
          <div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center hover:scale-110 transition-transform"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
          >
            <div className="w-4 h-4 border-2 border-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoComparison;
