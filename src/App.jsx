import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Loading from './components/Loading';
import ErrorBoundary from './components/ErrorBoundary';

// Lazy loading pages
const Home = lazy(() => import('./pages/Home'));
const DecorateTree = lazy(() => import('./pages/DecorateTree'));
const MeetSanta = lazy(() => import('./pages/MeetSanta'));
const SantaChat = lazy(() => import('./pages/SantaChat'));
const Gallery = lazy(() => import('./pages/Gallery'));

// Wrapper to handle location for AnimatePresence
const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="decorate" element={<DecorateTree />} />
          <Route path="meet-santa" element={<MeetSanta />} />
          <Route path="chat" element={<SantaChat />} />
          <Route path="gallery" element={<Gallery />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <AnimatedRoutes />
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
