import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Download, RotateCw, ZoomIn, ZoomOut, Move } from 'lucide-react';

const MeetSanta = () => {
    const webcamRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    // Position x: 0 (left). y will be handled by bottom: 0 in the UI.
    const [santaPosition, setSantaPosition] = useState({ x: 0, y: 0 });
    const [santaSize, setSantaSize] = useState(45); // percentage width
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    const capture = useCallback(() => {
        const webcam = webcamRef.current;
        if (!webcam) return;
        const screenshot = webcam.getScreenshot();
        if (!screenshot) return;

        const bgImg = new Image();
        bgImg.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = bgImg.width;
            canvas.height = bgImg.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

            const santaImg = new Image();
            santaImg.crossOrigin = "anonymous";
            santaImg.src = "/real_santa.png";
            santaImg.onload = () => {
                const sw = (santaSize / 100) * canvas.width;
                const sh = sw * (santaImg.height / santaImg.width);
                const sx = (santaPosition.x / 100) * canvas.width;
                // Subtract height to keep him at the bottom
                const sy = canvas.height - sh;

                ctx.drawImage(santaImg, sx, sy, sw, sh);
                setImgSrc(canvas.toDataURL('image/jpeg', 0.95));
            };
            santaImg.onerror = () => {
                setImgSrc(canvas.toDataURL('image/jpeg', 0.95));
            };
        };
        bgImg.src = screenshot;
    }, [santaPosition, santaSize]);

    const retake = () => setImgSrc(null);

    const handleStart = (clientX, clientY, rect) => {
        if (!imgSrc) {
            setIsDragging(true);
            const currentXPx = (santaPosition.x / 100) * rect.width;
            const mouseX = clientX - rect.left;
            setDragOffset({ x: mouseX - currentXPx });
        }
    };

    const handleMove = (clientX, clientY, rect) => {
        if (isDragging && !imgSrc) {
            const mouseX = clientX - rect.left;
            let newXPx = mouseX - dragOffset.x;
            const newX = (newXPx / rect.width) * 100;
            setSantaPosition({
                x: Math.max(-10, Math.min(80, newX)),
                y: 0
            });
        }
    };

    const handleEnd = () => setIsDragging(false);

    const onMouseDown = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        handleStart(e.clientX, e.clientY, rect);
    };

    const onMouseMove = (e) => isDragging && handleMove(e.clientX, e.clientY, e.currentTarget.getBoundingClientRect());

    const onTouchStart = (e) => {
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        handleStart(touch.clientX, touch.clientY, rect);
    };
    const onTouchMove = (e) => {
        const touch = e.touches[0];
        const rect = e.currentTarget.getBoundingClientRect();
        handleMove(touch.clientX, touch.clientY, rect);
    };

    const adjustSize = (delta) => {
        setSantaSize(prev => Math.max(20, Math.min(100, prev + delta)));
    };

    const resetPosition = () => {
        setSantaPosition({ x: 0, y: 0 });
        setSantaSize(45);
    };

    return (
        <div className="flex flex-col items-center px-4 min-h-screen bg-[#0F3D2E] pt-24 pb-12 select-none">
            <h1 className="text-4xl md:text-5xl text-[#F8B229] mb-4 font-['Mountains_of_Christmas'] filter drop-shadow-lg">Meet Santa Real 🎅</h1>
            <p className="text-white/80 mb-6 text-center max-w-xl">
                Santa is here! Drag him along the bottom and take a festive photo.
            </p>

            <div
                className="relative w-full max-w-3xl aspect-video bg-black rounded-3xl overflow-hidden border-4 border-[#D42426] shadow-[0_0_30px_rgba(212,36,38,0.5)] cursor-move touch-none"
                onMouseDown={onMouseDown}
                onMouseUp={handleEnd}
                onMouseLeave={handleEnd}
                onMouseMove={onMouseMove}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={handleEnd}
            >
                {imgSrc ? (
                    <img src={imgSrc} alt="You and Santa" className="w-full h-full object-cover" />
                ) : (
                    <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="absolute inset-0 w-full h-full object-cover"
                            mirrored={true}
                        />

                        {/* Realistic Santa Image Overlay - Fixed to Bottom */}
                        <img
                            src="/real_santa.png"
                            alt="Santa Claus"
                            className={`absolute transition-transform will-change-transform ${isDragging ? 'opacity-90' : ''}`}
                            style={{
                                left: `${santaPosition.x}%`,
                                bottom: '0',
                                width: `${santaSize}%`,
                                height: 'auto',
                                pointerEvents: 'none',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.5))',
                            }}
                            draggable={false}
                            onError={(e) => { e.target.style.display = 'none'; }}
                        />

                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-xl p-3 space-y-2 pointer-events-auto z-10">
                            <div className="text-white/80 text-sm font-bold mb-2 flex items-center gap-2">
                                <Move size={16} /> Controls
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={(e) => { e.stopPropagation(); adjustSize(5); }}
                                    className="p-2 bg-[#165B33] rounded-lg hover:bg-[#1D7A44] transition active:scale-95"
                                    title="Zoom In"
                                >
                                    <ZoomIn size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); adjustSize(-5); }}
                                    className="p-2 bg-[#165B33] rounded-lg hover:bg-[#1D7A44] transition active:scale-95"
                                    title="Zoom Out"
                                >
                                    <ZoomOut size={18} />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); resetPosition(); }}
                                    className="p-2 bg-[#D42426] rounded-lg hover:bg-red-700 transition active:scale-95"
                                    title="Reset"
                                >
                                    <RotateCw size={18} />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-8 flex gap-4">
                {imgSrc ? (
                    <>
                        <button
                            onClick={retake}
                            className="px-6 py-3 bg-[#165B33] text-white rounded-full font-bold flex items-center gap-2 hover:bg-[#1D7A44] shadow-lg transition transform hover:-translate-y-1"
                        >
                            <RotateCw size={20} /> Retake
                        </button>
                        <a
                            href={imgSrc}
                            download="santa-verse-memory.jpg"
                            className="px-6 py-3 bg-[#D42426] text-white rounded-full font-bold flex items-center gap-2 hover:bg-red-700 shadow-lg transition transform hover:-translate-y-1"
                        >
                            <Download size={20} /> Download
                        </a>
                    </>
                ) : (
                    <button
                        onClick={capture}
                        className="px-8 py-4 bg-gradient-to-r from-[#F8B229] to-[#E0A125] text-[#0F3D2E] rounded-full text-xl font-bold flex items-center gap-2 hover:from-[#E0A125] hover:to-[#F8B229] shadow-[0_0_20px_rgba(248,178,41,0.4)] animate-pulse transition transform hover:scale-105"
                    >
                        <Camera size={24} /> Snap Photo
                    </button>
                )}
            </div>
        </div>
    );
};

export default MeetSanta;
