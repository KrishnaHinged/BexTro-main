import "./globals.css";
import { ReduxProvider } from "../redux/provider";
import SocketProvider from "../components/providers/SocketProvider";

export const metadata = {
  title: "Bextro - Take Action, Don't Just Talk",
  description: "The progress portfolio of your life. Build streaks, generate custom challenges tailored to your goals, and document your growth with verifiable proof.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans-clean bg-cream text-charcoal">
        <ReduxProvider>
          <SocketProvider>
            {children}
          </SocketProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}

