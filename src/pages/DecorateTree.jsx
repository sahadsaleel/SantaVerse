import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { mockBackend } from '../services/mockBackend';
import { Download, Share2, RotateCw, Trash2, Camera } from 'lucide-react';
import tree1 from '../assets/christmas-tree-png-31857.png';
import tree2 from '../assets/christmas-tree-png-31864.png';
import tree3 from '../assets/christmas-tree-png-31873.png';
import bgMountains from '../assets/bg_mountains.png';
import bgRiver from '../assets/bg_river.png';
import bgHouse from '../assets/bg_house.png';

const ORNAMENTS = [
    // Stars
    { id: 'star_gold', type: '⭐', color: '#FFD700', label: 'Gold Star' },
    { id: 'star_white', type: '✨', color: '#FFFFFF', label: 'Sparkle Star' },
    { id: 'star_red', type: '🌟', color: '#FF0000', label: 'Red Star' },

    // Balls/Bulbs
    { id: 'ball_red', type: '🔴', color: '#FF0000', label: 'Red Ball' },
    { id: 'ball_blue', type: '🔵', color: '#0000FF', label: 'Blue Ball' },
    { id: 'ball_gold', type: '🟡', color: '#FFD700', label: 'Gold Ball' },
    { id: 'ball_green', type: '🟢', color: '#00FF00', label: 'Green Ball' },
    { id: 'ball_purple', type: '🟣', color: '#800080', label: 'Purple Ball' },

    // Gifts
    { id: 'gift_1', type: '🎁', color: '#00FF00', label: 'Gift Box' },
    { id: 'gift_2', type: '🎀', color: '#FF0000', label: 'Gift Bow' },
    { id: 'present', type: '🎉', color: '#FFD700', label: 'Present' },

    // Other decorations
    { id: 'bell', type: '🔔', color: '#FFD700', label: 'Bell' },
    { id: 'cane', type: '🍬', color: '#FFFFFF', label: 'Candy Cane' },
    { id: 'socks', type: '🧦', color: '#FF0000', label: 'Stocking' },
    { id: 'snowflake', type: '❄️', color: '#FFFFFF', label: 'Snowflake' },
    { id: 'angel', type: '👼', color: '#FFFFFF', label: 'Angel' },
];

const TREES = [
    { id: 'tree1', label: 'Classic Pine', img: tree1 },
    { id: 'tree2', label: 'Snowy Fir', img: tree2 },
    { id: 'tree3', label: 'Mini Tree', img: tree3 },
];

const BACKGROUNDS = [
    { id: 'mountains', label: 'Snowy Mountains', img: bgMountains },
    { id: 'river', label: 'Frozen River', img: bgRiver },
    { id: 'house', label: 'Cozy Cottage', img: bgHouse },
];

