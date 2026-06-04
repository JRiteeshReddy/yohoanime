import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Landing } from './pages/Landing';
import { AnimeDetail } from './pages/AnimeDetail';
import { Watch } from './pages/Watch';
import { Search } from './pages/Search';

const AppContent = ({ hasVisited, onVisitHome }: { hasVisited: boolean; onVisitHome: () => void }) => {
  if (!hasVisited) {
    return <Landing onVisitHome={onVisitHome} />;
  }

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/anime/:id" element={<AnimeDetail />} />
        <Route path="/watch/:id/:ep" element={<Watch />} />
      </Routes>
    </>
  );
};

function App() {
  const [hasVisited, setHasVisited] = useState(() => {
    return sessionStorage.getItem('yoho_landing_visited') === 'true';
  });

  const handleVisitHome = () => {
    sessionStorage.setItem('yoho_landing_visited', 'true');
    setHasVisited(true);
  };

  return (
    <BrowserRouter>
      <AppContent hasVisited={hasVisited} onVisitHome={handleVisitHome} />
    </BrowserRouter>
  );
}

export default App;
