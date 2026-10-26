import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddBookModal({ onClose, onBookAdded, apiUrl }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Fiction',
    published_year: new Date().getFullYear(),
    cover_url: '',
    description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onBookAdded();
        onClose();
      } else {
        alert("Erreur lors de l'ajout du livre");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Nouveau livre dans Lyre</h2>
          <button onClick={onClose} className="btn-close"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre *</label>
            <input 
              type="text" 
              required 
              value={formData.title} 
              onChange={(e) => setFormData({...formData, title: e.target.value})} 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Auteur *</label>
              <input 
                type="text" 
                required 
                value={formData.author} 
                onChange={(e) => setFormData({...formData, author: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label>Catégorie</label>
              <select 
                value={formData.category} 
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option value="Fiction">Fiction</option>
                <option value="SFF / Dystopie">SFF / Dystopie</option>
                <option value="Classique">Classique</option>
                <option value="Histoire">Histoire</option>
                <option value="Sciences">Sciences</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>ISBN</label>
              <input 
                type="text" 
                value={formData.isbn} 
                onChange={(e) => setFormData({...formData, isbn: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label>Année de publication</label>
              <input 
                type="number" 
                value={formData.published_year} 
                onChange={(e) => setFormData({...formData, published_year: e.target.value})} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>URL de la couverture (Image)</label>
            <input 
              type="url" 
              placeholder="https://..." 
              value={formData.cover_url} 
              onChange={(e) => setFormData({...formData, cover_url: e.target.value})} 
            />
          </div>

          <div className="form-group">
            <label>Résumé / Description</label>
            <textarea 
              rows="3" 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})} 
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-secondary">Annuler</button>
            <button type="submit" className="btn-primary">Ajouter à la bibliothèque</button>
          </div>
        </form>
      </div>
    </div>
  );
}