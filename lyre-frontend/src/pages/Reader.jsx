import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Type,
  Maximize2,
  Minimize2,
  BookOpen,
  Sparkles,
  CheckCircle
} from 'lucide-react';

import { supabase } from '../supabaseClient';

export default function Reader() {
  const { id } = useParams();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Paramètres de lecture
  const [fontSize, setFontSize] = useState(19);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [fontFamily, setFontFamily] = useState('serif');
  const [theme, setTheme] = useState('sepia');

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMarked, setIsMarked] = useState(false);

  // ==========================================
  // 1. CHARGER LE LIVRE DEPUIS SUPABASE
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    async function loadBook() {
      setLoading(true);
      setError('');
      setBook(null);
      setProgress(0);
      setIsMarked(false);

      try {
        const { data, error: supabaseError } = await supabase
          .from('books')
          .select(
            'id, title, author, content, category, cover_url, description'
          )
          .eq('id', id)
          .maybeSingle();

        if (supabaseError) {
          throw supabaseError;
        }

        if (!cancelled) {
          setBook(data);
        }
      } catch (err) {
        console.error('Erreur chargement du livre :', err);

        if (!cancelled) {
          setError(
            "Impossible de charger ce livre depuis Supabase."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBook();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ==========================================
  // 2. PROGRESSION DE LECTURE
  // ==========================================

  const handleScroll = (e) => {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = e.currentTarget;

    const total = scrollHeight - clientHeight;

    if (total > 0) {
      const currentProgress = Math.round(
        (scrollTop / total) * 100
      );

      setProgress(
        Math.min(100, Math.max(0, currentProgress))
      );
    } else {
      setProgress(100);
    }
  };

  // ==========================================
  // 3. PLEIN ÉCRAN
  // ==========================================

  useEffect(() => {
    const updateFullscreen = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener(
      'fullscreenchange',
      updateFullscreen
    );

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        updateFullscreen
      );
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Erreur plein écran :', err);
    }
  };

  // ==========================================
  // 4. MARQUER UN LIVRE COMME LU
  // ==========================================

  const handleMarkAsRead = () => {
    /*
      Cette fonctionnalité sera connectée à Supabase
      après la mise en place de Supabase Auth.

      Nous ne devons pas utiliser un user_id provenant
      directement du localStorage pour modifier les
      données d'un utilisateur.
    */

    alert(
      "Le suivi des livres lus sera disponible après la connexion des comptes à Supabase."
    );
  };

  // ==========================================
  // 5. CHARGEMENT
  // ==========================================

  if (loading) {
    return (
      <div className="reader-loading-screen">
        <BookOpen
          size={36}
          className="empty-icon-pulse"
        />

        <p>Chargement de l'ouvrage...</p>
      </div>
    );
  }

  // ==========================================
  // 6. ERREUR
  // ==========================================

  if (error || !book) {
    return (
      <div className="reader-error-container">
        <h2>
          {error ? 'Erreur de chargement' : 'Ouvrage introuvable'}
        </h2>

        <p>
          {error ||
            "Le livre demandé n'existe pas dans la bibliothèque."}
        </p>

        <Link
          to="/catalog"
          className="btn-primary"
          style={{ marginTop: '1rem' }}
        >
          Retour au catalogue
        </Link>
      </div>
    );
  }

  // ==========================================
  // 7. AFFICHAGE DU LECTEUR
  // ==========================================

  return (
    <div className={`reader-wrapper theme-${theme}`}>

      {/* Barre de progression */}
      <div
        className="reader-progress-bar"
        style={{ width: `${progress}%` }}
      />

      {/* Barre supérieure */}
      <header className="reader-header">

        <div className="reader-header-left">

          <Link
            to="/catalog"
            className="reader-nav-btn"
            title="Retour au catalogue"
          >
            <ArrowLeft size={18} />

            <span className="hide-mobile">
              Catalogue
            </span>
          </Link>

          <div className="reader-book-info">
            <span className="reader-book-title">
              {book.title}
            </span>

            <span className="reader-book-author">
              par {book.author}
            </span>
          </div>

        </div>

        <div className="reader-header-right">

          {/* Marquer comme lu */}
          <button
            className={`reader-tool-btn ${
              isMarked ? 'marked' : ''
            }`}
            onClick={handleMarkAsRead}
            title="Marquer comme lu"
            style={{
              color: isMarked ? '#10b981' : 'inherit'
            }}
          >
            <CheckCircle size={18} />

            <span className="hide-mobile">
              {isMarked ? 'Lu' : 'Terminer'}
            </span>
          </button>

          {/* Réglages */}
          <button
            className={`reader-tool-btn ${
              showSettings ? 'active' : ''
            }`}
            onClick={() => setShowSettings(!showSettings)}
            title="Options d'affichage"
          >
            <Type size={18} />

            <span className="hide-mobile">
              Affichage
            </span>
          </button>

          {/* Plein écran */}
          <button
            className="reader-tool-btn"
            onClick={toggleFullscreen}
            title="Plein écran"
          >
            {isFullscreen ? (
              <Minimize2 size={18} />
            ) : (
              <Maximize2 size={18} />
            )}
          </button>

        </div>
      </header>

      {/* ==================================
          PARAMÈTRES D'AFFICHAGE
          ================================== */}

      {showSettings && (
        <div className="reader-settings-panel">

          {/* Thème */}
          <div className="settings-section">
            <label>Thème visuel</label>

            <div className="theme-selector">

              <button
                className={`theme-chip dark ${
                  theme === 'dark' ? 'selected' : ''
                }`}
                onClick={() => setTheme('dark')}
                title="Sombre"
              />

              <button
                className={`theme-chip sepia ${
                  theme === 'sepia' ? 'selected' : ''
                }`}
                onClick={() => setTheme('sepia')}
                title="Sépia"
              />

              <button
                className={`theme-chip midnight ${
                  theme === 'midnight' ? 'selected' : ''
                }`}
                onClick={() => setTheme('midnight')}
                title="Nuit"
              />

              <button
                className={`theme-chip light ${
                  theme === 'light' ? 'selected' : ''
                }`}
                onClick={() => setTheme('light')}
                title="Clair"
              />

            </div>
          </div>

          {/* Police */}
          <div className="settings-section">
            <label>Police</label>

            <div className="font-selector">

              <button
                className={`font-btn ${
                  fontFamily === 'serif' ? 'active' : ''
                }`}
                onClick={() => setFontFamily('serif')}
              >
                Serif
              </button>

              <button
                className={`font-btn ${
                  fontFamily === 'sans' ? 'active' : ''
                }`}
                onClick={() => setFontFamily('sans')}
              >
                Sans
              </button>

              <button
                className={`font-btn ${
                  fontFamily === 'mono' ? 'active' : ''
                }`}
                onClick={() => setFontFamily('mono')}
              >
                Mono
              </button>

            </div>
          </div>

          {/* Taille */}
          <div className="settings-section">

            <div className="label-with-val">
              <label>Taille du texte</label>
              <span>{fontSize}px</span>
            </div>

            <div className="slider-row">

              <button
                onClick={() =>
                  setFontSize(Math.max(14, fontSize - 1))
                }
              >
                A-
              </button>

              <input
                type="range"
                min="14"
                max="28"
                value={fontSize}
                onChange={(e) =>
                  setFontSize(Number(e.target.value))
                }
              />

              <button
                onClick={() =>
                  setFontSize(Math.min(28, fontSize + 1))
                }
              >
                A+
              </button>

            </div>
          </div>

          {/* Interlignage */}
          <div className="settings-section">

            <div className="label-with-val">
              <label>Interlignage</label>
              <span>{lineHeight}</span>
            </div>

            <div className="slider-row">

              <input
                type="range"
                min="1.4"
                max="2.2"
                step="0.1"
                value={lineHeight}
                onChange={(e) =>
                  setLineHeight(Number(e.target.value))
                }
              />

            </div>
          </div>

        </div>
      )}

      {/* ==================================
          ZONE DE LECTURE
          ================================== */}

      <main
        className="reader-scroll-area"
        onScroll={handleScroll}
      >

        <article
          className={`reader-content-body font-${fontFamily}`}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight
          }}
        >

          <div className="reader-chapter-badge">
            <Sparkles size={14} />
            Lecture en ligne
          </div>

          <h1 className="reader-heading-title">
            {book.title}
          </h1>

          <p className="reader-heading-author">
            Par {book.author}
          </p>

          <div className="reader-divider" />

          <div className="reader-text">

            {book.content ? (
              book.content
                .split(/\n\s*\n/)
                .map((paragraph, index) => (
                  <p key={index}>
                    {paragraph}
                  </p>
                ))
            ) : (
              <p className="no-content-msg">
                Le texte intégral de cet ouvrage
                n'est pas encore disponible dans
                la base de données.
              </p>
            )}

          </div>

        </article>

      </main>

      {/* Pied de page */}
      <footer className="reader-footer">

        <span className="reader-progress-text">
          {progress}% lu
        </span>

        <span className="reader-time-estimate">
          {progress === 100
            ? 'Lecture terminée'
            : 'Mode liseuse haut de gamme'}
        </span>

      </footer>

    </div>
  );
}