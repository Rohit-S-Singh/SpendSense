import "./globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300","400","500","600","700"],
  variable: "--font-poppins"
});

export const metadata = {
  title: "SpendSense",
  description: "Track daily expenses easily"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <html lang="en">
      <body className={`${poppins.className} bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}