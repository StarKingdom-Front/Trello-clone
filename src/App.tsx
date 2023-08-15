import React from 'react';
import './App.css';
import NotFound from './layout/NotFound';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Header from './layout/Header';
import Footer from './layout/Footer';
import Sprint from './pages/Sprint/Sprint';
import SprintBoard from './pages/SprintBoard/SprintBoard';

function App() {
  
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pages/:id" element={<Sprint />} />
{/* 
        <Route path="/" element={<SprintBoard />} /> */}
        {/* /spirntBoard/:id */}

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
