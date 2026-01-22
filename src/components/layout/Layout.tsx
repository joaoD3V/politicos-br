import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileNav } from "./MobileNav";

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter = false }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      {!hideFooter && <Footer />}
      <MobileNav />
    </div>
  );
}
