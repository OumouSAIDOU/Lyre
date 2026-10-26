import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Type, Maximize2, Minimize2, 
  BookOpen, Sparkles, CheckCircle 
} from 'lucide-react';

export default function Reader({ API_URL }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // Nouveaux états de confort visuel
  const [fontSize, setFontSize] = useState(19);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [fontFamily, setFontFamily] = useState('serif'); // serif, sans, mono
  const [theme, setTheme] = useState('sepia'); // dark, sepia, midnight, light
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMarked, setIsMarked] = useState(false);

  useEffect(() => {
    // Récupère les détails du livre sélectionné
    fetch(`${API_URL}/api.php?action=books&id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBook(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Erreur lors du chargement du livre :', err);
        setLoading(false);
      });
  }, [id, API_URL]);

  // Gestion du scroll pour la barre de progression
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const total = scrollHeight - clientHeight;
    if (total > 0) {
      const currentProgress = Math.round((scrollTop / total) * 100);
      setProgress(currentProgress);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // Fonction pour marquer le livre comme lu
  const handleMarkAsRead = () => {
    const currentUser = JSON.parse(localStorage.getItem('lyre_user'));
    
    if (!currentUser) {
      alert("Connectez-vous pour enregistrer votre lecture !");
      return;
    }

    fetch(`${API_URL}/api.php?action=mark_read`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: currentUser.id,
        book_id: id
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        currentUser.booksReadCount = data.booksReadCount;
        localStorage.setItem('lyre_user', JSON.stringify(currentUser));
        setIsMarked(true);
        alert("🎉 Livre marqué comme lu ! Votre compteur a été mis à jour.");
      } else {
        alert(data.message || "Erreur lors de l'enregistrement.");
      }
    })
    .catch(err => {
      console.error("Erreur:", err);
      alert("Erreur de connexion avec le serveur.");
    });
  };

  if (loading) {
    return (
      <div className="reader-loading-screen">
        <BookOpen size={36} className="empty-icon-pulse" />
        <p>Chargement de l'ouvrage en streaming...</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="reader-error-container">
        <h2>Ouvrage introuvable</h2>
        <p>Le livre demandé n'existe pas ou la base de données ne répond pas.</p>
        <Link to="/catalog" className="btn-primary" style={{ marginTop: '1rem' }}>
          Retour au catalogue
        </Link>
      </div>
    );
  }

  return (
    <div className={`reader-wrapper theme-${theme}`}>
      {/* Barre de progression fixe en haut */}
      <div className="reader-progress-bar" style={{ width: `${progress}%` }}></div>

      {/* Barre d'outils supérieure */}
      <header className="reader-header">
        <div className="reader-header-left">
          <Link to="/catalog" className="reader-nav-btn" title="Retour au catalogue">
            <ArrowLeft size={18} />
            <span className="hide-mobile">Catalogue</span>
          </Link>
          <div className="reader-book-info">
            <span className="reader-book-title">{book.title}</span>
            <span className="reader-book-author">par {book.author}</span>
          </div>
        </div>

        <div className="reader-header-right">
          {/* Bouton Marquer comme lu */}
          <button 
            className={`reader-tool-btn ${isMarked ? 'marked' : ''}`}
            onClick={handleMarkAsRead}
            title="Marquer comme lu"
            style={{ color: isMarked ? '#10b981' : 'inherit' }}
          >
            <CheckCircle size={18} />
            <span className="hide-mobile">{isMarked ? 'Lu' : 'Terminer'}</span>
          </button>

          <button 
            className={`reader-tool-btn ${showSettings ? 'active' : ''}`}
            onClick={() => setShowSettings(!showSettings)}
            title="Options d'affichage"
          >
            <Type size={18} />
            <span className="hide-mobile">Affichage</span>
          </button>

          <button 
            className="reader-tool-btn"
            onClick={toggleFullscreen}
            title="Plein écran"
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </header>

      {/* Panneau flottant de configuration de lecture */}
      {showSettings && (
        <div className="reader-settings-panel">
          <div className="settings-section">
            <label>Thème visuel</label>
            <div className="theme-selector">
              <button className={`theme-chip dark ${theme === 'dark' ? 'selected' : ''}`} onClick={() => setTheme('dark')} title="Sombre" />
              <button className={`theme-chip sepia ${theme === 'sepia' ? 'selected' : ''}`} onClick={() => setTheme('sepia')} title="Sépia" />
              <button className={`theme-chip midnight ${theme === 'midnight' ? 'selected' : ''}`} onClick={() => setTheme('midnight')} title="Nuit" />
              <button className={`theme-chip light ${theme === 'light' ? 'selected' : ''}`} onClick={() => setTheme('light')} title="Clair" />
            </div>
          </div>

          <div className="settings-section">
            <label>Police</label>
            <div className="font-selector">
              <button className={`font-btn ${fontFamily === 'serif' ? 'active' : ''}`} onClick={() => setFontFamily('serif')}>Serif</button>
              <button className={`font-btn ${fontFamily === 'sans' ? 'active' : ''}`} onClick={() => setFontFamily('sans')}>Sans</button>
              <button className={`font-btn ${fontFamily === 'mono' ? 'active' : ''}`} onClick={() => setFontFamily('mono')}>Mono</button>
            </div>
          </div>

          <div className="settings-section">
            <div className="label-with-val">
              <label>Taille du texte</label>
              <span>{fontSize}px</span>
            </div>
            <div className="slider-row">
              <button onClick={() => setFontSize(Math.max(14, fontSize - 1))}>A-</button>
              <input type="range" min="14" max="28" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
              <button onClick={() => setFontSize(Math.min(28, fontSize + 1))}>A+</button>
            </div>
          </div>

          <div className="settings-section">
            <div className="label-with-val">
              <label>Interlignage</label>
              <span>{lineHeight}</span>
            </div>
            <div className="slider-row">
              <input type="range" min="1.4" max="2.2" step="0.1" value={lineHeight} onChange={(e) => setLineHeight(Number(e.target.value))} />
            </div>
          </div>
        </div>
      )}

      {/* Zone de lecture scrollable */}
      <main className="reader-scroll-area" onScroll={handleScroll}>
        <article 
          className={`reader-content-body font-${fontFamily}`}
          style={{ fontSize: `${fontSize}px`, lineHeight: lineHeight }}
        >
          <div className="reader-chapter-badge">
            <Sparkles size={14} /> Lecture en ligne
          </div>
          
          <h1 className="reader-heading-title">{book.title}</h1>
          <p className="reader-heading-author">Par {book.author}</p>
          
          <div className="reader-divider"></div>

          <div className="reader-text">
            {book.content ? (
              book.content.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))
            ) : (
              <p className="no-content-msg">
                Le texte intégral de cet ouvrage n'est pas encore disponible dans la base de données.
              </p>
            )}
          </div>
        </article>
      </main>

      {/* Pied de page du lecteur */}
      <footer className="reader-footer">
        <span className="reader-progress-text">{progress}% lu</span>
        <span className="reader-time-estimate">
          {progress === 100 ? 'Lecture terminée' : 'Mode liseuse haut de gamme'}
        </span>
      </footer>
    </div>
  );
}