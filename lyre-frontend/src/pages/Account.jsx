import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Lock, Mail, ArrowRight, BookOpen, LogOut, Calendar } from 'lucide-react';

export default function Account({ API_URL }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  // État de l'utilisateur connecté stocké dans le navigateur
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('lyre_user')) || null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  const navigate = useNavigate();

  // Charger l'historique des lectures si l'utilisateur est connecté
  useEffect(() => {
    if (!user) return;

    setLoadingHistory(true);
    fetch(`${API_URL}/api.php?action=user_history&user_id=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setHistory(data.history);
        }
        setLoadingHistory(false);
      })
      .catch(err => {
        console.error("Erreur historique:", err);
        setLoadingHistory(false);
      });
  }, [user, API_URL]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const endpoint = `${API_URL}/api.php?action=${isLoginMode ? 'login' : 'register'}`;
    const payload = isLoginMode 
      ? { email, password } 
      : { name, email, password };

    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('lyre_user', JSON.stringify(data.user));
      } else {
        setError(data.message || 'Une erreur est survenue.');
      }
    })
    .catch(err => {
      console.error(err);
      setError('Impossible de contacter le serveur PHP.');
    });
  };

  const handleLogout = () => {
    setUser(null);
    setHistory([]);
    localStorage.removeItem('lyre_user');
  };

  // --- SI L'UTILISATEUR EST CONNECTÉ ---
  if (user) {
    return (
      <div className="page-container account-container">
        <div className="account-card-modern" style={{ maxWidth: '800px', width: '100%' }}>
          
          {/* Juste le nom, sans "Bonjour" ni email ni badge */}
          <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>{user.name}</h2>

          {/* Une seule boîte de stats pour le compteur */}
          <div className="account-stats-row" style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="account-stat-box" style={{ textAlign: 'center', padding: '1rem 2rem' }}>
              <span className="stat-num" style={{ fontSize: '2rem', display: 'block' }}>{user.booksReadCount || history.length}</span>
              <span className="stat-lab">Livres lus</span>
            </div>
          </div>

          {/* Section Historique de Lecture */}
          <div className="profile-history-section" style={{ marginTop: '2rem', textAlign: 'left' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={20} /> Mon Historique de Lecture
            </h3>

            {loadingHistory ? (
              <p>Chargement de votre bibliothèque...</p>
            ) : history.length === 0 ? (
              <div className="empty-history" style={{ padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                <p>Vous n'avez pas encore marqué de livres comme lus depuis la liseuse.</p>
              </div>
            ) : (
              <div className="history-books-grid" style={{ display: 'grid', gap: '1rem', maxHeight: '350px', overflowY: 'auto', paddingRight: '5px' }}>
                {history.map((book) => (
                  <div key={book.id} className="history-book-card" style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '8px' }}>
                    {book.cover_url && (
                      <img src={book.cover_url} alt={book.title} style={{ width: '50px', height: '70px', objectFit: 'cover', borderRadius: '4px' }} />
                    )}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{book.title}</h4>
                      <p style={{ margin: '0 0 6px 0', fontSize: '0.85rem', opacity: 0.8 }}>Par {book.author}</p>
                      <span style={{ fontSize: '0.75rem', opacity: 0.6, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={12} /> Lu le : {new Date(book.read_at).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    {/* Correction de la route : /read/ au lieu de /reader/ */}
                    <Link to={`/read/${book.id}`} className="btn-glow-primary" style={{ padding: '6px 12px', fontSize: '0.85rem', textDecoration: 'none' }}>
                      Relire
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="account-actions" style={{ marginTop: '2rem' }}>
            <Link to="/catalog" className="btn-glow-primary" style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} /> Accéder au catalogue
            </Link>
            <button onClick={handleLogout} className="btn-logout" style={{ marginTop: '10px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <LogOut size={16} /> Se déconnecter
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- FORMULAIRE DE CONNEXION / INSCRIPTION ---
  return (
    <div className="page-container account-container">
      <div className="account-card-modern">
        <div className="account-header">
          <span className="section-subtitle">ESPACE MEMBRE</span>
          <h2>{isLoginMode ? 'Connexion' : 'Créer un compte'}</h2>
          <p>{isLoginMode ? 'Accédez à votre bibliothèque personnelle.' : 'Rejoignez la plateforme Lyre dès maintenant.'}</p>
        </div>

        {error && <div className="auth-alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLoginMode && (
            <div className="input-group">
              <label>Nom complet</label>
              <div className="input-field-wrapper">
                <User size={18} className="input-icon" />
                <input 
                  type="text" 
                  placeholder="Votre nom" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>
            </div>
          )}

          <div className="input-group">
            <label>Adresse e-mail</label>
            <div className="input-field-wrapper">
              <Mail size={18} className="input-icon" />
              <input 
                type="email" 
                placeholder="votre@email.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="input-group">
            <label>Mot de passe</label>
            <div className="input-field-wrapper">
              <Lock size={18} className="input-icon" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
          </div>

          <button type="submit" className="btn-glow-primary auth-submit-btn">
            {isLoginMode ? 'Se connecter' : "S'inscrire"} <ArrowRight size={16} />
          </button>
        </form>

        <div className="auth-switch-prompt">
          <p>
            {isLoginMode ? "Pas encore de compte ?" : "Déjà un compte ?"}
            <button 
              type="button" 
              onClick={() => { setIsLoginMode(!isLoginMode); setError(''); }}
              className="switch-mode-btn"
            >
              {isLoginMode ? "S'inscrire" : "Se connecter"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}