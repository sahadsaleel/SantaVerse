import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, Download, RotateCw, ZoomIn, ZoomOut, Move } from 'lucide-react';

const MeetSanta = () => {
    const webcamRef = useRef(null);
    const santaOverlayRef = useRef(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [santaPosition, setSantaPosition] = useState({ x: 70, y: 60 }); // percentage
    const [santaSize, setSantaSize] = useState(35); // percentage
    const [isDragging, setIsDragging] = useState(false);

    const capture = useCallback(() => {
        const webcamImage = webcamRef.current.getScreenshot();
        const overlay = santaOverlayRef.current;

        if (!webcamImage || !overlay) return;

        // Create canvas to composite webcam + Santa
        const canvas = document.createElement('canvas');
        const video = webcamRef.current.video;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');

        // Draw webcam image
        const img = new Image();
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            // Draw Santa overlay
            const overlayRect = overlay.getBoundingClientRect();
            const videoRect = video.getBoundingClientRect();

            // Calculate Santa position and size relative to video
            const scaleX = canvas.width / videoRect.width;
            const scaleY = canvas.height / videoRect.height;

            const santaX = (overlayRect.left - videoRect.left) * scaleX;
            const santaY = (overlayRect.top - videoRect.top) * scaleY;
            const santaW = overlayRect.width * scaleX;
            const santaH = overlayRect.height * scaleY;

            // Draw Santa emoji as text on canvas
            ctx.font = `${santaW * 0.8}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            // Add glow effect
            ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
            ctx.shadowBlur = 40;
            ctx.fillText('🎅', santaX + santaW / 2, santaY + santaH / 2);

            // Add sparkles
            ctx.font = `${santaW * 0.3}px Arial`;
            ctx.fillText('✨', santaX + santaW * 0.8, santaY + santaH * 0.2);
            ctx.fillText('⭐', santaX + santaW * 0.2, santaY + santaH * 0.8);

            // Convert to image
            setImgSrc(canvas.toDataURL('image/jpeg'));
        };
        img.src = webcamImage;
    }, [santaPosition, santaSize]);

    const retake = () => setImgSrc(null);

    const handleMouseDown = (e) => {
        if (!imgSrc) setIsDragging(true);
    };

    const handleMouseMove = (e) => {
        if (isDragging && !imgSrc) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            setSantaPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const adjustSize = (delta) => {
        setSantaSize(prev => Math.max(20, Math.min(60, prev + delta)));
    };

    const resetPosition = () => {
        setSantaPosition({ x: 70, y: 60 });
        setSantaSize(35);
    };

    return (
        <div className="flex flex-col items-center px-4">
            <h1 className="text-4xl md:text-5xl text-[#F8B229] mb-4 font-['Mountains_of_Christmas']">Meet Santa 🎅</h1>
            <p className="text-white/80 mb-6 text-center max-w-xl">
                Position Santa next to you for the perfect AR photo! Drag Santa around and adjust his size.
            </p>

            <div
                className="relative w-full max-w-3xl aspect-video bg-black rounded-3xl overflow-hidden border-4 border-[#D42426] shadow-[0_0_30px_#D42426]"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {imgSrc ? (
                    <img src={imgSrc} alt="You and Santa" className="w-full h-full object-cover" />
                ) : (
                    <>
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-full h-full object-cover"
                            mirrored={true}
                        />

                        {/* Santa AR Overlay */}
                        <div
                            ref={santaOverlayRef}
                            className={`absolute transition-transform ${isDragging ? 'cursor-move' : ''}`}
                            style={{
                                left: `${santaPosition.x}%`,
                                top: `${santaPosition.y}%`,
                                transform: 'translate(-50%, -50%)',
                                width: `${santaSize}%`,
                                filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.5))',
                                pointerEvents: 'none'
                            }}
                        >
                            {/* Realistic Santa - Using high-quality emoji with effects */}
                            <div className="relative">
                                {/* Glow effect */}
                                <div className="absolute inset-0 bg-gradient-radial from-yellow-300/20 to-transparent blur-2xl scale-150"></div>

                                {/* Santa */}
                                <div
                                    className="text-[8rem] leading-none select-none animate-float"
                                    style={{
                                        textShadow: '0 0 40px rgba(255,215,0,0.6), 0 0 20px rgba(255,255,255,0.4)',
                                        filter: 'brightness(1.1) contrast(1.1)',
                                        pointerEvents: 'auto'
                                    }}
                                    onMouseDown={handleMouseDown}
                                >
                                    🎅
                                </div>

                                {/* Sparkles */}
                                <div className="absolute -top-4 -right-4 text-4xl animate-pulse">✨</div>
                                <div className="absolute -bottom-2 -left-2 text-3xl animate-pulse delay-300">⭐</div>
                            </div>
                        </div>

                        {/* AR Controls Overlay */}
                        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-xl p-3 space-y-2">
                            <div className="text-white/80 text-sm font-bold mb-2 flex items-center gap-2">
                                <Move size={16} /> AR Controls
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => adjustSize(5)}
                                    className="p-2 bg-[#165B33] rounded-lg hover:bg-[#1D7A44] transition"
                                    title="Zoom In"
                                >
                                    <ZoomIn size={18} />
                                </button>
                                <button
                                    onClick={() => adjustSize(-5)}
                                    className="p-2 bg-[#165B33] rounded-lg hover:bg-[#1D7A44] transition"
                                    title="Zoom Out"
                                >
                                    <ZoomOut size={18} />
                                </button>
                                <button
                                    onClick={resetPosition}
                                    className="p-2 bg-[#D42426] rounded-lg hover:bg-red-700 transition"
                                    title="Reset Position"
                                >
                                    <RotateCw size={18} />
                                </button>
                            </div>
                            <p className="text-xs text-white/60 mt-2">Drag Santa to move</p>
                        </div>
                    </>
                )}
            </div>

            <div className="mt-8 flex gap-4">
                {imgSrc ? (
                    <>
                        <button
                            onClick={retake}
                            className="px-6 py-3 bg-[#165B33] rounded-full font-bold flex items-center gap-2 hover:bg-[#1D7A44] shadow-lg transition"
                        >
                            <RotateCw size={20} /> Retake
                        </button>
                        <a
                            href={imgSrc}
                            download="santa-verse-memory.jpg"
                            className="px-6 py-3 bg-[#D42426] rounded-full font-bold flex items-center gap-2 hover:bg-red-700 shadow-lg transition"
                        >
                            <Download size={20} /> Download
                        </a>
                    </>
                ) : (
                    <button
                        onClick={capture}
                        className="px-8 py-4 bg-[#F8B229] text-[#0F3D2E] rounded-full text-xl font-bold flex items-center gap-2 hover:bg-yellow-400 shadow-[0_0_20px_rgba(248,178,41,0.4)] animate-pulse transition"
                    >
                        <Camera size={24} /> Snap Photo with Santa
                    </button>
                )}
            </div>

            {/* Instructions */}
            {!imgSrc && (
                <div className="mt-6 max-w-2xl bg-[#0F3D2E]/50 backdrop-blur rounded-2xl p-6 border border-[#F8B229]/20">
                    <h3 className="text-[#F8B229] font-bold mb-3 flex items-center gap-2">
                        📸 How to use AR Santa:
                    </h3>
                    <ul className="text-white/80 space-y-2 text-sm">
                        <li>• <strong>Drag Santa</strong> to position him next to you</li>
                        <li>• Use <strong>Zoom buttons</strong> to adjust Santa's size</li>
                        <li>• Click <strong>Snap Photo</strong> when you're ready</li>
                        <li>• <strong>Download</strong> your magical memory!</li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MeetSanta;
