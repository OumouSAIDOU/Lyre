import React from 'react';

export default function FilterBar({ category, setCategory, status, setStatus }) {
  return (
    <div className="filter-bar">
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option value="">Toutes les catégories</option>
        <option value="Fiction">Fiction</option>
        <option value="SFF / Dystopie">SFF / Dystopie</option>
        <option value="Classique">Classique</option>
        <option value="Histoire">Histoire</option>
        <option value="Sciences">Sciences</option>
      </select>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="">Tous les statuts</option>
        <option value="available">Disponibles</option>
        <option value="borrowed">Empruntés</option>
      </select>
    </div>
  );
}