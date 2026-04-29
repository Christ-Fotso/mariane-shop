import { PrismaProductRepository } from '@/core/infrastructure/repositories/PrismaProductRepository';
import { notFound } from 'next/navigation';
import React from 'react';
import ProductDetailClient from './ProductDetailClient';

export const dynamic = 'force-dynamic';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const repository = new PrismaProductRepository();
  const product = await repository.findById(params.id);

  if (!product) {
    notFound();
  }

  const imageSrc = product.images.length > 0 ? product.images[0] : '/placeholder.jpg';

  return (
    <div className="container py-8">
      <div className="product-details-layout">
        <div className="product-details-image">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={product.name} />
        </div>
        <div className="product-details-info">
          <h1>{product.name}</h1>
          <p className="price">{product.price.toLocaleString('fr-FR')} FCFA</p>
          <div className="description">
            <h3>Description</h3>
            <p>{product.description || "Aucune description disponible pour ce produit."}</p>
          </div>
          
          <ProductDetailClient product={product} />
        </div>
      </div>
    </div>
  );
}
