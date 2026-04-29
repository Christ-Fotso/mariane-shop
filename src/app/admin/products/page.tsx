import { prisma } from '@/core/infrastructure/db/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminProducts() {
  const products = await prisma.product.findMany({
    orderBy: { created_at: 'desc' },
    include: { category: true, brand: true }
  });

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 style={{ color: 'var(--primary-color)' }}>Gestion du Catalogue</h2>
        <div>
          <a href="/admin" className="btn btn-secondary" style={{ marginRight: '1rem' }}>Retour</a>
          <a href="/admin/products/new" className="btn btn-primary">Ajouter un Produit</a>
        </div>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        {products.length === 0 ? (
          <p className="text-secondary">Aucun produit dans le catalogue.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '12px' }}>Image</th>
                <th style={{ padding: '12px' }}>Nom</th>
                <th style={{ padding: '12px' }}>Prix</th>
                <th style={{ padding: '12px' }}>Quantité</th>
                <th style={{ padding: '12px' }}>Catégorie</th>
                <th style={{ padding: '12px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={product.images[0] || '/placeholder.jpg'} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ padding: '12px', fontWeight: 500 }}>{product.name}</td>
                  <td style={{ padding: '12px' }}>{product.price.toLocaleString('fr-FR')} FCFA</td>
                  <td style={{ padding: '12px' }}>{product.quantity}</td>
                  <td style={{ padding: '12px' }}>{product.category?.name || '-'}</td>
                  <td style={{ padding: '12px' }}>
                    <a href={`/admin/products/${product.id}/edit`} className="btn btn-secondary" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>Modifier</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
