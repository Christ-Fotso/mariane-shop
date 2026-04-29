'use client';

import React, { useEffect, useState } from 'react';
import { ProductEntity } from '@/core/domain/repositories/ProductRepository';

interface CartItem extends ProductEntity {
  cartQuantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    pickup_time: '',
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (index: number, newQuantity: number) => {
    const newCart = [...cart];
    if (newQuantity <= 0) {
      newCart.splice(index, 1);
    } else {
      newCart[index].cartQuantity = newQuantity;
    }
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return alert('Votre panier est vide');
    
    setLoading(true);
    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          items: cart
        })
      });

      if (res.ok) {
        setSuccess(true);
        setCart([]);
        localStorage.removeItem('cart');
      } else {
        const errorData = await res.json();
        alert('Erreur: ' + errorData.error);
      }
    } catch (error) {
      alert('Une erreur est survenue lors de la réservation.');
    } finally {
      setLoading(false);
    }
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.cartQuantity), 0);

  if (success) {
    return (
      <div className="container py-8 text-center">
        <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Réservation Confirmée !</h2>
        <p>Merci pour votre réservation. Nous vous contacterons très bientôt.</p>
        <a href="/" className="btn btn-primary mt-8">Retour à l'accueil</a>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Mon Panier</h2>
      
      {cart.length === 0 ? (
        <div className="text-center">
          <p className="text-secondary">Votre panier est vide.</p>
          <a href="/" className="btn btn-primary mt-4">Découvrir nos produits</a>
        </div>
      ) : (
        <div className="flex" style={{ flexWrap: 'wrap', gap: '2rem' }}>
          {/* Cart Items */}
          <div className="card" style={{ flex: '1 1 500px', padding: '2rem' }}>
            <h3 className="mb-4">Vos Articles</h3>
            {cart.map((item, index) => (
              <div key={item.id} className="flex justify-between items-center mb-4 pb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <h4 style={{ fontWeight: 600 }}>{item.name}</h4>
                  <p className="text-secondary">{item.price.toLocaleString('fr-FR')} FCFA</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="btn btn-secondary" style={{ padding: '4px 12px' }} onClick={() => updateQuantity(index, item.cartQuantity - 1)}>-</button>
                  <span>{item.cartQuantity}</span>
                  <button className="btn btn-secondary" style={{ padding: '4px 12px' }} onClick={() => updateQuantity(index, item.cartQuantity + 1)}>+</button>
                </div>
              </div>
            ))}
            <div className="text-right mt-4" style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
              Total: {total.toLocaleString('fr-FR')} FCFA
            </div>
          </div>

          {/* Reservation Form */}
          <div className="card" style={{ flex: '1 1 300px', padding: '2rem' }}>
            <h3 className="mb-4">Détails de Réservation</h3>
            <form onSubmit={handleReserve} className="flex flex-col gap-4">
              <div>
                <label className="mb-2" style={{ display: 'block' }}>Nom ou Pseudonyme *</label>
                <input 
                  required
                  type="text" 
                  className="input" 
                  value={formData.customer_name} 
                  onChange={(e) => setFormData({...formData, customer_name: e.target.value})} 
                />
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block' }}>Numéro de Téléphone *</label>
                <input 
                  required
                  type="tel" 
                  className="input" 
                  value={formData.phone_number} 
                  onChange={(e) => setFormData({...formData, phone_number: e.target.value})} 
                />
              </div>
              <div>
                <label className="mb-2" style={{ display: 'block' }}>Heure de passage (optionnel)</label>
                <input 
                  type="datetime-local" 
                  className="input" 
                  value={formData.pickup_time} 
                  onChange={(e) => setFormData({...formData, pickup_time: e.target.value})} 
                />
              </div>
              <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
                {loading ? 'Réservation en cours...' : 'Réserver mon panier'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
