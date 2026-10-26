import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Trash2 } from 'lucide-react';

export default function BookGrid({ books, onDelete }) {
  if (!books || books.length === 0) {
    return <div className="empty-state">Aucun livre trouvé dans le catalogue.</div>;
  }

  return (
    <div className="book-grid">
      {books.map((book) => (
        <div key={book.id} className="book-card">
          <div className="cover-wrapper">
            <img 
              src={book.cover_url || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=400&q=80'} 
              alt={book.title} 
              className="book-cover"
            />
            <span className="status-tag tag-category">{book.category || 'Roman'}</span>
          </div>

          <div className="book-info">
            <h3 className="book-title">{book.title}</h3>
            <p className="book-author">Par {book.author}</p>
            <p className="book-description">
              {book.description ? book.description.substring(0, 85) + '...' : 'Aucune description disponible.'}
            </p>

            <div className="card-actions">
              <Link to={`/read/${book.id}`} className="btn-primary btn-read">
                <BookOpen size={16} /> Lire
              </Link>
              <button 
                className="btn-delete" 
                onClick={() => onDelete(book.id)}
                title="Supprimer ce livre"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}