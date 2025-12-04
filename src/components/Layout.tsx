import { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-blue-400 via-blue-500 to-purple-600">
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20 p-4">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Weather Tracker
          </h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">{children}</main>

      <footer className="bg-white/10 backdrop-blur-md border-t border-white/20 p-4 mt-auto">
        <div className="container mx-auto text-center text-sm text-white/80">
          <p>Powered by OpenWeatherMap API</p>
        </div>
      </footer>
    </div>
  );
}
