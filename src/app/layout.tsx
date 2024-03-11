import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Timesheet faccende",
  description: "chores timesheet",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["chores", "timesheet"],
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "#000000" }],
  authors: [
    { name: "Frederik Batuna" },
    { name: "Alice Cecchetti" },
  ],
  viewport:
    "minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover",
  icons: [
    { rel: "apple-touch-icon", url: "icons/icon-128.png" },
    { rel: "icon", url: "icons/icon-128.png" },
  ],
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
