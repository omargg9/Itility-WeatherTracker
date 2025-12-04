import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "./ThemeContext";

describe("ThemeContext", () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset HTML class
    document.documentElement.className = "";
  });

  it("initializes with a theme (dark by default or system preference)", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(["dark", "light"]).toContain(result.current.theme);
  });

  it("toggles between light and dark themes", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    const initialTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });

    const newTheme = result.current.theme;
    expect(newTheme).not.toBe(initialTheme);
    expect(["dark", "light"]).toContain(newTheme);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe(initialTheme);
  });

  it("sets theme directly", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme("light");
    });

    expect(result.current.theme).toBe("light");

    act(() => {
      result.current.setTheme("dark");
    });

    expect(result.current.theme).toBe("dark");
  });

  it("persists theme to localStorage", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme("light");
    });

    const stored = localStorage.getItem("weather_theme");
    expect(stored).toBe("light");
  });

  it("loads theme from localStorage on initialization", () => {
    localStorage.setItem("weather_theme", "light");

    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    expect(result.current.theme).toBe("light");
  });

  it("updates HTML class when theme changes", () => {
    const { result } = renderHook(() => useTheme(), {
      wrapper: ThemeProvider,
    });

    act(() => {
      result.current.setTheme("light");
    });

    expect(document.documentElement.classList.contains("light")).toBe(true);
    expect(document.documentElement.classList.contains("dark")).toBe(false);

    act(() => {
      result.current.setTheme("dark");
    });

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.classList.contains("light")).toBe(false);
  });

  it("throws error when used outside provider", () => {
    expect(() => {
      renderHook(() => useTheme());
    }).toThrow("useTheme must be used within a ThemeProvider");
  });
});
