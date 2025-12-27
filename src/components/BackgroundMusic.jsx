import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Using a royalty-free Christmas track/loop
    const MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=christmas-background-music-124965.mp3";

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.3;

        // Attempt to autoplay
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                setIsPlaying(true);
            }).catch(() => {
                // Autoplay was prevented.
                setIsPlaying(false);
                // Add a one-time listener to play on first interaction
                const handleInteraction = () => {
                    audio.play().then(() => {
                        setIsPlaying(true);
                        // Clean up listeners once successful
                        document.removeEventListener('click', handleInteraction);
                        document.removeEventListener('touchstart', handleInteraction);
                        document.removeEventListener('keydown', handleInteraction);
                    }).catch(e => console.error("Play failed after interaction:", e));
                };

                document.addEventListener('click', handleInteraction);
                document.addEventListener('touchstart', handleInteraction);
                document.addEventListener('keydown', handleInteraction);

                // Cleanup on unmount (if it happens before interaction)
                return () => {
                    document.removeEventListener('click', handleInteraction);
                    document.removeEventListener('touchstart', handleInteraction);
                    document.removeEventListener('keydown', handleInteraction);
                };
            });
        }
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().catch(e => console.log("Audio play failed on toggle", e));
                setIsPlaying(true);
            }
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <audio ref={audioRef} src={MUSIC_URL} loop />

            <button
                onClick={togglePlay}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 ${isPlaying
                        ? 'bg-[#165B33] shadow-green-900/50 animate-pulse-slow'
                        : 'bg-[#D42426] shadow-red-900/50 animate-bounce'
                    }`}
                title={isPlaying ? "Mute Music" : "Play Music"}
            >
                {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
        </div>
    );
};

export default BackgroundMusic;
