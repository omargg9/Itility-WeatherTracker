import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import LanguageSelector from "./LanguageSelector";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const location = useLocation();

  const backgroundStyle = {
    background: theme === "dark" ? "rgb(17, 24, 39)" : "rgb(249, 250, 251)",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    transition: "background 0.3s ease",
  };

  const isWidgetsPage = location.pathname === "/widgets";

  return (
    <div style={backgroundStyle}>
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-800/80 dark:border-gray-700 p-4 transition-colors duration-300">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/">
              <h1
                style={{
                  fontSize: "1.875rem",
                  fontWeight: "bold",
                  letterSpacing: "-0.025em",
                  color: theme === "dark" ? "#ffffff" : "#111827",
                  cursor: "pointer",
                }}
              >
                {t("app.title")}
              </h1>
            </Link>
            <nav className="flex gap-4">
              <Link
                to="/widgets"
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  isWidgetsPage
                    ? theme === "dark"
                      ? "bg-white/20 text-white"
                      : "bg-blue-500 text-white"
                    : theme === "dark"
                    ? "text-white/70 hover:text-white hover:bg-white/10"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                📊 Widgets
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSelector />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8">{children}</main>

      <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200 dark:bg-gray-800/80 dark:border-gray-700 p-4 mt-auto transition-colors duration-300">
        <div className="container mx-auto text-center text-sm text-gray-600 dark:text-gray-300">
          <p>{t("footer.poweredBy")}</p>
        </div>
      </footer>
    </div>
  );
}
