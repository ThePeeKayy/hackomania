import { Inter } from "next/font/google";
import "./globals.css";
import Nav from "../components/nav";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className=" h-[100vh]">
      <body className='flex flex-col overflow-auto'>
        <Toaster />
        <Nav />
        {children}
      </body>
    </html >
  );
}