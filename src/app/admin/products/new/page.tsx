'use client';

import React, { useState, useEffect } from 'react';
import { createProduct } from '@/app/actions/productActions';
import { useRouter } from 'next/navigation';

export default function NewProduct() {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const router = useRouter();

  // Ideally fetch categories from an API
  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await createProduct(formData);
    
    setLoading(false);
    
    if (result.success) {
      router.push('/admin/products');
      router.refresh();
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  return (
    <div className="container py-8 flex justify-center">
      <div className="card" style={{ padding: '2rem', width: '100%', maxWidth: '600px' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ color: 'var(--primary-color)' }}>Ajouter un Produit</h2>
          <a href="/admin/products" className="btn btn-secondary" style={{ padding: '6px 12px' }}>Retour</a>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-2" style={{ display: 'block' }}>Nom du produit *</label>
            <input type="text" name="name" className="input" required />
          </div>
          
          <div>
            <label className="mb-2" style={{ display: 'block' }}>Description (Optionnel)</label>
            <textarea name="description" className="input" rows={4}></textarea>
          </div>
          
          <div className="flex gap-4">
            <div className="w-full">
              <label className="mb-2" style={{ display: 'block' }}>Prix (FCFA) *</label>
              <input type="number" name="price" className="input" min="0" required />
            </div>
            <div className="w-full">
              <label className="mb-2" style={{ display: 'block' }}>Quantité *</label>
              <input type="number" name="quantity" className="input" min="0" defaultValue="1" required />
            </div>
          </div>

          <div>
            <label className="mb-2" style={{ display: 'block' }}>Catégorie</label>
            <select name="categoryId" className="input">
              <option value="">Sélectionner une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2" style={{ display: 'block' }}>Images (1 à 4) *</label>
            <input type="file" name="images" className="input" multiple accept="image/*" required />
            <small className="text-secondary mt-2 block">Sélectionnez plusieurs images avec Ctrl/Cmd.</small>
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
            {loading ? 'Création en cours...' : 'Ajouter le produit'}
          </button>
        </form>
      </div>
    </div>
  );
}
