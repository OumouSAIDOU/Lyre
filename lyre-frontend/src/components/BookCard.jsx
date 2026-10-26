import React from 'react';
import { BookCheck, BookX, Trash2 } from 'lucide-react';

export default function BookCard({ book, onToggleStatus, onDelete }) {
  const isAvailable = book.status === 'available';

  return (
    <div className={`book-card ${!isAvailable ? 'borrowed-card' : ''}`}>
      <div className="cover-wrapper">
        <img 
          src={book.cover_url || 'https://via.placeholder.com/300x400?text=Pas+d+image'} 
          alt={book.title} 
          className="book-cover"
        />
        <span className={`status-tag ${isAvailable ? 'tag-available' : 'tag-borrowed'}`}>
          {isAvailable ? 'Disponible' : 'Emprunté'}
        </span>
      </div>

      <div className="book-info">
        <span className="book-category">{book.category || 'Général'}</span>
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">par {book.author}</p>
        {book.published_year && <span className="book-year">{book.published_year}</span>}

        <p className="book-description">
          {book.description ? book.description.slice(0, 90) + '...' : 'Aucune description disponible.'}
        </p>

        <div className="card-actions">
          <button 
            className={`btn-action ${isAvailable ? 'btn-borrow' : 'btn-return'}`}
            onClick={() => onToggleStatus(book.id, book.status)}
          >
            {isAvailable ? <BookCheck size={16} /> : <BookX size={16} />}
            <span>{isAvailable ? 'Emprunter' : 'Rendre'}</span>
          </button>

          <button className="btn-delete" onClick={() => onDelete(book.id)} title="Supprimer">
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}