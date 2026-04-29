'use client';

import React from 'react';
import Link from 'next/link';
import { ProductEntity } from '@/core/domain/repositories/ProductRepository';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: ProductEntity;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const imageSrc = product.images.length > 0 ? product.images[0] : '/placeholder.jpg';

  return (
    <Link href={`/product/${product.id}`} className="product-card-link">
      <div className="card product-card-container">
        <div className="product-image-wrapper">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageSrc} alt={product.name} className="product-image" />
          
          <button className="hover-cart-btn" onClick={handleAddToCart} aria-label="Ajouter au panier" title="Ajouter au panier">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              <line x1="12" y1="11" x2="18" y2="11"></line>
              <line x1="15" y1="8" x2="15" y2="14"></line>
            </svg>
          </button>
        </div>

        <div className="product-info">
          <h3 className="product-title">{product.name}</h3>
          <p className="product-price">{product.price.toLocaleString('fr-FR')} FCFA</p>
          {product.description && <p className="product-desc">{product.description.substring(0, 60)}...</p>}
        </div>
      </div>
    </Link>
  );
}
