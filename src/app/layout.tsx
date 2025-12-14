import type { Metadata } from "next";
import "./globals.css";
import NewHeader from "@/components/NewHeader";
import FooterWrapper from "@/components/FooterWrapper";
import StoreHydration from "@/components/StoreHydration";
import NotificationToast from "@/components/NotificationToast";
import PromoPopup from "@/components/PromoPopup";
import StyleQuizEntryModal from "@/components/StyleQuizEntryModal";
import { QuickViewProvider } from "@/contexts/QuickViewContext";
import QuickViewModal from "@/components/modals/QuickViewModal";
import { CartSidebarProvider } from "@/contexts/CartSidebarContext";
import CartSidebar from "@/components/cart/CartSidebar";
import CartSessionManager from "@/components/CartSessionManager";

export const metadata: Metadata = {
  title: "Ancestral heartbeat - Artesanías Colombianas",
  description: "Tienda virtual especializada en la venta de artesanías colombianas hechas a mano. Sombreros vueltiaos, mochilas wayuu, hamacas y más.",
  keywords: ["artesanías", "colombia", "sombrero vueltiao", "mochila wayuu", "hamaca", "artesanías colombianas"],
  openGraph: {
    title: "Ancestral heartbeat - Artesanías Colombianas",
    description: "Descubre artesanías colombianas auténticas hechas a mano",
    type: "website",
  },
  // Fijamos metadataBase para evitar el warning de Next.js y preparar el proyecto para despliegue.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <CartSidebarProvider>
          <QuickViewProvider>
            <StoreHydration />
            <CartSessionManager />
            <NewHeader />
            <main className="min-h-screen pt-[120px]">
              {children}
            </main>
            <FooterWrapper />
            
            {/* Global Components */}
            <NotificationToast />
            <StyleQuizEntryModal />
            <PromoPopup delay={10000} />
            <QuickViewModal />
            <CartSidebar />
          </QuickViewProvider>
        </CartSidebarProvider>
      </body>
    </html>
  );
}
