import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="text-6xl"
            >
                ❄️
            </motion.div>
            <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[#F8B229] font-['Mountains_of_Christmas'] text-2xl"
            >
                Loading some magic...
            </motion.p>
        </div>
    );
};

export default Loading;
