import './globals.css';

export const metadata = {
  title: 'Mitchi Shop Manager',
  description: 'Quản lý shop Tarot & Lenormand',
  manifest: '/manifest.webmanifest?v=24',
  themeColor: '#F5C842',
  icons: {
    icon: [
      { url: '/favicon.ico?v=24' },
      { url: '/favicon-16x16.png?v=24', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png?v=24', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png?v=24', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png?v=24', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png?v=24', sizes: '180x180', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Mitchi',
  },
};

export const viewport = {
  themeColor: '#F5C842',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.webmanifest?v=24" />
        <link rel="icon" href="/favicon.ico?v=24" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=24" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=24" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png?v=24" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=24" />
        <meta name="theme-color" content="#F5C842" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Mitchi" />
      </head>
      <body>{children}</body>
    </html>
  );
}
