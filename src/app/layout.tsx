import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { MobileMenu } from "../shared/side_menu/mobile_menu";
import { DesktopMenu } from "../shared/side_menu/desktop_menu";
import { AppInitializer } from "../shared/app_initializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edumetricks",
  description:
    "Edumetricks es una plataforma de analítica educativa que permite a colegios e instituciones monitorear el rendimiento académico, identificar estudiantes en riesgo y tomar decisiones basadas en datos.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="w-full min-h-full h-full flex flex-col bg-background">
        <AppInitializer>
          <div className="flex flex-col lg:flex-row h-full">
            <DesktopMenu />
            {children}
            <MobileMenu />
            {modal}
          </div>
        </AppInitializer>
      </body>
    </html>
  );
}
