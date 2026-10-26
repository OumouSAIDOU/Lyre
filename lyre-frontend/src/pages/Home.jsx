import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, BookOpen, Compass, Zap, Layers, Eye, ShieldCheck, Smartphone } from 'lucide-react';

export default function Home({ books }) {
  const recentBooks = books.slice(0, 3);

  return (
    <div className="page-container">
      {/* Hero Ultra-Moderne & Dynamique */}
      <section className="hero-v2">
        <div className="hero-glow-1"></div>
        <div className="hero-glow-2"></div>
        
        <div className="hero-v2-content">
          <div className="hero-pill animate-pill">
            <span className="pill-badge"><Zap size={14} /> PROCHAINEMENT</span>
            <span>Vivez le livre numérique sans limites</span>
          </div>
          
          <h1 className="animate-headline">
            Votre bibliothèque, <br />
            <span className="gradient-text">réinventée pour le web.</span>
          </h1>
          
          <p className="animate-subtext">
            Oubliez les contraintes. Streamer vos romans et documents préférés instantanément 
            grâce à une liseuse haute performance intégrée.
          </p>
          
          <div className="hero-buttons animate-btns">
            <Link to="/catalog" className="btn-glow-primary">
              <Compass size={18} /> Découvrir la bibliothèque
              <ArrowRight size={16} className="btn-arrow" />
            </Link>
            <Link to="/account" className="btn-glass-secondary">
              <Layers size={18} /> Espace Personnel
            </Link>
          </div>

          <div className="hero-stats animate-stats">
            <div className="stat-item">
              <span className="stat-number">100%</span>
              <span className="stat-label">Fluide & Responsive</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">Zéro</span>
              <span className="stat-label">Installation requise</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">Instantané</span>
              <span className="stat-label">Streaming de lecture</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section des livres en ligne (Streaming) */}
      <section className="home-streaming-section">
        <div className="section-header-modern">
          <div>
            <span className="section-subtitle">IMMERSION INSTANTANÉE</span>
            <h2>Prêt à lire dès maintenant</h2>
          </div>
          <Link to="/catalog" className="see-more-btn">
            Explorer tout le catalogue <ArrowRight size={16} />
          </Link>
        </div>

        {books.length === 0 ? (
          <div className="empty-streaming-state">
            <BookOpen size={48} className="empty-icon-pulse" />
            <p>Aucun ouvrage numérique en ligne pour l'instant.</p>
            <Link to="/catalog" className="btn-primary" style={{ marginTop: '1rem' }}>
              Ajouter ou importer un livre
            </Link>
          </div>
        ) : (
          <div className="streaming-books-grid">
            {recentBooks.map((book) => (
              <div key={book.id} className="streaming-book-card">
                <div className="streaming-cover-wrapper">
                  <img 
                    src={book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80'} 
                    alt={book.title} 
                  />
                  <div className="streaming-overlay-badge">
                    <Sparkles size={12} /> Prêt à streamer
                  </div>
                </div>

                <div className="streaming-book-content">
                  <span className="streaming-category">{book.category || 'Roman / Document'}</span>
                  <h3>{book.title}</h3>
                  <p className="streaming-author">Par {book.author}</p>
                  
                  <div className="streaming-actions">
                    <Link to={`/read/${book.id}`} className="btn-stream-read">
                      <BookOpen size={16} /> Lancer la lecture
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Nouvelle section : Pourquoi choisir Lyre ? */}
      <section className="features-section">
        <div className="section-header-modern" style={{ textAlign: 'center', marginBottom: '3rem', display: 'block' }}>
          <span className="section-subtitle">EXPÉRIENCE SUR-MESURE</span>
          <h2>Conçu pour le confort des lecteurs</h2>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon"><Eye size={24} /></div>
            <h3>Confort Visuel</h3>
            <p>Un mode sombre apaisant et des polices optimisées pour réduire la fatigue oculaire lors de longues sessions.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Zap size={24} /></div>
            <h3>Streaming Instantané</h3>
            <p>Accédez à vos livres en un clic sans aucun temps de téléchargement ni configuration lourde.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Smartphone size={24} /></div>
            <h3>Multi-supports</h3>
            <p>Profitez d'une interface responsive qui s'adapte parfaitement à votre PC, tablette ou smartphone.</p>
          </div>
        </div>
      </section>

      {/* Footer Minimaliste */}
      <footer className="site-footer">
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Lyre Platform. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}