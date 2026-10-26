import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Account from './pages/Account';
import Reader from './pages/Reader';
import AddBookModal from './components/AddBookModal';
import AddBook from './pages/AddBook';
import './App.css';

const API_URL = 'http://localhost/Lyre-backend/api.php/books';

export default function App() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('lyre_theme') === 'dark');

  useEffect(() => {
    localStorage.setItem('lyre_theme', darkMode ? 'dark' : 'light');
    if (darkMode) document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }, [darkMode]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (selectedCategory) params.append('category', selectedCategory);

      const response = await fetch(`${API_URL}?${params.toString()}`);
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, selectedCategory]);

  const handleDeleteBook = async (bookId) => {
    if (!window.confirm('Voulez-vous vraiment supprimer ce livre ?')) return;
    try {
      await fetch(`${API_URL}/${bookId}`, { method: 'DELETE' });
      fetchBooks();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home books={books} />} />
            <Route path="/catalog" element={
              <Catalog 
                books={books} 
                search={search} 
                setSearch={setSearch} 
                category={selectedCategory} 
                setCategory={setSelectedCategory} 
                onDelete={handleDeleteBook} 
                onOpenModal={() => setIsModalOpen(true)}
                loading={loading}
              />
            } />
            <Route path="/account" element={<Account API_URL={API_URL} books={books} />} />
            <Route path="/read/:id" element={<Reader API_URL={API_URL} />} />
          <Route path="/add-book" element={<AddBook API_URL={API_URL} />} />
          </Routes>
        </main>

        {isModalOpen && (
          <AddBookModal 
            onClose={() => setIsModalOpen(false)} 
            onBookAdded={fetchBooks}
            apiUrl={API_URL}
          />
        )}
      </div>
    </Router>
  );
}