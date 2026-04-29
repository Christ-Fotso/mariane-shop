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
            <nav className="main-nav" style={{ display: 'flex', alignItems: 'center' }}>
              <a href="/" className="nav-link">Accueil</a>
              <a href="/faq" className="nav-link">FAQ</a>
              <a href="/cart" className="cart-icon" aria-label="Mon Panier">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
              </a>
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
