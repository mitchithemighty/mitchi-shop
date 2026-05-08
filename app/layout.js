import "./globals.css";
export const metadata = { title: "Mitchi Shop Manager", description: "Tarot & Lenormand Shop Manager" };
export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;800;900&family=Nunito+Sans:wght@400;600;700&display=swap"/>
      </head>
      <body>{children}</body>
    </html>
  );
}
