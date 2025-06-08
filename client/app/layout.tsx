// app/layout.tsx
import "./globals.css";
import { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "SmartShop",
  description: "Your Gen-Z AI shopping assistant",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-genz-bg text-genz-white font-sans">
        <nav className="flex justify-between items-center px-6 py-4 bg-genz-bg border-b border-genz-accent">
          <Link href="/" className="text-xl font-bold text-genz-accent">SmartShop</Link>
          {/* <div className="space-x-4">
            <Link href="/start" className="hover:text-genz-pink">Start</Link>
            <Link href="/explore" className="hover:text-genz-cyan">Explore</Link>
            <Link href="/results" className="hover:text-genz-pink">Results</Link>
          </div> */}
        </nav>
        <main className="px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
