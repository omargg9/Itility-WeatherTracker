import { type ReactNode } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "../context/ThemeContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useTheme();

  const backgroundStyle = {
    background: theme === "dark" ? "rgb(17, 24, 39)" : "rgb(249, 250, 251)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    transition: "background 0.3s ease",
  };

  return (
    <div style={backgroundStyle}>
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-800/80 dark:border-gray-700 p-4 transition-colors duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <h1
            style={{
              fontSize: "1.875rem",
              fontWeight: "bold",
              letterSpacing: "-0.025em",
              color: theme === "dark" ? "#ffffff" : "#111827",
            }}
          >
            Weather Tracker
          </h1>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">{children}</main>

      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 dark:bg-gray-800/80 dark:border-gray-700 p-4 mt-auto transition-colors duration-300">
        <div className="container mx-auto text-center text-sm text-gray-600 dark:text-gray-300">
          <p>Powered by OpenWeatherMap API</p>
        </div>
      </footer>
    </div>
  );
}
