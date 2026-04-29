'use client';

import React from 'react';
import { ProductEntity } from '@/core/domain/repositories/ProductRepository';
import { useCart } from '../../context/CartContext';

interface ProductDetailClientProps {
  product: ProductEntity;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
  };

  return (
    <div className="actions mt-8">
      <button className="btn btn-primary w-full" style={{ padding: '16px', fontSize: '1.1rem' }} onClick={handleAddToCart}>
        🛒 Ajouter au Panier
      </button>
    </div>
  );
}
