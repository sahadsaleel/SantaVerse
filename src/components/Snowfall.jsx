import React, { useMemo } from 'react';
import './Snowfall.css';

const Snowfall = ({ count = 50 }) => {
  const snowflakes = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 5 + Math.random() * 10,
      animationDelay: Math.random() * 5,
      opacity: 0.3 + Math.random() * 0.7,
      size: 0.5 + Math.random() * 1.5,
    }));
  }, [count]);

  return (
    <div className="snowfall-container">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: `${flake.left}%`,
            animationDuration: `${flake.animationDuration}s`,
            animationDelay: `${flake.animationDelay}s`,
            opacity: flake.opacity,
            width: `${flake.size}rem`,
            height: `${flake.size}rem`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
  );
};

export default Snowfall;
