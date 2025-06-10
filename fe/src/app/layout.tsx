"use client";

import "./globals.css";
import { Web3Provider } from "@/providers/Web3Provider";
import { AuthProvider } from "@/providers/AuthProvider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-900 text-white">
        <Web3Provider>
          <AuthProvider>{children}</AuthProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
