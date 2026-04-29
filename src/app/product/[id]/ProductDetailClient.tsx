'use client';

import React from 'react';
import { ProductEntity } from '@/core/domain/repositories/ProductRepository';

interface ProductDetailClientProps {
  product: ProductEntity;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const existingProductIndex = existingCart.findIndex((item: any) => item.id === product.id);
    if (existingProductIndex >= 0) {
      existingCart[existingProductIndex].cartQuantity += 1;
    } else {
      existingCart.push({ ...product, cartQuantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert(`${product.name} a été ajouté à votre panier !`);
  };

  return (
    <div className="actions mt-8">
      <button className="btn btn-primary w-full" style={{ padding: '16px', fontSize: '1.1rem' }} onClick={addToCart}>
        🛒 Ajouter au Panier
      </button>
    </div>
  );
}
