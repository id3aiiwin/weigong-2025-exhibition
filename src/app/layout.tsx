import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "2025 為恭醫院訓練成果展 | 國際評量應用發展協會",
  description:
    "國際評量應用發展協會為恭醫院 2025 年度訓練成果 3D 互動展覽館",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <body>{children}</body>
    </html>
  );
}
