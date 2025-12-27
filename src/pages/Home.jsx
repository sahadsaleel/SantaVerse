import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Gift } from 'lucide-react';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="max-w-4xl"
            >
                <div className="mb-6 flex justify-center">
                    <Sparkles className="text-[#F8B229] animate-bounce" size={48} />
                </div>
                <h1 className="text-6xl md:text-8xl font-bold text-[#D42426] mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                    Welcome to <span className="text-[#F8B229]">SantaVerse</span>
                </h1>
                <p className="text-xl md:text-2xl text-[#F0F4F8] mb-10 max-w-2xl mx-auto font-light">
                    Experience the magic of Christmas! Decorate your dream tree, meet Santa in AR, and share the joy with your friends.
                </p>

                <div className="flex flex-col md:flex-row gap-6 justify-center">
                    <Link
                        to="/decorate"
                        className="group relative px-8 py-4 bg-[#D42426] rounded-full text-xl font-bold text-white shadow-[0_0_20px_rgba(212,36,38,0.5)] transition-transform hover:scale-105"
                    >
                        <span className="flex items-center gap-2">
                            <Gift /> Start Decorating
                        </span>
                        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                    </Link>

                    <Link
                        to="/meet-santa"
                        className="group relative px-8 py-4 bg-[#165B33] rounded-full text-xl font-bold text-white shadow-[0_0_20px_rgba(22,91,51,0.5)] transition-transform hover:scale-105"
                    >
                        Meet Santa
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Home;
