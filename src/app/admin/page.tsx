import { prisma } from '@/core/infrastructure/db/prisma';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
  const reservations = await prisma.reservation.findMany({
    orderBy: { created_at: 'desc' },
    include: {
      items: {
        include: { product: true }
      }
    }
  });

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h2 style={{ color: 'var(--primary-color)' }}>Tableau de Bord</h2>
        <a href="/admin/products" className="btn btn-primary">Gérer le Catalogue</a>
      </div>

      <div className="card" style={{ padding: '2rem' }}>
        <h3 className="mb-4">Réservations Récentes</h3>
        {reservations.length === 0 ? (
          <p className="text-secondary">Aucune réservation pour le moment.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {reservations.map(res => (
              <div key={res.id} style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: 'var(--radius)' }}>
                <div className="flex justify-between items-center mb-2">
                  <h4 style={{ fontWeight: 'bold' }}>{res.customer_name} - {res.phone_number}</h4>
                  <span style={{ 
                    padding: '4px 8px', 
                    backgroundColor: res.status === 'PENDING' ? '#f39c12' : '#2ecc71',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '0.85rem'
                  }}>
                    {res.status}
                  </span>
                </div>
                <p className="text-secondary mb-2">
                  Heure de passage: {res.pickup_time ? new Date(res.pickup_time).toLocaleString('fr-FR') : 'Non spécifiée'}
                </p>
                <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '4px' }}>
                  <p style={{ fontWeight: 600, marginBottom: '8px' }}>Articles commandés:</p>
                  <ul style={{ paddingLeft: '20px' }}>
                    {res.items.map(item => (
                      <li key={item.id}>
                        {item.quantity}x {item.product.name} ({item.product.price.toLocaleString('fr-FR')} FCFA)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
