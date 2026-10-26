import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookPlus, ArrowLeft } from 'lucide-react';

export default function AddBook({ API_URL }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: 'Roman',
    cover_url: '',
    description: '',
    content: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    fetch(`${API_URL}/api.php?action=books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        setLoading(false);
        if (data.id) {
          setMessage('🎉 Livre ajouté avec succès !');
          setTimeout(() => navigate('/catalog'), 1500);
        } else {
          setMessage('Erreur lors de l\'ajout du livre.');
        }
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
        setMessage('Erreur de connexion avec le serveur.');
      });
  };

  return (
    <div className="page-container" style={{ maxWidth: '700px', margin: '0 auto', padding: '2rem 1rem' }}>
      <button onClick={() => navigate('/catalog')} className="btn-back" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <ArrowLeft size={18} /> Retour au catalogue
      </button>

      <div className="account-card-modern" style={{ textAlign: 'left' }}>
        <h2><BookPlus size={22} style={{ verticalAlign: 'middle', marginRight: '8px' }} /> Ajouter un vrai livre</h2>
        <p style={{ opacity: 0.8, marginBottom: '1.5rem' }}>Remplis les informations et colle le texte intégral de l'œuvre.</p>

        {message && (
          <div className="auth-alert" style={{ marginBottom: '1rem', padding: '10px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Titre du livre *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: '#fff' }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Auteur *</label>
              <input type="text" name="author" value={formData.author} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: '#fff' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px' }}>Catégorie</label>
              <input type="text" name="category" value={formData.category} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: '#fff' }} />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>URL de l'image de couverture</label>
            <input type="url" name="cover_url" placeholder="https://..." value={formData.cover_url} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: '#fff' }} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Résumé / Description</label>
            <textarea name="description" rows="3" value={formData.description} onChange={handleChange} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: '#fff' }}></textarea>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px' }}>Texte intégral du livre *</label>
            <textarea name="content" rows="12" placeholder="Colle ici le texte du livre..." value={formData.content} onChange={handleChange} required style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #333', background: '#111', color: '#fff', fontFamily: 'monospace' }}></textarea>
          </div>

          <button type="submit" className="btn-glow-primary" disabled={loading} style={{ padding: '12px', marginTop: '1rem', cursor: 'pointer' }}>
            {loading ? 'Enregistrement...' : 'Enregistrer le livre'}
          </button>
        </form>
      </div>
    </div>
  );
}