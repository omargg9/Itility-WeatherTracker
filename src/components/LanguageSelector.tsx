import { useTranslation } from "react-i18next";
import { useTheme } from "../context/ThemeContext";

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "nl", name: "Nederlands", flag: "🇳🇱" },
];

/**
 * Language selector dropdown for internationalization
 * Supports English, Spanish, French, and German
 */
export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const { theme } = useTheme();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
  };

  const selectStyle = {
    padding: "0.5rem 2rem 0.5rem 0.75rem",
    background: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "#ffffff",
    border:
      theme === "dark"
        ? "1px solid rgba(255, 255, 255, 0.2)"
        : "1px solid #d1d5db",
    borderRadius: "0.75rem",
    color: theme === "dark" ? "#ffffff" : "#111827",
    fontSize: "0.875rem",
    cursor: "pointer",
    outline: "none",
  };

  return (
    <select
      value={i18n.language}
      onChange={(e) => handleLanguageChange(e.target.value)}
      style={selectStyle}
      aria-label="Select language"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
