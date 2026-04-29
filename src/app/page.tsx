import { PrismaProductRepository } from '@/core/infrastructure/repositories/PrismaProductRepository';
import { GetProductsUseCase } from '@/core/application/use-cases/GetProductsUseCase';
import ProductCard from './components/ProductCard';

// Force dynamic rendering since we want to see new products as soon as they are added by admin
export const dynamic = 'force-dynamic';

export default async function Home() {
  const repository = new PrismaProductRepository();
  const useCase = new GetProductsUseCase(repository);
  const products = await useCase.execute();

  return (
    <div className="container py-8">
      <div className="text-center mb-8">
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
          La Collection Ladie&apos;s Corner
        </h2>
        <p className="text-secondary" style={{ maxWidth: '600px', margin: '0 auto' }}>
          Découvrez notre sélection exclusive de produits et accessoires.
          Réservez vos articles préférés en quelques clics.
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-secondary">Aucun produit disponible pour le moment.</p>
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
