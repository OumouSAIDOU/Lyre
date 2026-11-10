import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X } from 'lucide-react';
import { supabase } from '../supabaseClient';

// Identifiant de ton compte administrateur Supabase
const ADMIN_ID = 'df305a11-3dc2-43ce-9461-f7c83ffb6ad2';

export default function Navbar({ darkMode, setDarkMode }) {
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const closeMenu = () => setIsOpen(false);

  // Vérifier si l'utilisateur connecté est l'administrateur
  useEffect(() => {
    let active = true;

    const checkAdmin = async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();

      if (active) {
        setIsAdmin(!error && user?.id === ADMIN_ID);
      }
    };

    checkAdmin();

    // Mettre à jour le menu après une connexion ou déconnexion
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      setIsAdmin(session?.user?.id === ADMIN_ID);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="navbar">

      {/* Logo image à gauche */}
      <Link
        to="/"
        className="logo"
        onClick={closeMenu}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none'
        }}
      >
        <img
          src="/logo.png"
          alt="Lyre Logo"
          style={{
            height: '60px',
            width: 'auto',
            objectFit: 'contain'
          }}
        />

        <span
          className="logo-text"
          style={{
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.2rem'
          }}
        ></span>
      </Link>

      {/* Liens de navigation */}
      <nav
        className={`nav-links ${isOpen ? 'active' : ''}`}
        style={{
          backgroundColor: darkMode ? '#0f172a' : '#ffffff',
          color: darkMode ? '#ffffff' : '#0f172a'
        }}
      >

        <Link
          to="/"
          onClick={closeMenu}
          className={`nav-link ${
            location.pathname === '/' ? 'active' : ''
          }`}
        >
          Accueil
        </Link>

        <Link
          to="/catalog"
          onClick={closeMenu}
          className={`nav-link ${
            location.pathname === '/catalog' ? 'active' : ''
          }`}
        >
          Catalogue
        </Link>

        <Link
          to="/account"
          onClick={closeMenu}
          className={`nav-link ${
            location.pathname === '/account' ? 'active' : ''
          }`}
        >
          Mon Compte
        </Link>

        {/* Lien visible uniquement par l'administrateur */}
        {isAdmin && (
          <Link
            to="/add-book"
            onClick={closeMenu}
            className={`nav-link ${
              location.pathname === '/add-book' ? 'active' : ''
            }`}
          >
            Ajouter un livre
          </Link>
        )}

      </nav>

      {/* Actions à droite */}
      <div
        className="nav-actions"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >

        <button
          className="theme-toggle-btn"
          onClick={() => setDarkMode(!darkMode)}
          title={
            darkMode
              ? 'Passer en mode clair'
              : 'Passer en mode sombre'
          }
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>
    </header>
  );
}