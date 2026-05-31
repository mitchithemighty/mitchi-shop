export const metadata = {
  title: "Mitchi Shop Manager",
  description: "Quản lý shop Tarot & Lenormand",
  manifest: "/manifest.webmanifest?v=25",
  themeColor: "#BDE9FF",
  icons: {
    icon: [
      { url: "/favicon.ico?v=25", sizes: "any" },
      { url: "/icon-192.png?v=25", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png?v=25", type: "image/png", sizes: "512x512" }
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=25", sizes: "180x180", type: "image/png" }
    ]
  }
};

export const viewport = {
  themeColor: "#BDE9FF",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.webmanifest?v=25" />
        <link rel="icon" href="/favicon.ico?v=25" sizes="any" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png?v=25" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=25" />
        <meta name="theme-color" content="#BDE9FF" />
      </head>
      <body>{children}</body>
    </html>
  );
}
