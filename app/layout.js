import "./globals.css";

export const metadata = {
  title: "SQL-Learn",
  description: "SQL-Learn platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
