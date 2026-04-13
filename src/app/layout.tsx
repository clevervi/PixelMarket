import type { Metadata } from "next";
import { Orbitron, Space_Grotesk } from "next/font/google";
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

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PixelMarket Nexus | Digital Asset Infrastructure",
  description: "Senior-grade professional marketplace for high-performance digital assets, engineering resources, and architectural templates.",
  keywords: ["digital assets", "software", "tech marketplace", "pixels", "developer tools", "e-commerce"],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${orbitron.variable} ${spaceGrotesk.variable} antialiased selection:bg-cyan-500/30 overflow-x-hidden mesh-gradient`}>
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
