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

export const metadata = {
  title: "Two Dots on a Map | The Mailbox",
  description: "Drop a note for a stranger to find, or open one someone left for you.",
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
