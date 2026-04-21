import { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export default function ProductViewer3D({ images = [], name = "Product" }) {
  const [currentImg, setCurrentImg] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(null);
  const cardRef = useRef(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 150, damping: 20 });
  const springY = useSpring(rotateY, { stiffness: 150, damping: 20 });

  const shadowX = useTransform(springY, [-20, 20], [-10, 10]);
  const shadowY = useTransform(springX, [-20, 20], [10, -10]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const mx = e.clientX - cx;
    const my = e.clientY - cy;
    rotateY.set((mx / rect.width) * 22);
    rotateX.set(-(my / rect.height) * 22);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  // Touch drag to rotate image
  const handleTouchStart = (e) => {
    setDragStart(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging || dragStart === null) return;
    const diff = dragStart - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setCurrentImg((prev) => (prev + 1) % images.length);
      } else {
        setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    setIsDragging(false);
    setDragStart(null);
  };

  const handleMouseDown = (e) => {
    setDragStart(e.clientX);
    setIsDragging(true);
  };

  const handleMouseUp = (e) => {
    if (!isDragging || dragStart === null) return;
    const diff = dragStart - e.clientX;
    if (Math.abs(diff) > 40 && images.length > 1) {
      if (diff > 0) {
        setCurrentImg((prev) => (prev + 1) % images.length);
      } else {
        setCurrentImg((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    setIsDragging(false);
    setDragStart(null);
  };

  const img = images[currentImg] || "";

  return (
    <div className="viewer3d-wrap">
      <motion.div
        ref={cardRef}
        className="viewer3d-card"
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: "preserve-3d",
          perspective: 1000,
          boxShadow: useTransform(
            [shadowX, shadowY],
            ([sx, sy]) => `${sx}px ${sy}px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)`
          ),
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        whileHover={{ scale: 1.02 }}
      >
        {img ? (
          <img
            src={img}
            alt={name}
            className="viewer3d-img"
            draggable={false}
          />
        ) : (
          <div className="viewer3d-placeholder">
            <span>👕</span>
            <p>{name}</p>
          </div>
        )}

        {/* 3D shine overlay */}
        <div className="viewer3d-shine" />

        {/* Drag hint */}
        {images.length > 1 && (
          <div className="viewer3d-hint">
            ← drag to rotate →
          </div>
        )}

        {/* Image dots */}
        {images.length > 1 && (
          <div className="viewer3d-dots">
            {images.map((_, i) => (
              <button
                key={i}
                className={`viewer3d-dot ${i === currentImg ? "active" : ""}`}
                onClick={() => setCurrentImg(i)}
              />
            ))}
          </div>
        )}
      </motion.div>

      <style>{`
        .viewer3d-wrap {
          perspective: 1000px;
          width: 100%;
        }
        .viewer3d-card {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          border-radius: 16px;
          overflow: hidden;
          cursor: grab;
          background: #f5f5f5;
          user-select: none;
        }
        .viewer3d-card:active {
          cursor: grabbing;
        }
        .viewer3d-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          pointer-events: none;
          transition: opacity 0.3s;
        }
        .viewer3d-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          background: linear-gradient(135deg, #f5f5f5, #ebebeb);
        }
        .viewer3d-placeholder span {
          font-size: 4rem;
        }
        .viewer3d-placeholder p {
          font-size: 0.9rem;
          color: #888;
        }
        .viewer3d-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255,255,255,0.15) 0%,
            rgba(255,255,255,0) 60%
          );
          pointer-events: none;
          border-radius: 16px;
        }
        .viewer3d-hint {
          position: absolute;
          bottom: 48px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0,0,0,0.5);
          color: #fff;
          font-size: 0.72rem;
          padding: 4px 12px;
          border-radius: 20px;
          white-space: nowrap;
          pointer-events: none;
          letter-spacing: 0.05em;
        }
        .viewer3d-dots {
          position: absolute;
          bottom: 14px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
        }
        .viewer3d-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          border: none;
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          padding: 0;
          transition: background 0.2s, transform 0.2s;
        }
        .viewer3d-dot.active {
          background: #fff;
          transform: scale(1.3);
        }
      `}</style>
    </div>
  );
}
