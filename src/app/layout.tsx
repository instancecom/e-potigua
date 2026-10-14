import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "e-potiguá | Gestão e Operação Automotiva",
  description:
    "Plataforma SaaS moderna para gestão e operação de lava-rápidos e estética automotiva",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans bg-background text-text-main selection:bg-brand-petrol/20 selection:text-brand-petrol">
        {children}
      </body>
    </html>
  );
}
