import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { motion, AnimatePresence } from 'framer-motion';
import { mockBackend } from '../services/mockBackend';
import { Heart, Eye, Share2, Link as LinkIcon } from 'lucide-react';

const Gallery = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        // Load Items reverse chronological
        const data = mockBackend.getGallery().reverse();
        setItems(data);
    }, []);

    const handleLike = (id) => {
        const updated = mockBackend.likeItem(id);
        if (updated) {
            setItems(prev => prev.map(item => item.id === id ? updated : item));
        }
    };

    const copyLink = (id) => {
        // Fake link
        navigator.clipboard.writeText(`https://santaverse.demo/gallery/${id}`);
        const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
        });

        Toast.fire({
            icon: 'success',
            title: 'Link copied to clipboard!'
        });
    };

    return (
        <div className="pb-10">
            <div className="text-center mb-10">
                <h1 className="text-5xl text-[#F8B229] mb-4 drop-shadow-lg">Community Gallery</h1>
                <p className="text-[#F0F4F8] text-xl font-light">See how others are celebrating the season! 🎄</p>
            </div>

            {items.length === 0 ? (
                <div className="text-center py-20 opacity-50">
                    <p className="text-2xl">No decorations yet...</p>
                    <p>Be the first to share one!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-[#165B33] rounded-2xl overflow-hidden shadow-lg border border-white/5 hover:border-[#F8B229] transition-all hover:-translate-y-2 relative"
                            >
                                {/* Image Area */}
                                <div className="aspect-[4/5] bg-black/20 overflow-hidden relative">
                                    <img
                                        src={item.image}
                                        alt={`Tree by ${item.username}`}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />

                                    {/* Overlay on Hover */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyLink(item.id); }}
                                            className="p-3 bg-white/20 backdrop-blur rounded-full hover:bg-white/40 text-white transition"
                                            title="Copy Link"
                                        >
                                            <LinkIcon size={24} />
                                        </button>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white text-lg truncate pr-2">
                                            🎄 {item.username}
                                        </h3>
                                        <span className="text-xs text-white/50 whitespace-nowrap">{item.createdAt}</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                                        <button
                                            onClick={() => handleLike(item.id)}
                                            className="flex items-center gap-1.5 text-pink-400 hover:text-pink-300 transition group/like"
                                        >
                                            <Heart size={18} className="group-hover/like:fill-pink-400 transition" />
                                            <span className="font-medium">{item.likes}</span>
                                        </button>

                                        <div className="flex items-center gap-1.5 text-blue-300">
                                            <Eye size={18} />
                                            <span className="text-sm">{item.views || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Gallery;
