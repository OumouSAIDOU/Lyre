import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Lock,
  Mail,
  ArrowRight,
  BookOpen,
  LogOut,
  Calendar
} from 'lucide-react';

import { supabase } from '../supabaseClient';

export default function Account() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // ==========================================
  // 1. VÉRIFIER LA SESSION SUPABASE
  // ==========================================

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const {
        data: { user: currentUser },
        error: sessionError
      } = await supabase.auth.getUser();

      if (!active) return;

      if (sessionError) {
        console.error('Erreur de session :', sessionError);
      }

      setUser(currentUser || null);
      setLoading(false);
    }

    checkSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      setUser(session?.user || null);
      setHistory([]);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // ==========================================
  // 2. CONNEXION ET INSCRIPTION
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const cleanEmail = email.trim().toLowerCase();

      if (isLoginMode) {
        // CONNEXION
        const { error: loginError } =
          await supabase.auth.signInWithPassword({
            email: cleanEmail,
            password
          });

        if (loginError) {
          throw loginError;
        }

        setPassword('');
      } else {
        // INSCRIPTION
        if (!name.trim()) {
          setError('Veuillez renseigner votre nom.');
          return;
        }

        const { data, error: registerError } =
          await supabase.auth.signUp({
            email: cleanEmail,
            password,
            options: {
              data: {
                name: name.trim()
              }
            }
          });

        if (registerError) {
          throw registerError;
        }

        setPassword('');

        if (!data.session) {
          setMessage(
            'Vérifiez votre boîte e-mail pour confirmer votre inscription.'
          );
        } else {
          setMessage('Votre compte a été créé avec succès !');
        }
      }
    } catch (err) {
      console.error('Erreur authentification :', err);

      if (err.message === 'Invalid login credentials') {
        setError('Adresse e-mail ou mot de passe incorrect.');
      } else if (err.message === 'Email not confirmed') {
        setError(
          'Veuillez confirmer votre adresse e-mail avant de vous connecter.'
        );
      } else if (err.message?.includes('Password should be')) {
        setError(
          'Votre mot de passe ne respecte pas les critères de sécurité.'
        );
      } else {
        setError(
          "Une erreur est survenue. Vérifiez vos informations et réessayez."
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // 3. DÉCONNEXION
  // ==========================================

  const handleLogout = async () => {
    setError('');
    setMessage('');

    const { error: logoutError } =
      await supabase.auth.signOut();

    if (logoutError) {
      setError('Impossible de vous déconnecter.');
      return;
    }

    setUser(null);
    setHistory([]);
  };

  // ==========================================
  // 4. CHARGEMENT
  // ==========================================

  if (loading) {
    return (
      <div className="page-container account-container">
        <div className="account-card-modern">
          <p>Chargement de votre espace personnel...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // 5. ESPACE PERSONNEL
  // ==========================================

  if (user) {
    const displayName =
      user.user_metadata?.name ||
      user.email?.split('@')[0] ||
      'Utilisateur';

    return (
      <div className="page-container account-container">

        <div
          className="account-card-modern"
          style={{
            maxWidth: '800px',
            width: '100%'
          }}
        >

          <h2
            style={{
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}
          >
            {displayName}
          </h2>

          {/* Nombre de livres lus */}
          <div
            className="account-stats-row"
            style={{
              display: 'flex',
              justifyContent: 'center'
            }}
          >
            <div
              className="account-stat-box"
              style={{
                textAlign: 'center',
                padding: '1rem 2rem'
              }}
            >
              <span
                className="stat-num"
                style={{
                  fontSize: '2rem',
                  display: 'block'
                }}
              >
                —
              </span>

              <span className="stat-lab">
                Livres lus
              </span>
            </div>
          </div>

          {/* Historique */}
          <div
            className="profile-history-section"
            style={{
              marginTop: '2rem',
              textAlign: 'left'
            }}
          >
            <h3
              style={{
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <BookOpen size={20} />
              Mon Historique de Lecture
            </h3>

            <div
              className="empty-history"
              style={{
                padding: '1.5rem',
                textAlign: 'center',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: '8px'
              }}
            >
              <p>
                Le suivi des livres lus sera activé
                après la configuration des historiques
                dans Supabase.
              </p>
            </div>
          </div>

          {error && (
            <div
              className="auth-alert error"
              role="alert"
              style={{ marginTop: '1rem' }}
            >
              {error}
            </div>
          )}

          {/* Actions */}
          <div
            className="account-actions"
            style={{ marginTop: '2rem' }}
          >
            <Link
              to="/catalog"
              className="btn-glow-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <BookOpen size={18} />
              Accéder au catalogue
            </Link>

            <button
              onClick={handleLogout}
              className="btn-logout"
              style={{
                marginTop: '10px',
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <LogOut size={16} />
              Se déconnecter
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // 6. FORMULAIRE DE CONNEXION / INSCRIPTION
  // ==========================================

  return (
    <div className="page-container account-container">

      <div className="account-card-modern">

        <div className="account-header">
          <span className="section-subtitle">
            ESPACE MEMBRE
          </span>

          <h2>
            {isLoginMode ? 'Connexion' : 'Créer un compte'}
          </h2>

          <p>
            {isLoginMode
              ? 'Accédez à votre bibliothèque personnelle.'
              : 'Rejoignez la plateforme Lyre dès maintenant.'}
          </p>
        </div>

        {error && (
          <div className="auth-alert error" role="alert">
            {error}
          </div>
        )}

        {message && (
          <div
            className="auth-alert"
            role="status"
            style={{
              color: '#10b981',
              marginBottom: '1rem'
            }}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="auth-form"
        >

          {/* Nom */}
          {!isLoginMode && (
            <div className="input-group">
              <label htmlFor="account-name">
                Nom complet
              </label>

              <div className="input-field-wrapper">
                <User
                  size={18}
                  className="input-icon"
                />

                <input
                  id="account-name"
                  type="text"
                  placeholder="Votre nom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div className="input-group">
            <label htmlFor="account-email">
              Adresse e-mail
            </label>

            <div className="input-field-wrapper">
              <Mail
                size={18}
                className="input-icon"
              />

              <input
                id="account-email"
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="input-group">
            <label htmlFor="account-password">
              Mot de passe
            </label>

            <div className="input-field-wrapper">
              <Lock
                size={18}
                className="input-icon"
              />

              <input
                id="account-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                autoComplete={
                  isLoginMode
                    ? 'current-password'
                    : 'new-password'
                }
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-glow-primary auth-submit-btn"
            disabled={submitting}
          >
            {submitting
              ? 'Veuillez patienter...'
              : isLoginMode
                ? 'Se connecter'
                : "S'inscrire"}

            {!submitting && <ArrowRight size={16} />}
          </button>

        </form>

        <div className="auth-switch-prompt">
          <p>
            {isLoginMode
              ? 'Pas encore de compte ?'
              : 'Déjà un compte ?'}

            {' '}

            <button
              type="button"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
                setMessage('');
                setPassword('');
              }}
              className="switch-mode-btn"
            >
              {isLoginMode
                ? "S'inscrire"
                : 'Se connecter'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}