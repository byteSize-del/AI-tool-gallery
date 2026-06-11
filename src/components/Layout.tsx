import type { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

/**
 * Shared shell with the navbar on top and the "Made by Hypercode"
 * footer at the bottom of every inner page.
 */
export default function Layout({ children }: LayoutProps) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-wrap">{children}</main>
      <Footer />
    </div>
  );
}
