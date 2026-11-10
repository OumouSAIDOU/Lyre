import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookPlus, ArrowLeft } from 'lucide-react';
import { supabase } from '../supabaseClient';

export default function AddBook() {
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
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setMessage('');

    try {
      // Vérifier que l'utilisateur est connecté
      const {
        data: { user },
        error: authError
      } = await supabase.auth.getUser();

      if (authError || !user) {
        setMessage(
          'Vous devez être connecté pour ajouter un livre.'
        );
        return;
      }

      // Envoyer le livre à Supabase
      // Les règles RLS doivent réserver cet accès aux administrateurs.
      const { data, error } = await supabase
        .from('books')
        .insert([
          {
            title: formData.title.trim(),
            author: formData.author.trim(),
            category: formData.category.trim() || null,
            cover_url: formData.cover_url.trim() || null,
            description: formData.description.trim() || null,
            content: formData.content.trim()
          }
        ])
        .select('id')
        .single();

      if (error) {
        throw error;
      }

      if (data?.id) {
        setMessage('🎉 Livre ajouté avec succès !');

        setTimeout(() => {
          navigate('/catalog');
        }, 1500);
      }

    } catch (err) {
      console.error('Erreur ajout livre :', err);

      setMessage(
        "Impossible d'ajouter le livre. Vérifiez vos autorisations."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="page-container"
      style={{
        maxWidth: '700px',
        margin: '0 auto',
        padding: '2rem 1rem'
      }}
    >
      <button
        onClick={() => navigate('/catalog')}
        className="btn-back"
        style={{
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        <ArrowLeft size={18} />
        Retour au catalogue
      </button>

      <div
        className="account-card-modern"
        style={{ textAlign: 'left' }}
      >
        <h2>
          <BookPlus
            size={22}
            style={{
              verticalAlign: 'middle',
              marginRight: '8px'
            }}
          />
          Ajouter un vrai livre
        </h2>

        <p
          style={{
            opacity: 0.8,
            marginBottom: '1.5rem'
          }}
        >
          Remplis les informations et colle le texte intégral de l'œuvre.
        </p>

        {message && (
          <div
            className="auth-alert"
            role="status"
            style={{
              marginBottom: '1rem',
              padding: '10px',
              borderRadius: '6px',
              background: 'rgba(16, 185, 129, 0.2)',
              color: '#10b981'
            }}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'grid',
            gap: '1rem'
          }}
        >
          <div>
            <label
              htmlFor="book-title"
              style={{
                display: 'block',
                marginBottom: '4px'
              }}
            >
              Titre du livre *
            </label>

            <input
              id="book-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #333',
                background: '#111',
                color: '#fff'
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}
          >
            <div>
              <label
                htmlFor="book-author"
                style={{
                  display: 'block',
                  marginBottom: '4px'
                }}
              >
                Auteur *
              </label>

              <input
                id="book-author"
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #333',
                  background: '#111',
                  color: '#fff'
                }}
              />
            </div>

            <div>
              <label
                htmlFor="book-category"
                style={{
                  display: 'block',
                  marginBottom: '4px'
                }}
              >
                Catégorie
              </label>

              <input
                id="book-category"
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #333',
                  background: '#111',
                  color: '#fff'
                }}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="book-cover"
              style={{
                display: 'block',
                marginBottom: '4px'
              }}
            >
              URL de l'image de couverture
            </label>

            <input
              id="book-cover"
              type="url"
              name="cover_url"
              placeholder="https://..."
              value={formData.cover_url}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #333',
                background: '#111',
                color: '#fff'
              }}
            />
          </div>

          <div>
            <label
              htmlFor="book-description"
              style={{
                display: 'block',
                marginBottom: '4px'
              }}
            >
              Résumé / Description
            </label>

            <textarea
              id="book-description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #333',
                background: '#111',
                color: '#fff'
              }}
            />
          </div>

          <div>
            <label
              htmlFor="book-content"
              style={{
                display: 'block',
                marginBottom: '4px'
              }}
            >
              Texte intégral du livre *
            </label>

            <textarea
              id="book-content"
              name="content"
              rows="12"
              placeholder="Colle ici le texte du livre..."
              value={formData.content}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #333',
                background: '#111',
                color: '#fff',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <button
            type="submit"
            className="btn-glow-primary"
            disabled={loading}
            style={{
              padding: '12px',
              marginTop: '1rem',
              cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {loading
              ? 'Enregistrement...'
              : 'Enregistrer le livre'}
          </button>
        </form>
      </div>
    </div>
  );
}