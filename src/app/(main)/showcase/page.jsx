"use client";

import React, { useEffect, useState, useRef } from "react";
import { BlurFade } from "@/components/magicui/blur-fade";

/* -----------------------------
   MediaComparison (vertical centered & object-contain for vertical)
   ----------------------------- */
const MediaComparison = ({
  beforeMedia,
  afterMedia,
  beforeType,
  afterType,
  className = "",
  vertical = false,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50); // 0..100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const beforeVideoRef = useRef(null);
  const afterVideoRef = useRef(null);

  const lastUpdatedRef = useRef(null);
  const TIME_THRESHOLD = 0.03;

  const handlePointerMove = (clientX, clientY) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    if (vertical) {
      const y = clientY - rect.top;
      const percentage = (y / rect.height) * 100;
      setSliderPosition(Math.max(0, Math.min(100, percentage)));
    } else {
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSliderPosition(Math.max(0, Math.min(100, percentage)));
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    handlePointerMove(e.clientX, e.clientY);
  };
  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches?.length) return;
    handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
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
  }, [isDragging, vertical]);

  // sync videos
  useEffect(() => {
    if (beforeType !== "video" || afterType !== "video") return;
    const before = beforeVideoRef.current;
    const after = afterVideoRef.current;
    if (!before || !after) return;

    const handleBeforeTime = () => {
      if (lastUpdatedRef.current === "after") {
        lastUpdatedRef.current = null;
        return;
      }
      const diff = Math.abs(after.currentTime - before.currentTime || 0);
      if (diff > TIME_THRESHOLD) {
        lastUpdatedRef.current = "before";
        try {
          after.currentTime = before.currentTime;
        } catch (err) {}
      }
      if (!before.paused && after.paused) {
        const p = after.play();
        if (p && p.catch) p.catch(() => {});
      }
    };

    const handleAfterTime = () => {
      if (lastUpdatedRef.current === "before") {
        lastUpdatedRef.current = null;
        return;
      }
      const diff = Math.abs(before.currentTime - after.currentTime || 0);
      if (diff > TIME_THRESHOLD) {
        lastUpdatedRef.current = "after";
        try {
          before.currentTime = after.currentTime;
        } catch (err) {}
      }
      if (!after.paused && before.paused) {
        const p = before.play();
        if (p && p.catch) p.catch(() => {});
      }
    };

    const handleBeforePlay = () => {
      if (after.paused) {
        const p = after.play();
        if (p && p.catch) p.catch(() => {});
      }
    };
    const handleAfterPlay = () => {
      if (before.paused) {
        const p = before.play();
        if (p && p.catch) p.catch(() => {});
      }
    };
    const handleBeforePause = () => {
      if (!after.paused) after.pause();
    };
    const handleAfterPause = () => {
      if (!before.paused) before.pause();
    };

    before.addEventListener("timeupdate", handleBeforeTime);
    after.addEventListener("timeupdate", handleAfterTime);
    before.addEventListener("play", handleBeforePlay);
    after.addEventListener("play", handleAfterPlay);
    before.addEventListener("pause", handleBeforePause);
    after.addEventListener("pause", handleAfterPause);

    return () => {
      try {
        before.removeEventListener("timeupdate", handleBeforeTime);
        after.removeEventListener("timeupdate", handleAfterTime);
        before.removeEventListener("play", handleBeforePlay);
        after.removeEventListener("play", handleAfterPlay);
        before.removeEventListener("pause", handleBeforePause);
        after.removeEventListener("pause", handleAfterPause);
      } catch (err) {}
    };
  }, [beforeType, afterType, beforeMedia, afterMedia]);

  // render media with different fit for vertical mode
  const renderMedia = (mediaSrc, mediaType, ref = null) => {
    if (mediaType === "video") {
      if (vertical) {
        // vertical: center horizontally, full height, contain
        return (
          <video
            ref={ref}
            src={mediaSrc}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-auto object-contain"
            autoPlay
            loop
            muted
            playsInline
          />
        );
      } else {
        return (
          <video
            ref={ref}
            src={mediaSrc}
            className="absolute top-0 left-0 w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        );
      }
    } else {
      if (vertical) {
        return (
          <img
            src={mediaSrc}
            ref={ref}
            className="absolute top-0 left-1/2 transform -translate-x-1/2 h-full w-auto object-contain"
            alt="Comparison media"
          />
        );
      } else {
        return (
          <img
            src={mediaSrc}
            ref={ref}
            className="absolute top-0 left-0 w-full h-full object-cover"
            alt="Comparison media"
          />
        );
      }
    }
  };

  // clipPath for after: vertical -> reveal from sliderPosition (top -> bottom),
  // horizontal -> reveal from sliderPosition (left -> right)
  const afterClipPath = vertical
    ? `polygon(0 ${sliderPosition}%, 100% ${sliderPosition}%, 100% 100%, 0 100%)`
    : `polygon(${sliderPosition}% 0%, 100% 0%, 100% 100%, ${sliderPosition}% 100%)`;

  return (
    <div className={`w-full h-full ${className}`}>
      <div
        ref={containerRef}
        className="relative w-full h-full bg-black rounded-lg overflow-hidden cursor-pointer select-none"
      >
        {/* before (full) */}
        {renderMedia(beforeMedia, beforeType, beforeVideoRef)}

        {/* after clipped */}
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{ clipPath: afterClipPath }}
        >
          {renderMedia(afterMedia, afterType, afterVideoRef)}
        </div>

        {/* Slider handle */}
        {!vertical ? (
          <div
            className="absolute top-0 bottom-0 w-1 bg-white shadow-lg z-10"
            style={{
              left: `${sliderPosition}%`,
              transform: "translateX(-50%)",
            }}
          >
            <div
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center hover:scale-110 transition-transform hidden md:flex"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
            >
              <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
            </div>
          </div>
        ) : (
          <div
            className="absolute left-0 right-0 h-1 bg-white shadow-lg z-10"
            style={{ top: `${sliderPosition}%`, transform: "translateY(-50%)" }}
          >
            <div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing flex items-center justify-center hover:scale-110 transition-transform hidden md:flex"
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
            >
              <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
          After
        </div>
      </div>
    </div>
  );
};

/* -----------------------------
   ProjectHoverOverlay
   - on md+: show smaller centered vertical comparison for shorts
   ----------------------------- */
const ProjectHoverOverlay = ({ project, onClose }) => {
  const folder = project?.folder || null;
  const isShorts = !!project?.isShorts;
  const [beforeAfterMedia, setBeforeAfterMedia] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!folder || !Array.isArray(folder.files)) {
      setBeforeAfterMedia(null);
      setSelectedMedia(null);
      return;
    }

    const files = folder.files;

    const beforeFile = files.find(
      (file) =>
        file.filename.toLowerCase().includes("before") ||
        file.filename.toLowerCase().includes("raw") ||
        file.filename.toLowerCase().includes("original")
    );
    const afterFile = files.find(
      (file) =>
        file.filename.toLowerCase().includes("after") ||
        file.filename.toLowerCase().includes("edited") ||
        file.filename.toLowerCase().includes("final")
    );

    const getMediaType = (filename) =>
      filename.toLowerCase().match(/\.(mp4|webm|mov|avi)$/i)
        ? "video"
        : "image";

    if (beforeFile && afterFile) {
      setBeforeAfterMedia({
        before: `http://localhost:5000${beforeFile.url}`,
        after: `http://localhost:5000${afterFile.url}`,
        beforeType: getMediaType(beforeFile.filename),
        afterType: getMediaType(afterFile.filename),
      });
    } else {
      setBeforeAfterMedia(null);
    }

    if (isMobile && files.length > 0) {
      const f = files[0];
      setSelectedMedia({
        url: `http://localhost:5000${f.url}`,
        type: getMediaType(f.filename),
        filename: f.filename,
      });
    } else {
      setSelectedMedia(null);
    }
  }, [folder, isMobile]);

  const handleMediaSelect = (file) => {
    const getMediaType = (filename) =>
      filename.toLowerCase().match(/\.(mp4|webm|mov|avi)$/i)
        ? "video"
        : "image";

    setSelectedMedia({
      url: `http://localhost:5000${file.url}`,
      type: getMediaType(file.filename),
      filename: file.filename,
    });
  };

  const renderSelectedMedia = () => {
    if (!selectedMedia) return null;
    if (selectedMedia.type === "video") {
      return (
        <video
          src={selectedMedia.url}
          className="h-full w-auto object-contain"
          autoPlay
          loop
          muted
          controls
          playsInline
        />
      );
    }
    return (
      <img
        src={selectedMedia.url}
        className="h-full w-auto object-contain"
        alt={selectedMedia.filename}
      />
    );
  };

  if (!folder) return null;

  return (
    <div
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1a1a] rounded-2xl p-6 w-full h-full max-w-7xl max-h-[95vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* ---------- DESKTOP / TABLET: if shorts -> smaller vertical comparison centered ---------- */}
        {beforeAfterMedia ? (
          isShorts ? (
            <div
              className="hidden md:flex mb-6 w-full"
              style={{ height: "80vh", justifyContent: "center" }}
            >
              <div style={{ width: 360, maxWidth: "100%", height: "100%" }}>
                <MediaComparison
                  beforeMedia={beforeAfterMedia.before}
                  afterMedia={beforeAfterMedia.after}
                  beforeType={beforeAfterMedia.beforeType}
                  afterType={beforeAfterMedia.afterType}
                  vertical={true}
                  className="w-full h-full"
                />
              </div>
            </div>
          ) : (
            <div className="hidden md:block mb-6" style={{ height: "70vh" }}>
              <MediaComparison
                beforeMedia={beforeAfterMedia.before}
                afterMedia={beforeAfterMedia.after}
                beforeType={beforeAfterMedia.beforeType}
                afterType={beforeAfterMedia.afterType}
                vertical={false}
                className="w-full h-full"
              />
            </div>
          )
        ) : (
          <div className="hidden md:flex h-96 bg-gray-800 rounded-lg items-center justify-center mb-6">
            <p className="text-gray-400">
              No before/after comparison available
            </p>
          </div>
        )}

        {/* MOBILE PREVIEW: if isShorts -> big vertical phone-like preview */}
        <div className="md:hidden mb-6 flex items-center justify-center">
          {selectedMedia ? (
            <div
              className={`bg-black rounded-xl overflow-hidden ${
                isShorts ? "w-full max-w-[420px] h-[90vh]" : "w-full h-56"
              }`}
              style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.6)" }}
            >
              {selectedMedia.type === "video" ? (
                <video
                  src={selectedMedia.url}
                  className="h-full w-auto object-contain mx-auto block"
                  autoPlay
                  loop
                  muted
                  controls
                  playsInline
                />
              ) : (
                <img
                  src={selectedMedia.url}
                  className="h-full w-auto object-contain mx-auto block"
                  alt={selectedMedia.filename}
                />
              )}
            </div>
          ) : (
            <p className="text-gray-400">Tap a file below to preview</p>
          )}
        </div>

        {/* thumbnails */}
        <div
          className={`grid ${
            isShorts
              ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          } gap-4`}
        >
          {folder.files.map((file, index) => {
            const isVideo = !!file.filename.match(/\.(mp4|webm|mov|avi)$/i);
            return (
              <div
                key={index}
                className={`bg-[#2a2a2a] rounded-lg p-2 cursor-pointer transition-all hover:bg-[#3a3a3a]`}
                onClick={() => (isMobile ? handleMediaSelect(file) : null)}
              >
                {isVideo ? (
                  <video
                    src={`http://localhost:5000${file.url}`}
                    className={
                      isShorts
                        ? "w-full h-40 object-contain rounded"
                        : "w-full h-24 object-cover rounded"
                    }
                    muted
                    playsInline
                  />
                ) : (
                  <img
                    src={`http://localhost:5000${file.url}`}
                    className={
                      isShorts
                        ? "w-full h-40 object-contain rounded"
                        : "w-full h-24 object-cover rounded"
                    }
                    alt={file.filename}
                  />
                )}
                <p className="text-xs text-gray-400 mt-1 truncate">
                  {file.filename}
                </p>
                {isMobile && (
                  <p className="text-xs text-yellow-500 mt-1">Tap to view</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* -----------------------------
   CategorySection (unchanged)
   ----------------------------- */
const CategorySection = ({ title, projects, emptyMessage, isShorts }) => {
  const containerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const check = () => {
      setCanScrollLeft(el.scrollLeft > 5);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 5);
    };
    check();
    el.addEventListener("scroll", check);
    window.addEventListener("resize", check);
    return () => {
      el.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [projects]);

  const scrollByAmount = (direction = "right") => {
    const el = containerRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.75);
    el.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const itemBaseClass =
    "bg-[#1a1a1a] rounded-2xl p-4 flex-shrink-0 hover:bg-[#2a2a2a] transition-colors cursor-pointer transform hover:scale-105";

  return (
    <div className="relative">
      <h2 className="text-3xl md:text-4xl font-bold mb-6">{title}</h2>
      {projects.length === 0 ? (
        <p className="text-gray-400">{emptyMessage}</p>
      ) : (
        <div className="relative">
          <button
            aria-label="scroll-left"
            onClick={() => scrollByAmount("left")}
            className={`hidden md:flex items-center justify-center absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 transition ${
              canScrollLeft ? "opacity-100" : "opacity-40 pointer-events-auto"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <button
            aria-label="scroll-right"
            onClick={() => scrollByAmount("right")}
            className={`hidden md:flex items-center justify-center absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 transition ${
              canScrollRight ? "opacity-100" : "opacity-40 pointer-events-auto"
            }`}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 12L9 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div
            ref={containerRef}
            className={`flex gap-6 overflow-x-auto pb-4 scrollbar-hide no-scrollbar`}
            style={{ alignItems: "flex-start" }}
          >
            {projects.map((folder, index) => {
              const thumbnailFile = folder.files?.find(
                (f) =>
                  f.filename.toLowerCase().includes("thumbnail") ||
                  f.filename.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i)
              );
              const videoFile = folder.files?.find((f) =>
                f.filename.toLowerCase().match(/\.(mp4|webm|mov|avi)$/i)
              );

              const media = thumbnailFile
                ? {
                    type: "image",
                    url: `http://localhost:5000${thumbnailFile.url}`,
                    filename: thumbnailFile.filename,
                  }
                : videoFile
                ? {
                    type: "video",
                    url: `http://localhost:5000${videoFile.url}`,
                    filename: videoFile.filename,
                  }
                : null;

              const itemClass = isShorts
                ? `${itemBaseClass} w-[220px] min-h-[420px]`
                : `${itemBaseClass} min-w-[300px]`;

              return (
                <div
                  key={index}
                  className={itemClass}
                  onClick={() =>
                    window.dispatchEvent(
                      new CustomEvent("openProject", {
                        detail: { folder, isShorts },
                      })
                    )
                  }
                >
                  {media ? (
                    media.type === "video" ? (
                      <video
                        src={media.url}
                        className={
                          isShorts
                            ? "w-[220px] h-[360px] object-cover rounded-xl mb-3"
                            : "w-full h-48 object-cover rounded-xl mb-3"
                        }
                        muted
                        playsInline
                        controls={false}
                      />
                    ) : (
                      <img
                        src={media.url}
                        className={
                          isShorts
                            ? "w-[220px] h-[360px] object-cover rounded-xl mb-3"
                            : "w-full h-48 object-cover rounded-xl mb-3"
                        }
                        alt={folder.folder}
                      />
                    )
                  ) : (
                    <div
                      className={
                        isShorts
                          ? "w-[220px] h-[360px] bg-gray-800 rounded-xl mb-3 flex items-center justify-center"
                          : "w-full h-48 bg-gray-800 rounded-xl mb-3 flex items-center justify-center"
                      }
                    >
                      <span className="text-gray-500">No media</span>
                    </div>
                  )}

                  <div className="flex flex-col gap-2">
                    <p className="text-xs text-gray-400 truncate">
                      Click to preview
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/* -----------------------------
   Main Services component
   ----------------------------- */
export default function Services() {
  const [motionGraphics, setMotionGraphics] = useState([]);
  const [videoEditing, setVideoEditing] = useState([]);
  const [thumbnailDesign, setThumbnailDesign] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null); // { folder, isShorts }

  useEffect(() => {
    try {
      fetch("http://localhost:5000/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAgent:
            typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        }),
      })
        .then((r) => r.json())
        .then((d) => console.log("Visitor recorded:", d))
        .catch((err) => console.error("Visitor record error:", err));
    } catch (err) {
      console.error("Visitor record failed:", err);
    }

    const fetchCategoryData = async () => {
      try {
        setLoading(true);
        const categories = [
          { name: "motion-graphics", setter: setMotionGraphics },
          { name: "video-editing", setter: setVideoEditing },
          { name: "thumbnail", setter: setThumbnailDesign },
          { name: "shorts", setter: setShorts },
        ];

        await Promise.all(
          categories.map(async (category) => {
            try {
              const res = await fetch(
                `http://localhost:5000/api/uploads/${category.name}`
              );
              const data = await res.json();
              if (data && data.success) {
                category.setter(data.folders || []);
              } else {
                category.setter([]);
              }
            } catch (err) {
              console.error(`Error fetching ${category.name}:`, err);
              category.setter([]);
            }
          })
        );
      } catch (err) {
        console.error("Error in fetchCategoryData:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryData();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      setSelectedProject(e.detail); // e.detail = { folder, isShorts }
    };
    window.addEventListener("openProject", handler);
    return () => window.removeEventListener("openProject", handler);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-lg">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section
        className="relative flex items-center justify-center text-center px-4 lg:px-[180px] py-20 lg:py-32"
        style={{
          backgroundImage: "url('/Frame 1036.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent"></div>

        <div className="relative z-10 max-w-4xl">
          <BlurFade>
            <h1 className="text-3xl md:text-6xl font-bold mb-6 leading-tight">
              Showcasing My <span className="text-yellow-500">Creations</span>
            </h1>
          </BlurFade>

          <BlurFade>
            <h3 className="opacity-80 mt-6 text-lg md:text-xl max-w-2xl mx-auto text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-300">
              Our works span a spectrum of projects, from mesmerizing films to
              impactful commercials, each a testament to our commitment to
              visual storytelling. Join us on this visual journey, where every
              frame tells a unique tale.
            </h3>
          </BlurFade>
        </div>
      </section>

      <BlurFade>
        <section className="py-20 text-white">
          <div className="max-w-6xl mx-auto px-4 space-y-20">
            <CategorySection
              title="Motion Graphics"
              projects={motionGraphics}
              emptyMessage="No motion graphics projects available yet."
              isShorts={false}
            />
            <CategorySection
              title="Video Editing"
              projects={videoEditing}
              emptyMessage="No video editing projects available yet."
              isShorts={false}
            />
            <CategorySection
              title="Shorts"
              projects={shorts}
              emptyMessage="No shorts projects available yet."
              isShorts={true}
            />
            <CategorySection
              title="Thumbnail Design"
              projects={thumbnailDesign}
              emptyMessage="No thumbnail design projects available yet."
              isShorts={false}
            />
          </div>
        </section>
      </BlurFade>

      {selectedProject && (
        <ProjectHoverOverlay
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}
