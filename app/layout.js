export const metadata = {
  title: "Mitchi Shop Manager",
  description: "Quản lý shop Tarot & Lenormand",
  manifest: "/manifest.webmanifest?v=26",
  themeColor: "#3EAEF4",
  icons: {
    icon: [
      { url: "/favicon.ico?v=26" },
      { url: "/icon-32.png?v=26", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png?v=26", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png?v=26", sizes: "512x512", type: "image/png" }
    ],
    apple: [
      { url: "/apple-touch-icon.png?v=26", sizes: "180x180", type: "image/png" }
    ],
    shortcut: ["/favicon.ico?v=26"]
  },
  appleWebApp: {
    capable: true,
    title: "Mitchi",
    statusBarStyle: "default"
  }
};

export const viewport = {
  themeColor: "#3EAEF4",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.webmanifest?v=26" />
        <link rel="icon" href="/favicon.ico?v=26" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16.png?v=26" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png?v=26" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png?v=26" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=26" />
        <meta name="theme-color" content="#3EAEF4" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Mitchi" />
      </head>
      <body>{children}</body>
    </html>
  );
}
