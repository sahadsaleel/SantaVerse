import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundMusic = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef(null);

    // Using a royalty-free Christmas track/loop
    const MUSIC_URL = "https://cdn.pixabay.com/download/audio/2022/11/22/audio_febc508520.mp3?filename=christmas-background-music-124965.mp3";

    useEffect(() => {
        // Try auto-play with low volume
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
        }
    }, []);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => console.log("Audio play failed (interaction required)", e));
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <audio ref={audioRef} src={MUSIC_URL} loop />

            <button
                onClick={togglePlay}
                className="w-12 h-12 bg-[#D42426] rounded-full flex items-center justify-center text-white shadow-lg shadow-red-900/50 hover:scale-110 transition-transform"
                title={isPlaying ? "Mute Music" : "Play Music"}
            >
                {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
            </button>
        </div>
    );
};

export default BackgroundMusic;
