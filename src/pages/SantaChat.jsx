import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Share2, Download, Sparkles, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { mockBackend } from '../services/mockBackend';
import { useNavigate } from 'react-router-dom';

const SantaChat = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('ASK_NAME'); // ASK_NAME, ASK_AGE, CHAT_MODE
    const [userInfo, setUserInfo] = useState({ name: '', age: '' });
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showWishModal, setShowWishModal] = useState(false);

    const messagesEndRef = useRef(null);
    const wishCardRef = useRef(null);

    // Initial Greeting
    useEffect(() => {
        addMessage({ sender: 'santa', text: "Ho ho ho! Merry Christmas! 🎅 I'm Santa Claus. What is your name?" });
    }, []);

    const addMessage = (msg) => {
        setMessages(prev => [...prev, { ...msg, id: Date.now() }]);
        // Scroll to bottom
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    };

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg = { sender: 'user', text: input };
        addMessage(userMsg);
        setInput('');
        setIsTyping(true);

        // Process Response with Delay
        setTimeout(() => {
            let replyText = '';

            if (step === 'ASK_NAME') {
                // Extract clean name
                let name = input.trim();
                const prefixes = ["i am ", "i'm ", "my name is ", "it is ", "it's "];

                for (const prefix of prefixes) {
                    if (name.toLowerCase().startsWith(prefix)) {
                        name = name.slice(prefix.length).trim();
                        break; // Stop after finding first match
                    }
                }

                // Capitalize first letter
                if (name.length > 0) {
                    name = name.charAt(0).toUpperCase() + name.slice(1);
                }

                setUserInfo(prev => ({ ...prev, name }));
                setStep('ASK_AGE');
                replyText = `Nice to meet you, ${name}! 🎄 How old are you this year?`;
            } else if (step === 'ASK_AGE') {
                const age = parseInt(input);
                if (isNaN(age)) {
                    replyText = "Ho ho? That doesn't look like a number. How old are you?";
                } else {
                    setUserInfo(prev => ({ ...prev, age }));
                    setStep('CHAT_MODE');
                    // Age based logic
                    if (age < 12) {
                        replyText = "Wow! You've been growing so fast! 🌟 Have you been a good helper this year?";
                    } else {
                        replyText = "That's a wonderful age! Christmas is a time for kindness and gratitude. 🎁 What are you hoping for this year?";
                    }
                }
            } else {
                // General Chat Logic simulating AI
                replyText = generateSantaResponse(input, userInfo.age, userInfo.name);
            }

            addMessage({ sender: 'santa', text: replyText });
            setIsTyping(false);
        }, 1500);
    };

    const generateSantaResponse = (text, age, name) => {
        const lower = text.toLowerCase();

        // Simple Keywords Logic
        if (lower.includes('gift') || lower.includes('present') || lower.includes('want')) {
            return age < 12
                ? "Ooh, that sounds lovely! I'll double check with the elves in the workshop! 🎁"
                : "That's a thoughtful wish. Remember, the best gifts are the ones we give to others! ✨";
        }
        if (lower.includes('good') || lower.includes('nice')) {
            return "I'm so glad to hear that! My Nice List is getting very long this year! 📜";
        }
        if (lower.includes('naughty') || lower.includes('bad')) {
            return "It's never too late to spread some kindness before Christmas Eve! 🍪";
        }
        if (lower.includes('joke')) {
            return "What do you call a snowman with a six-pack? An abdominal snowman! Ho ho ho! ☃️";
        }

        // Default fallbacks
        const fallbacks = [
            `Ho ho ho! Tell me more, ${name}!`,
            "The North Pole is very busy today! ❄️",
            "Have you left out any cookies for me yet? 🍪",
            "Christmas magic is everywhere! ✨"
        ];
        return fallbacks[Math.floor(Math.random() * fallbacks.length)];
    };

    const generateWishCard = async (action) => {
        if (!wishCardRef.current) return;

        try {
            const canvas = await html2canvas(wishCardRef.current, { scale: 2, backgroundColor: null });
            const image = canvas.toDataURL("image/png");

            if (action === 'download') {
                const link = document.createElement('a');
                link.download = `Wish_from_Santa_${userInfo.name}.png`;
                link.href = image;
                link.click();
            } else if (action === 'share') {
                mockBackend.addToGallery({ username: userInfo.name, image });
                alert("Ho ho ho! Your wish has been shared to the Gallery! 🎄");
                navigate('/gallery');
            }
        } catch (err) {
            console.error("Wish generation failed", err);
        }
    };

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col gap-4">
            {/* Header */}
            <div className="bg-[#165B33]/90 backdrop-blur rounded-2xl p-4 flex items-center gap-4 border border-[#F8B229] shadow-lg">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-4xl border-2 border-white shadow">
                    🎅
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-[#F8B229]">Chat with Santa</h1>
                    <p className="text-sm text-white/80">
                        {isTyping ? "Santa is typing..." : "Online from North Pole"}
                    </p>
                </div>
                {step === 'CHAT_MODE' && (
                    <button
                        onClick={() => setShowWishModal(true)}
                        className="ml-auto px-4 py-2 bg-[#F8B229] text-[#0F3D2E] rounded-full font-bold shadow-lg hover:scale-105 transition flex items-center gap-2"
                    >
                        <Sparkles size={18} /> Generate Wish
                    </button>
                )}
            </div>

            {/* Chat Area */}
            <div className="flex-1 bg-black/20 rounded-2xl p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`max-w-[80%] rounded-2xl px-5 py-3 text-lg leading-relaxed shadow-md ${msg.sender === 'user'
                            ? 'bg-[#165B33] text-white rounded-tr-none'
                            : 'bg-white text-[#2E2E2E] rounded-tl-none'
                            }`}>
                            {msg.text}
                        </div>
                    </motion.div>
                ))}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="bg-white/50 px-4 py-2 rounded-full flex gap-1 items-center">
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-white rounded-full" />
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-white rounded-full" />
                            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-white rounded-full" />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-[#0F3D2E] p-2 rounded-2xl flex gap-2 border border-white/10">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message to Santa..."
                    className="flex-1 bg-black/20 rounded-xl px-4 text-white outline-none placeholder-white/30"
                />
                <button
                    onClick={handleSend}
                    className="bg-[#D42426] p-3 rounded-xl text-white hover:bg-red-700 transition"
                >
                    <Send size={20} />
                </button>
            </div>

            {/* Wish Modal */}
            <AnimatePresence>
                {showWishModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#0F3D2E] p-6 rounded-3xl max-w-md w-full border border-[#F8B229] relative"
                        >
                            <button
                                onClick={() => setShowWishModal(false)}
                                className="absolute top-4 right-4 text-white/50 hover:text-white"
                            >
                                <X />
                            </button>

                            <h2 className="text-2xl text-[#F8B229] mb-4 text-center">Your Special Wish</h2>

                            {/* The Card to Capture */}
                            <div
                                ref={wishCardRef}
                                className="bg-gradient-to-br from-[#D42426] to-[#8B0000] p-8 rounded-2xl shadow-2xl text-center border-4 border-[#F8B229] relative overflow-hidden mb-6"
                            >
                                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
                                    style={{ backgroundImage: 'radial-gradient(circle, white 2px, transparent 2.5px)', backgroundSize: '20px 20px' }}
                                />
                                <h3 className="text-3xl font-['Mountains_of_Christmas'] text-[#F8B229] mb-4">
                                    Dear {userInfo.name},
                                </h3>
                                <p className="text-white text-lg font-light italic mb-6 leading-relaxed">
                                    "Ho ho ho! Santa is proud of you.
                                    {userInfo.age < 12
                                        ? " May your Christmas be filled with magic, toys, and lots of cookies!"
                                        : " May your Christmas be filled with joy, peace, and new beginnings!"}
                                    <br />Keep shining bright!"
                                </p>
                                <div className="flex justify-center items-center gap-2 text-[#F8B229] font-bold">
                                    <span>— Santa Claus</span>
                                    <span className="text-2xl">🎅</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => generateWishCard('download')}
                                    className="px-4 py-3 bg-[#165B33] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#1D7A44]"
                                >
                                    <Download size={18} /> Download
                                </button>
                                <button
                                    onClick={() => generateWishCard('share')}
                                    className="px-4 py-3 bg-[#D42426] rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700"
                                >
                                    <Share2 size={18} /> Share
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SantaChat;
