import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Timesheet faccende",
  description: "chores timesheet",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["chores", "timesheet"],
  authors: [{ name: "Frederik Batuna" }, { name: "Alice Cecchetti" }],
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
      <body className={inter.className}>
        <Suspense
          fallback={
            <div className="loader-container">
              <div className="loader"></div>
            </div>
          }
        >
          {children}
        </Suspense>
      </body>
    </html>
  );
}