const DecorateTree = () => {
    const navigate = useNavigate();
    const treeRef = useRef(null);

    const [decorations, setDecorations] = useState([]);
    const [activeBg, setActiveBg] = useState(BACKGROUNDS[0]);
    const [activeTree, setActiveTree] = useState(TREES[0]);
    const [treeRotation, setTreeRotation] = useState(0); // 0 or 1 (for flip)

    // Dragging state
    const [draggingItem, setDraggingItem] = useState(null);

    // Handle Drop on Container
    const handleDrop = (e) => {
        e.preventDefault();
        if (!draggingItem) return;

        // Calculate relative position within the tree container
        const rect = treeRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        const newDeco = {
            ...draggingItem,
            uid: Date.now() + Math.random(),
            x,
            y,
        };

        setDecorations([...decorations, newDeco]);
        setDraggingItem(null);
    };

    const handleDragOver = (e) => e.preventDefault();

    const clearTree = () => setDecorations([]);

    const toggleRotation = () => {
        setTreeRotation(prev => prev === 0 ? 1 : 0);
    };

    // Capture & Share logic
    // Capture & Share logic
    const handleShare = async () => {
        if (!treeRef.current) return;

        // 1. Check User Session
        let username = mockBackend.getUsername();
        if (!username) {
            // SweetAlert2 Prompt
            const { value: name } = await Swal.fire({
                title: 'What is your name? 🎅',
                input: 'text',
                inputLabel: 'So Santa knows who made this masterpiece!',
                inputPlaceholder: 'Enter your name...',
                confirmButtonColor: '#D42426',
                confirmButtonText: 'Start Sharing',
                background: '#0F3D2E',
                color: '#fff',
                customClass: {
                    input: 'text-center'
                },
                inputValidator: (value) => {
                    if (!value) {
                        return 'You need to write something!'
                    }
                }
            });

            if (!name) return; // Cancelled
            username = name;
            mockBackend.setUsername(username);
        }

        try {
            console.log("Starting capture...");
            // 2. Capture
            const canvas = await html2canvas(treeRef.current, {
                useCORS: true, // For images
                scale: 2, // High res
                backgroundColor: null, // Transparent bg where possible
                logging: false
            });
            console.log("Capture complete");

            // Compression: Use JPEG with 0.8 quality to fit in localStorage
            const image = canvas.toDataURL("image/jpeg", 0.8);

            // 3. Save to Backend
            console.log("Saving to gallery...", username);
            try {
                const item = mockBackend.addToGallery({ username, image });
                console.log("Saved item:", item);
            } catch (storageErr) {
                console.error("Storage failed", storageErr);
                if (storageErr.name === 'QuotaExceededError' || storageErr.code === 22) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gallery Full!',
                        text: 'Please clear some space or try a simpler tree.',
                        confirmButtonColor: '#D42426',
                        background: '#0F3D2E',
                        color: '#fff'
                    });
                    return;
                }
                throw storageErr;
            }

            // 4. Redirect
            await Swal.fire({
                title: 'Shared!',
                text: `🎄 Beautiful tree, ${username}! Shared to gallery.`,
                icon: 'success',
                confirmButtonColor: '#165B33',
                background: '#0F3D2E',
                color: '#fff',
                timer: 2000,
                timerProgressBar: true
            });
            navigate('/gallery');

        } catch (err) {
            console.error("Share failed", err);
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'The elves dropped the camera. Try again.',
                confirmButtonColor: '#D42426',
                background: '#0F3D2E',
                color: '#fff'
            });
        }
    };

    const handleDownload = async () => {
        if (!treeRef.current) return;
        const canvas = await html2canvas(treeRef.current);
        const link = document.createElement('a');
        link.download = 'my-christmas-tree.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] gap-4 pb-4">
            {/* Main Workspace */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 overflow-hidden">

                {/* Tree Canvas */}
                <div
                    className="flex-1 rounded-3xl relative overflow-hidden shadow-2xl transition-all duration-500 group"
                    ref={treeRef}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-all duration-700"
                        style={{ backgroundImage: `url(${activeBg.img})` }}
                    />

                    {/* Overlay to dim background slightly for tree focus */}
                    <div className="absolute inset-0 bg-black/10 pointer-events-none" />

                    {/* The Tree Container - Aligned to Bottom Center */}
                    <div className="absolute inset-0 flex items-end justify-center pointer-events-none pb-0 z-0">
                        {/* Container ensures tree sits on the "floor" across all backgrounds */}
                        <div
                            className="relative w-auto h-[75%] md:h-[85%] aspect-[2/3] transition-transform duration-500 origin-bottom"
                            style={{ transform: `scaleX(${treeRotation === 1 ? -1 : 1})` }}
                        >
                            <img
                                src={activeTree.img}
                                alt="Realistic Christmas Tree"
                                className="w-full h-full object-contain object-bottom filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                            />
                        </div>
                    </div>

                    {/* Placed Decorations */}
                    {decorations.map((deco) => (
                        <motion.div
                            key={deco.uid}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`absolute text-5xl cursor-pointer hover:scale-125 transition-transform z-10 ${deco.type === '⭐' || deco.type === '✨' || deco.type === '🌟' ||
                                deco.type === '🟡' || deco.type === '🔴' || deco.type === '🔵' ||
                                deco.type === '🟢' || deco.type === '🟣'
                                ? 'animate-pulse drop-shadow-[0_0_15px_rgba(255,255,200,0.9)] brightness-125'
                                : 'drop-shadow-lg'
                                }`}
                            style={{
                                left: `${deco.x}%`,
                                top: `${deco.y}%`,
                                transform: 'translate(-50%, -50%)',
                                textShadow: (deco.type === '⭐' || deco.type === '✨' || deco.type === '🌟')
                                    ? '0 0 30px #FFD700, 0 0 10px white'
                                    : 'none'
                            }}
                            drag
                            dragMomentum={false}
                        >
                            {deco.type}
                        </motion.div>
                    ))}

                    {/* Signature Overlay */}
                    <div className="absolute bottom-4 right-6 text-white/80 text-lg font-['Mountains_of_Christmas'] drop-shadow-md">
                        SantaVerse
                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="w-full md:w-80 bg-[#0F3D2E]/90 backdrop-blur-xl rounded-3xl p-4 flex flex-col border border-[#F8B229]/20 shadow-2xl max-h-[calc(100vh-120px)]">

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-4">

                        {/* Tree Selector */}
                        <div>
                            <h3 className="text-[#F8B229] mb-3 font-bold flex items-center gap-2 text-lg">
                                🎄 Choose Tree
                            </h3>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {TREES.map(tree => (
                                    <button
                                        key={tree.id}
                                        onClick={() => setActiveTree(tree)}
                                        className={`min-w-[80px] h-20 rounded-lg border-2 transition-all p-1 bg-white/5 ${activeTree.id === tree.id ? 'border-[#F8B229] scale-105 shadow-[0_0_10px_#F8B229]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        title={tree.label}
                                    >
                                        <img src={tree.img} className="w-full h-full object-contain" alt={tree.label} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Background Selector */}
                        <div>
                            <h3 className="text-[#F8B229] mb-3 font-bold flex items-center gap-2 text-lg">
                                <Camera size={20} /> Choose Scene
                            </h3>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {BACKGROUNDS.map(bg => (
                                    <button
                                        key={bg.id}
                                        onClick={() => setActiveBg(bg)}
                                        className={`min-w-[80px] h-16 rounded-lg border-2 transition-all p-1 bg-white/5 ${activeBg.id === bg.id ? 'border-[#F8B229] scale-105 shadow-[0_0_10px_#F8B229]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                        title={bg.label}
                                    >
                                        <img src={bg.img} className="w-full h-full object-cover rounded" alt={bg.label} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={toggleRotation} className="bg-[#165B33] p-3 rounded-xl text-white hover:bg-[#1D7A44] flex items-center justify-center gap-2 shadow-lg border border-white/5 font-medium">
                                <RotateCw size={18} /> Flip Tree
                            </button>
                            <button onClick={clearTree} className="bg-[#D42426] p-3 rounded-xl text-white hover:bg-red-700 flex items-center justify-center gap-2 shadow-lg border border-white/5 font-medium">
                                <Trash2 size={18} /> Reset
                            </button>
                        </div>

                        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

                        {/* Ornament Toolbar */}
                        <div>
                            <h3 className="text-[#F8B229] mb-3 font-bold text-lg">Ornaments</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {ORNAMENTS.map(orn => (
                                    <div
                                        key={orn.id}
                                        draggable
                                        onDragStart={() => setDraggingItem(orn)}
                                        onDragEnd={() => setDraggingItem(null)}
                                        className="aspect-square bg-[#165B33]/50 rounded-xl flex items-center justify-center text-3xl cursor-grab active:cursor-grabbing hover:bg-[#F8B229] hover:text-[#0F3D2E] hover:scale-110 transition-all shadow-md border border-white/10"
                                        title={orn.label}
                                    >
                                        {orn.type}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Fixed Action Buttons at Bottom */}
                    <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                        <button
                            onClick={handleShare}
                            className="w-full py-4 bg-gradient-to-r from-[#F8B229] to-yellow-500 text-[#0F3D2E] rounded-xl font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(248,178,41,0.4)] animate-pulse"
                        >
                            <Share2 /> Share to Gallery
                        </button>
                        <button
                            onClick={handleDownload}
                            className="w-full py-3 bg-[#165B33] text-white rounded-xl font-bold hover:bg-[#1D7A44] flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Download size={18} /> Save Image
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default DecorateTree;
