import React from 'react';

export const metadata = {
  title: "FAQ | Ladie's Corner",
  description: "Foire aux questions sur la réservation et nos produits.",
};

export default function FAQPage() {
  return (
    <div className="container py-8">
      <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', color: 'var(--primary-color)' }}>
        Foire Aux Questions
      </h2>

      <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Comment fonctionne la réservation ?</h3>
          <p className="text-secondary">
            Vous pouvez ajouter les articles de votre choix à votre panier et valider la réservation en renseignant 
            votre nom, numéro de téléphone et ville. Aucun paiement n'est requis sur le site. Nous vous contacterons 
            ensuite pour organiser la livraison ou le retrait.
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Où êtes-vous situés ?</h3>
          <p className="text-secondary">
            Ladie&apos;s Corner opère principalement au Cameroun. Nous convenons du lieu de retrait ou de livraison 
            directement avec vous après votre réservation.
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Quels sont les délais de livraison ?</h3>
          <p className="text-secondary">
            Les délais varient en fonction de votre ville et de la disponibilité des articles. Généralement, 
            les retraits ou livraisons peuvent se faire dans un délai de 24h à 48h après confirmation de votre commande.
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Les produits sont-ils authentiques ?</h3>
          <p className="text-secondary">
            Absolument. Nous mettons un point d'honneur à ne proposer que des articles de qualité, soigneusement 
            sélectionnés pour nos clientes.
          </p>
        </div>

        <div className="card" style={{ padding: '1.5rem' }}>
          <h3 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem' }}>Puis-je annuler ma réservation ?</h3>
          <p className="text-secondary">
            Oui, si vous changez d'avis, veuillez nous contacter le plus rapidement possible au numéro 
            qui vous appellera pour confirmer, afin que nous puissions remettre l'article à disposition 
            pour d'autres clientes.
          </p>
        </div>

      </div>
      
      <div className="text-center mt-8">
        <a href="/" className="btn btn-primary">Retour à la boutique</a>
      </div>
    </div>
  );
}
