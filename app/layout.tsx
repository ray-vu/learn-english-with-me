import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "LearnEnglish – Học tiếng Anh hiệu quả",
    template: "%s | LearnEnglish",
  },
  description: "Ứng dụng học từ vựng và luyện viết tiếng Anh tương tác, hiệu quả.",
  keywords: ["học tiếng anh", "từ vựng", "luyện viết", "english vocabulary", "writing practice"],
  authors: [{ name: "LearnEnglish" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    title: "LearnEnglish – Học tiếng Anh hiệu quả",
    description: "Ứng dụng học từ vựng và luyện viết tiếng Anh tương tác, hiệu quả.",
    siteName: "LearnEnglish",
  },
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1" id="main-content">
          {children}
        </main>
        <footer className="mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
          © {new Date().getFullYear()} LearnEnglish · Học tiếng Anh mỗi ngày
        </footer>
      </body>
    </html>
  );
}
