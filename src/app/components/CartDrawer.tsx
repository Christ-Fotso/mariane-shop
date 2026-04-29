'use client';

import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, clearCart } = useCart();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    customer_name: '',
    phone_number: '',
    city: '',
    pickup_time: '',
  });

  const total = cart.reduce((acc, item) => acc + item.price * item.cartQuantity, 0);

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
          items: cart,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        clearCart();
      } else {
        const errorData = await res.json();
        alert('Erreur: ' + errorData.error);
      }
    } catch {
      alert('Une erreur est survenue lors de la réservation.');
    } finally {
      setLoading(false);
    }
  };

  const resetDrawer = () => {
    closeCart();
    // Allow animation to finish before resetting success state
    setTimeout(() => {
      setSuccess(false);
      setFormData({ customer_name: '', phone_number: '', city: '', pickup_time: '' });
    }, 300);
  };

  return (
    <>
      <div className={`cart-overlay ${isCartOpen ? 'open' : ''}`} onClick={resetDrawer}></div>
      <div className={`cart-drawer ${isCartOpen ? 'open' : ''}`}>
        <div className="cart-drawer-header">
          <h2>Mon Panier</h2>
          <button className="cart-close-btn" onClick={resetDrawer}>✕</button>
        </div>

        <div className="cart-drawer-content">
          {success ? (
            <div className="text-center py-8">
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem', fontSize: '1.5rem' }}>
                Réservation Confirmée !
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Merci pour votre réservation. Ladie&apos;s Corner vous contactera très bientôt.
              </p>
              <button className="btn btn-primary w-full" onClick={resetDrawer}>
                Continuer mes achats
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-secondary mb-4">Votre panier est vide.</p>
              <button className="btn btn-primary w-full" onClick={resetDrawer}>
                Découvrir la collection
              </button>
            </div>
          ) : (
            <>
              <div className="cart-items-container">
                {cart.map((item, index) => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>{item.price.toLocaleString('fr-FR')} FCFA</p>
                    </div>
                    <div className="cart-item-actions flex items-center gap-4">
                      <button className="btn btn-secondary" style={{ padding: '2px 8px' }} onClick={() => updateQuantity(index, item.cartQuantity - 1)}>−</button>
                      <span>{item.cartQuantity}</span>
                      <button className="btn btn-secondary" style={{ padding: '2px 8px' }} onClick={() => updateQuantity(index, item.cartQuantity + 1)}>+</button>
                    </div>
                  </div>
                ))}
                <div className="cart-total text-right mt-4" style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>
                  Total : {total.toLocaleString('fr-FR')} FCFA
                </div>
              </div>

              <div className="cart-reservation-form mt-8 pt-8" style={{ borderTop: '1px solid var(--border-color)' }}>
                <h3 className="mb-4">Détails de Réservation</h3>
                <form onSubmit={handleReserve} className="flex flex-col gap-4">
                  <div>
                    <label className="mb-2" style={{ display: 'block', fontWeight: 500, fontSize: '0.9rem' }}>Nom ou Pseudonyme *</label>
                    <input required type="text" className="input" placeholder="Ex : Marie D." value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-2" style={{ display: 'block', fontWeight: 500, fontSize: '0.9rem' }}>Numéro de Téléphone *</label>
                    <input required type="tel" className="input" placeholder="Ex : +237 6XX XXX XXX" value={formData.phone_number} onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-2" style={{ display: 'block', fontWeight: 500, fontSize: '0.9rem' }}>Ville *</label>
                    <input required type="text" className="input" placeholder="Ex : Douala, Yaoundé…" value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                  <div>
                    <label className="mb-2" style={{ display: 'block', fontWeight: 500, fontSize: '0.9rem' }}>Heure de passage souhaitée</label>
                    <input type="datetime-local" className="input" value={formData.pickup_time} onChange={(e) => setFormData({ ...formData, pickup_time: e.target.value })} />
                  </div>
                  <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
                    {loading ? 'Réservation en cours…' : '🛍️ Réserver mon panier'}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
