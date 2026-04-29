'use client';

import React from 'react';
import { useCart } from '../context/CartContext';

export default function CartIcon() {
  const { toggleCart, cart } = useCart();
  
  const itemCount = cart.reduce((total, item) => total + item.cartQuantity, 0);

  return (
    <button className="cart-icon" aria-label="Mon Panier" onClick={toggleCart} style={{ position: 'relative', cursor: 'pointer' }}>
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {itemCount > 0 && (
        <span style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px',
          backgroundColor: 'var(--danger-color)',
          color: 'white',
          borderRadius: '50%',
          width: '18px',
          height: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.7rem',
          fontWeight: 'bold'
        }}>
          {itemCount}
        </span>
      )}
    </button>
  );
}
