import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import './App.css';
import Head from './compnent/head';
import LeftNav from './compnent/leftnav';
import Map from './compnent/map';
import AdminPage from './compnent/adminpage';
import View from './compnent/view';
import Contact from './compnent/contact';
import { sites } from './compnent/sites';

function App() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  const [isViewOpen, setIsViewOpen] = useState(false);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleViewSite = (siteName) => {
    const site = sites.find(s => s.name === siteName);
    if (site) {
      setSelectedSite(site);
      setIsViewOpen(true);
    }
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
  };

  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<AdminPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/*" element={
          <>
            <Head />
            <Map selectedLocation={selectedLocation} onViewSite={handleViewSite} />
            <LeftNav
              onLocationSelect={handleLocationSelect}
              onViewSite={handleViewSite}
            />
            <View
              site={selectedSite}
              isOpen={isViewOpen}
              onClose={handleCloseView}
            />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
