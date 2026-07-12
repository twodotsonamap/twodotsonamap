import {Martel_Sans, Montserrat} from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const martel = Martel_Sans({
  variable: "--font-martel",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const monsterrat = Montserrat({
  variable: "--font-monsterrat",
  subsets: ["latin"],
  weight: ["300", "400"],
});

const title = "Two Dots on a Map";
const description = "We'll always be together in electric dreams";

export const metadata = {
  metadataBase: new URL("https://www.twodotsonamap.com"),
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/",
    images: [{ url: "/img/capadoccia2023.jpg", width: 4032, height: 2268 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/img/capadoccia2023.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${martel.variable} ${monsterrat.variable}`}>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
