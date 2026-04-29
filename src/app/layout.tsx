import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ladie's Corner | Boutique & Réservation",
  description: "Découvrez la collection exclusive de Ladie's Corner et réservez vos articles préférés en ligne.",
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
            <a href="/" className="logo" style={{ textDecoration: 'none' }}>Ladie&apos;s Corner</a>
            <nav className="main-nav">
              <a href="/" className="nav-link">Accueil</a>
              <a href="/cart" className="nav-link">Mon Panier</a>
              <a href="/faq" className="nav-link">FAQ</a>
            </nav>
          </div>
        </header>
        
        <main>{children}</main>
        
        <footer className="site-footer">
          <div className="container text-center py-8">
            <p>&copy; {new Date().getFullYear()} Ladie&apos;s Corner. Tous droits réservés.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
