import type { Metadata } from "next";

import { ProductHeader } from "@/components/product-header";

import "./globals.css";

import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "TalentGraph",
  description: "Explore realistic career paths, transferable skills, and learning opportunities.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        <ProductHeader />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
