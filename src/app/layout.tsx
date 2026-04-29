import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Boutique Réservation | Collection Élégance",
  description: "Découvrez notre sélection de produits exclusifs et réservez-les en ligne.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <header className="site-header">
          <div className="container flex justify-between items-center py-4">
            <h1 className="logo">Élégance</h1>
            <nav className="main-nav">
              <a href="/" className="nav-link">Accueil</a>
              <a href="/cart" className="nav-link">Mon Panier</a>
            </nav>
          </div>
        </header>
        
        <main>{children}</main>
        
        <footer className="site-footer">
          <div className="container text-center py-8">
            <p>&copy; {new Date().getFullYear()} Élégance. Tous droits réservés.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
