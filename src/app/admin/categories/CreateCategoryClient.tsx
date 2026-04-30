'use client';

import React, { useState } from 'react';

export default function CreateCategoryClient() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });

      if (res.ok) {
        setName('');
        // Refresh the page to show the new category
        window.location.reload();
      } else {
        const data = await res.json();
        alert('Erreur : ' + data.error);
      }
    } catch (err) {
      alert('Une erreur est survenue lors de la création de la catégorie.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4 items-center" style={{ maxWidth: '400px' }}>
      <input
        type="text"
        className="input"
        placeholder="Nom de la nouvelle catégorie"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        style={{ flexGrow: 1 }}
      />
      <button type="submit" className="btn btn-primary" disabled={loading || !name.trim()}>
        {loading ? 'Création...' : 'Créer'}
      </button>
    </form>
  );
}
