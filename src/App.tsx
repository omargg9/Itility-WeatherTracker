import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import HomePage from "./pages/HomePage";
import WidgetsPage from "./pages/WidgetsPage";
import Layout from "./components/Layout";
import { PageTransition } from "./components/layout/PageTransition";
import { FavoritesProvider } from "./context/FavoritesContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const location = useLocation();

  return (
    <ThemeProvider>
      <FavoritesProvider>
        <Layout>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <PageTransition>
                    <HomePage />
                  </PageTransition>
                }
              />
              <Route
                path="/widgets"
                element={
                  <PageTransition>
                    <WidgetsPage />
                  </PageTransition>
                }
              />
              <Route
                path="/:city"
                element={
                  <PageTransition>
                    <HomePage />
                  </PageTransition>
                }
              />
            </Routes>
          </AnimatePresence>
        </Layout>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
