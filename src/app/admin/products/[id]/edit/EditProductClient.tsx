'use client';

import React, { useState } from 'react';
import { updateProduct } from '@/app/actions/productActions';
import { useRouter } from 'next/navigation';

interface Category { id: string; name: string; }
interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  images: string[];
  categoryId: string | null;
}

export default function EditProductClient({
  product,
  categories,
}: {
  product: Product;
  categories: Category[];
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateProduct(product.id, formData);
    setLoading(false);
    if (result.success) {
      router.push('/admin/products');
      router.refresh();
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.')) return;
    try {
      const res = await fetch(`/api/admin/products/${product.id}`, { method: 'DELETE' });
      if (res.ok) {
        router.push('/admin/products');
        router.refresh();
      } else {
        alert('Erreur lors de la suppression.');
      }
    } catch {
      alert('Une erreur est survenue.');
    }
  };

  return (
    <div className="container py-8 flex justify-center">
      <div className="card" style={{ padding: '2rem', width: '100%', maxWidth: '600px' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ color: 'var(--primary-color)' }}>Modifier le Produit</h2>
          <div className="flex gap-4 items-center">
            <button
              onClick={handleDelete}
              title="Supprimer ce produit"
              style={{
                background: 'none',
                border: '1px solid var(--danger-color)',
                color: 'var(--danger-color)',
                borderRadius: 'var(--radius)',
                padding: '6px 10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '0.9rem',
                transition: 'var(--transition)',
              }}
              onMouseOver={e => { (e.currentTarget as HTMLElement).style.background = 'var(--danger-color)'; (e.currentTarget as HTMLElement).style.color = 'white'; }}
              onMouseOut={e => { (e.currentTarget as HTMLElement).style.background = 'none'; (e.currentTarget as HTMLElement).style.color = 'var(--danger-color)'; }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
                <path d="M10 11v6"></path><path d="M14 11v6"></path>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
              </svg>
              Supprimer
            </button>
            <a href="/admin/products" className="btn btn-secondary" style={{ padding: '6px 12px' }}>Retour</a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-2" style={{ display: 'block' }}>Nom du produit *</label>
            <input type="text" name="name" className="input" required defaultValue={product.name} />
          </div>

          <div>
            <label className="mb-2" style={{ display: 'block' }}>Description (Optionnel)</label>
            <textarea name="description" className="input" rows={4} defaultValue={product.description || ''}></textarea>
          </div>

          <div className="flex gap-4">
            <div className="w-full">
              <label className="mb-2" style={{ display: 'block' }}>Prix (FCFA) *</label>
              <input type="number" name="price" className="input" min="0" required defaultValue={product.price} />
            </div>
            <div className="w-full">
              <label className="mb-2" style={{ display: 'block' }}>Quantité *</label>
              <input type="number" name="quantity" className="input" min="0" required defaultValue={product.quantity} />
            </div>
          </div>

          <div>
            <label className="mb-2" style={{ display: 'block' }}>Catégorie</label>
            <select name="categoryId" className="input" defaultValue={product.categoryId || ''}>
              <option value="">Sélectionner une catégorie</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2" style={{ display: 'block' }}>Nouvelles images (laisser vide pour conserver les actuelles)</label>
            {product.images.length > 0 && (
              <div className="flex gap-2 mb-2">
                {product.images.map((img, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={img} alt="Image actuelle" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '2px solid var(--border-color)' }} />
                ))}
              </div>
            )}
            <input type="file" name="images" className="input" multiple accept="image/*" />
            <small className="text-secondary mt-2 block">Sélectionnez de nouvelles images pour remplacer les actuelles (1 à 4).</small>
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px', verticalAlign: 'middle' }}>
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
            {loading ? 'Modification en cours...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}
