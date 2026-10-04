import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dead Infrastructure Mapper",
  description: "Map and report broken, damaged, and inaccessible public infrastructure",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  );
}
