import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Cross Margin Labs, Inc.",
  description:
    "A research and development company building financial infrastructure for the on-chain economy.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fraunces.variable}>
      <body>{children}</body>
    </html>
  );
}
