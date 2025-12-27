import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
                    <h1 className="text-6xl mb-4">🎄⚠️</h1>
                    <h2 className="text-4xl text-[#D42426] font-['Mountains_of_Christmas'] mb-4">
                        The Grinch Stole the Code!
                    </h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-md">
                        Something went wrong. But don't worry, the elves are fixing it.
                    </p>
                    <a
                        href="/"
                        className="px-6 py-3 bg-[#165B33] text-white rounded-full font-bold hover:bg-[#1D7A44]"
                    >
                        Return Home
                    </a>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
