import "./globals.css";
import { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";

const inter=Inter({ subsets: ["latin"] });

export const metadata={
  title: "Llama tokenizer playground",
  description:
    "A simple web app to play with the Llama tokenizer.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%2210 0 100 100%22><text y=%22.90em%22 font-size=%2290%22>🦙</text></svg>"></link>
      </head>
      <body className={inter.className}>
        {children}
      </body>
      <Analytics />
    </html>
  );
}