import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Snowfall from './Snowfall';
import BackgroundMusic from './BackgroundMusic';

const Layout = () => {
    return (
        <div className="min-h-screen relative text-white">
            <Snowfall count={60} />
            <Navbar />
            <BackgroundMusic />
            <main className="pt-24 px-4 container mx-auto relative z-10 pb-10">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
