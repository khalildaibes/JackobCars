import { Inter } from "next/font/google";
import { Noto_Kufi_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const notoKufiArabic = Noto_Kufi_Arabic({ 
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-kufi-arabic"
});

export default function RootLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <html lang={locale}>
      <body className={`${inter.className} ${notoKufiArabic.variable}`}>
        {children}
      </body>
    </html>
  );
} 