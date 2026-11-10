import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Account from './pages/Account';
import Reader from './pages/Reader';
import AddBook from './pages/AddBook';

import './App.css';

export default function App() {
  // Conserver le thème actuel de LYRE
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('lyre_theme') === 'dark'
  );

  useEffect(() => {
    localStorage.setItem(
      'lyre_theme',
      darkMode ? 'dark' : 'light'
    );

    document.body.classList.toggle('dark-mode', darkMode);

    return () => {
      document.body.classList.remove('dark-mode');
    };
  }, [darkMode]);

  return (
    <Router>
      <div className="app-container">

        <Navbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <main className="main-content">
          <Routes>

            {/* Accueil */}
            <Route
              path="/"
              element={<Home />}
            />

            {/* Catalogue */}
            <Route
              path="/catalog"
              element={<Catalog />}
            />

            {/* Espace personnel */}
            <Route
              path="/account"
              element={<Account />}
            />

            {/* Lecture d'un livre */}
            <Route
              path="/read/:id"
              element={<Reader />}
            />

            {/* Ajout d'un livre */}
            <Route
              path="/add-book"
              element={<AddBook />}
            />

          </Routes>
        </main>

      </div>
    </Router>
  );
}