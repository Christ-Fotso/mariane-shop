'use client';

import React from 'react';
import { ProductEntity } from '@/core/domain/repositories/ProductRepository';

interface ProductCardProps {
  product: ProductEntity;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
    const existingProductIndex = existingCart.findIndex((item: any) => item.id === product.id);
    if (existingProductIndex >= 0) {
      existingCart[existingProductIndex].cartQuantity += 1;
    } else {
      existingCart.push({ ...product, cartQuantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(existingCart));
    alert(`${product.name} a été ajouté à votre panier !`);
  };

  const imageSrc = product.images.length > 0 ? product.images[0] : '/placeholder.jpg';

  return (
    <div className="card">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageSrc} alt={product.name} className="product-image" />
      <div className="product-info flex flex-col justify-between" style={{ height: 'calc(100% - 250px)' }}>
        <div>
          <h3 className="product-title">{product.name}</h3>
          <p className="product-price">{product.price.toLocaleString('fr-FR')} FCFA</p>
          {product.description && <p className="mb-4 text-secondary">{product.description.substring(0, 60)}...</p>}
        </div>
        <button className="btn btn-primary w-full mt-4" onClick={addToCart}>
          Ajouter au Panier
        </button>
      </div>
    </div>
  );
}
