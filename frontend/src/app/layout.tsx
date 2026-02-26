import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { LocaleProvider } from "@/components/LocaleProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Worker - Rasmiy ish platformasi",
  description:
    "Davlat integratsiyali rasmiy ish platformasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uz">
      <body className={inter.className}>
        <LocaleProvider>
          <Providers>{children}</Providers>
        </LocaleProvider>
      </body>
    </html>
  );
}
