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
  title: "PixelMarket - Digital Assets & Tech Marketplace",
  description: "Senior-grade professional marketplace for high-quality digital assets, software artifacts, and technology products. Built for the modern pixel era.",
  keywords: ["digital assets", "software", "tech marketplace", "pixels", "developer tools", "e-commerce"],
  openGraph: {
    title: "PixelMarket - Digital Assets & Tech Marketplace",
    description: "Discover high-quality digital assets and professional tech products.",
    type: "website",
  },
  // Set metadataBase to avoid the Next.js warning and prepare the project for deployment.
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
