'use client';

import React, { useState, useEffect } from 'react';
import { updateProduct } from '@/app/actions/productActions';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  quantity: number;
  images: string[];
  categoryId: string | null;
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [id, setId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    params.then(({ id }) => {
      setId(id);
      Promise.all([
        fetch(`/api/admin/products/${id}`).then(r => r.json()),
        fetch('/api/admin/categories').then(r => r.json()),
      ]).then(([productData, catData]) => {
        setProduct(productData.product);
        setCategories(catData.categories || []);
        setFetching(false);
      }).catch(() => setFetching(false));
    });
  }, [params]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updateProduct(id, formData);

    setLoading(false);

    if (result.success) {
      router.push('/admin/products');
      router.refresh();
    } else {
      alert('Erreur: ' + result.error);
    }
  };

  if (fetching) {
    return <div className="container py-8 text-center"><p>Chargement...</p></div>;
  }

  if (!product) {
    return <div className="container py-8 text-center"><p>Produit introuvable.</p></div>;
  }

  return (
    <div className="container py-8 flex justify-center">
      <div className="card" style={{ padding: '2rem', width: '100%', maxWidth: '600px' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 style={{ color: 'var(--primary-color)' }}>Modifier le Produit</h2>
          <a href="/admin/products" className="btn btn-secondary" style={{ padding: '6px 12px' }}>Retour</a>
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
            {loading ? 'Modification en cours...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  );
}
