import { prisma } from '@/core/infrastructure/db/prisma';
import CreateCategoryClient from './CreateCategoryClient';

export const dynamic = 'force-dynamic';

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { products: true }
      }
    }
  });

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 style={{ color: 'var(--primary-color)' }}>Gestion des Catégories</h2>
        <div>
          <a href="/admin" className="btn btn-secondary" style={{ marginRight: '1rem' }}>Retour</a>
          <a href="/admin/products" className="btn btn-primary">Gérer le Catalogue</a>
        </div>
      </div>

      <div className="card mb-8" style={{ padding: '2rem' }}>
        <h3 className="mb-4">Ajouter une Catégorie</h3>
        <CreateCategoryClient />
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 className="mb-4">Catégories Existantes</h3>
        {categories.length === 0 ? (
          <p className="text-secondary">Aucune catégorie pour le moment.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '12px' }}>Nom</th>
                <th style={{ padding: '12px' }}>Date de création</th>
                <th style={{ padding: '12px' }}>Nombre de produits</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(category => (
                <tr key={category.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '12px', fontWeight: 500 }}>{category.name}</td>
                  <td style={{ padding: '12px' }}>{new Date(category.created_at).toLocaleDateString('fr-FR')}</td>
                  <td style={{ padding: '12px' }}>{category._count.products}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
