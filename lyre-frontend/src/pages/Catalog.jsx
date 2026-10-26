import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, Sparkles } from 'lucide-react';

export default function Catalog({ books = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // Sécurité si books n'est pas un tableau
  const bookList = Array.isArray(books) ? books : [];

  // Extraire les catégories uniques
  const categories = ['Tous', ...new Set(bookList.map(b => b.category || 'Général'))];

  // Filtrer les livres
  const filteredBooks = bookList.filter(book => {
    const title = book.title || '';
    const author = book.author || '';
    const category = book.category || 'Général';

    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Tous' || category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    // ... reste du code inchangé
    <div className="page-container">
      {/* En-tête de la page Catalogue */}
      <div className="catalog-hero">
        <span className="section-subtitle">EXPLORATION</span>
        <h1>Catalogue des ouvrages</h1>
        <p>Retrouvez l'ensemble de votre bibliothèque numérique prête à être lue en streaming instantané.</p>
        
        {/* Barre de recherche et filtres */}
        <div className="catalog-toolbar">
          <div className="search-bar-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Rechercher par titre ou auteur..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="categories-filter">
            {categories.map((cat, index) => (
              <button
                key={index}
                className={`filter-chip ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grille des livres (même style que la page d'accueil) */}
      {filteredBooks.length === 0 ? (
        <div className="empty-streaming-state">
          <BookOpen size={48} className="empty-icon-pulse" />
          <p>Aucun livre ne correspond à votre recherche.</p>
        </div>
      ) : (
        <div className="streaming-books-grid">
          {filteredBooks.map((book) => (
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
      {/* Footer Minimaliste */}
      <footer className="site-footer">
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Lyre Platform. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}
   

