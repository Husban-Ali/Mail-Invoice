import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Home/Navbar.jsx';
import Footer from './Home/Footer.jsx';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
