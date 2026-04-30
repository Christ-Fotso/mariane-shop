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
                    <a href={`/admin/products/${product.id}/edit`} title="Modifier" style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '32px', height: '32px', borderRadius: 'var(--radius)',
                      border: '1px solid var(--primary-color)', color: 'var(--primary-color)',
                      transition: 'var(--transition)', textDecoration: 'none'
                    }}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                    </a>
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
