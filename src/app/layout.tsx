import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { getLocale } from "@/lib/locale-server";

// 무드보드 폰트: Baloo 2(둥근 헤드라인) + Nunito(본문). 한글은 시스템 폰트로 폴백.
const baloo = Baloo_2({
  subsets: ["latin"],
  variable: "--font-baloo",
  weight: ["500", "600", "700", "800"],
});
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
});
import { Providers } from "@/components/Providers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";

export const metadata: Metadata = {
  title: "성수 팝업 굿즈 | Seongsu Popup Goods",
  description:
    "성수동 팝업스토어 공식 굿즈를 다국어로 만나는 글로벌 쇼핑몰 (학습용 프로젝트).",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      className={`h-full antialiased ${baloo.variable} ${nunito.variable}`}
    >
      <body className="flex min-h-full flex-col bg-cream text-ink-soft">
        <Providers initialLocale={locale}>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
            {children}
          </main>
          <Footer />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  );
}
