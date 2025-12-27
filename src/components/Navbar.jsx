import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Camera, Image, Home, Menu, X, MessageCircle } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/decorate', label: 'Decorate Tree', icon: Gift },
        { path: '/meet-santa', label: 'Meet Santa', icon: Camera },
        { path: '/chat', label: 'Santa Chat', icon: MessageCircle },
        { path: '/gallery', label: 'Gallery', icon: Image },
    ];

    return (
        <nav className="fixed top-0 left-0 w-full z-40 bg-[#0F3D2E]/80 backdrop-blur-md border-b border-[#F8B229]/30 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                        <span className="text-3xl font-bold text-[#F8B229] font-['Mountains_of_Christmas'] group-hover:scale-110 transition-transform">
                            SantaVerse
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className={`relative px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 ${isActive
                                            ? 'bg-[#D42426] text-white shadow-[0_0_10px_#D42426]'
                                            : 'text-[#F0F4F8] hover:bg-[#165B33] hover:text-[#F8B229]'
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span className="font-medium text-lg">{item.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="nav-glow"
                                                className="absolute inset-0 rounded-full bg-white opacity-20"
                                                transition={{ duration: 0.3 }}
                                            />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-[#F8B229] hover:text-white p-2"
                        >
                            {isOpen ? <X size={32} /> : <Menu size={32} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Drawer */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[#165B33] border-b border-[#F8B229]"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsOpen(false)}
                                        className={`block px-4 py-3 rounded-lg text-lg font-medium flex items-center gap-3 ${isActive ? 'bg-[#D42426] text-white' : 'text-[#F0F4F8]'
                                            }`}
                                    >
                                        <item.icon size={20} />
                                        {item.label}
                                    </Link>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
