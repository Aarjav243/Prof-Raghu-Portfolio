"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroAnimation() {
    const videoCanvasRef = useRef<HTMLCanvasElement>(null);
    const [firstFrameLoaded, setFirstFrameLoaded] = useState(false);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const frameRef = useRef(0);

    // Preload images
    useEffect(() => {
        const frameCount = 45;
        const loadedImages: HTMLImageElement[] = [];

        for (let i = 1; i <= frameCount; i++) {
            const img = new Image();
            img.src = `/hero-pngs/ezgif-frame-${i.toString().padStart(3, '0')}.png`;
            if (i === i) { // Load all frames eventually
                if (i === 1) {
                    img.onload = () => {
                        setFirstFrameLoaded(true);
                    };
                }
            }
            loadedImages.push(img);
        }
        imagesRef.current = loadedImages;
    }, []);

    useEffect(() => {
        const videoCanvas = videoCanvasRef.current;
        if (!videoCanvas) return;

        const vCtx = videoCanvas.getContext('2d');
        if (!vCtx) return;

        let width = videoCanvas.width = window.innerWidth;
        let height = videoCanvas.height = window.innerHeight;

        function drawVideoFrame() {
            if (!vCtx || imagesRef.current.length === 0) return;

            const currentImg = imagesRef.current[frameRef.current];
            if (currentImg && currentImg.complete) {
                vCtx.clearRect(0, 0, width, height);

                // Maintain aspect ratio (cover)
                const scale = Math.max(width / currentImg.width, height / currentImg.height);
                const x = (width / 2) - (currentImg.width / 2) * scale;
                const y = (height / 2) - (currentImg.height / 2) * scale;

                vCtx.imageSmoothingEnabled = true;
                vCtx.imageSmoothingQuality = 'high';
                vCtx.drawImage(currentImg, x, y, currentImg.width * scale, currentImg.height * scale);

                // Increment frame only if we haven't reached the last one
                if (frameRef.current < 44) {
                    frameRef.current++;
                }
            }
        }

        let lastTime = 0;
        const fps = 24;
        const interval = 1000 / fps;

        function animate(time: number) {
            if (firstFrameLoaded) {
                const delta = time - lastTime;
                if (delta >= interval) {
                    drawVideoFrame();
                    lastTime = time - (delta % interval);
                }
            }
            requestAnimationFrame(animate);
        }

        const animId = requestAnimationFrame(animate);

        const handleResize = () => {
            width = videoCanvas.width = window.innerWidth;
            height = videoCanvas.height = window.innerHeight;
            if (firstFrameLoaded) drawVideoFrame();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animId);
        };
    }, [firstFrameLoaded]);

    return (
        <div className="hero-animation-container" style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            background: '#050e0a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            {/* Layer 1: Video Content (PNG Sequence) */}
            <canvas
                ref={videoCanvasRef}
                style={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.1) brightness(1.1)'
                }}
            />
        </div>
    );
}
