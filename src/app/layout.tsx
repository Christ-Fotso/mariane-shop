import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./context/CartContext";
import CartIcon from "./components/CartIcon";
import CartDrawer from "./components/CartDrawer";
import AdminDropdown from "./components/AdminDropdown";
import { verifyAdminAuth } from "@/core/infrastructure/auth/verifyAuth";

export const metadata: Metadata = {
  title: "Ladie's Corner | Boutique & Réservation",
  description: "Découvrez la collection exclusive de Ladie's Corner et réservez vos articles préférés en ligne.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const admin = await verifyAdminAuth();

  return (
    <html lang="fr">
      <body>
        <CartProvider>
          <header className="site-header">
            <div className="container flex justify-between items-center py-2">
              <a href="/" className="logo" style={{ textDecoration: 'none' }}>Ladie&apos;s Corner</a>
              <nav className="main-nav" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <a href="/" className="nav-link">Accueil</a>
                <a href="/faq" className="nav-link">FAQ</a>
                <CartIcon />
                {admin && <AdminDropdown />}
              </nav>
            </div>
          </header>

          <main>{children}</main>

          <CartDrawer />

          <footer className="site-footer">
            <div className="container text-center py-8">
              <p>&copy; {new Date().getFullYear()} Ladie&apos;s Corner. Tous droits réservés.</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}

