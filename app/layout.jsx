import "./globals.css";
import { ThemeProvider } from "next-themes";
import { ClerkProvider } from "@clerk/nextjs";
import Navigation from "../components/navigation";

export const metadata = {
  author: "Allan Oguis",
  title: "Hacktoberfest 2024",
  description:
    "Gojirun is a 2D platformer game inspired by the classic T-Rex run from Chrome. This project is dedicated to Hacktoberfest 2024 and all its contributors.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className="scroll-smooth antialiased"
        suppressHydrationWarning
      >
        <head />
        <body className="bg-background font-space transition-all duration-300">
          <ThemeProvider attribute="class">
            <>
              <Navigation />
            </>
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
