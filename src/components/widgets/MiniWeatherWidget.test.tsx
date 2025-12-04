import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "../../context/ThemeContext";
import MiniWeatherWidget from "./MiniWeatherWidget";
import type { WeatherData } from "../../types/weather";

// Mock i18next
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        "common.loading": "Loading...",
        "errors.loadFailed": "Failed to load",
        "widget.noData": "No data",
      };
      return translations[key] || key;
    },
    i18n: {
      changeLanguage: () => new Promise(() => {}),
      language: "en",
    },
  }),
}));

// Mock WeatherAnimation component
vi.mock("../WeatherAnimation", () => ({
  default: ({
    type,
    width,
    height,
  }: {
    type: string;
    width: number;
    height: number;
  }) => (
    <div
      data-testid="weather-animation"
      data-type={type}
      style={{ width, height }}
    />
  ),
}));

// Mock getWeatherAnimation utility
vi.mock("../../utils/animations", () => ({
  getWeatherAnimation: (condition: string) => {
    const animations: Record<string, string> = {
      clear: "sunny",
      clouds: "cloudy",
      rain: "rainy",
      snow: "snowy",
    };
    return animations[condition] || "sunny";
  },
}));

const mockWeatherData: WeatherData = {
  coord: { lon: -0.1257, lat: 51.5085 },
  weather: [
    {
      id: 800,
      main: "Clear",
      description: "clear sky",
      icon: "01d",
    },
  ],
  base: "stations",
  main: {
    temp: 20,
    feels_like: 19,
    temp_min: 18,
    temp_max: 22,
    pressure: 1013,
    humidity: 60,
  },
  visibility: 10000,
  wind: {
    speed: 3.5,
    deg: 180,
  },
  clouds: {
    all: 0,
  },
  dt: 1234567890,
  sys: {
    type: 1,
    id: 1234,
    country: "GB",
    sunrise: 1234567000,
    sunset: 1234599000,
  },
  timezone: 0,
  id: 2643743,
  name: "London",
  cod: 200,
};

const renderWidget = (props = {}) => {
  return render(
    <ThemeProvider>
      <MiniWeatherWidget locationId="london" {...props} />
    </ThemeProvider>
  );
};

describe("MiniWeatherWidget", () => {
  it("renders loading state correctly", () => {
    renderWidget({ isLoading: true });
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("renders error state correctly", () => {
    renderWidget({ error: new Error("Test error") });
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("renders no data state when weather is undefined", () => {
    renderWidget({ weather: undefined });
    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("renders weather data correctly", () => {
    renderWidget({ weather: mockWeatherData });
    expect(screen.getByText("London")).toBeInTheDocument();
    expect(screen.getByText("20°")).toBeInTheDocument();
  });

  it("displays correct size variant - compact", () => {
    const { container } = renderWidget({
      weather: mockWeatherData,
      size: "compact",
    });
    const widget = container.firstChild;
    expect(widget).toHaveClass("w-[120px]", "h-[120px]");
  });

  it("displays correct size variant - medium", () => {
    const { container } = renderWidget({
      weather: mockWeatherData,
      size: "medium",
    });
    const widget = container.firstChild;
    expect(widget).toHaveClass("w-[200px]", "h-[160px]");
  });

  it("shows additional info for medium size", () => {
    renderWidget({ weather: mockWeatherData, size: "medium" });
    expect(screen.getByText("clear sky")).toBeInTheDocument();
    expect(screen.getByText(/60%/)).toBeInTheDocument(); // humidity
    expect(screen.getByText(/4 m\/s/)).toBeInTheDocument(); // wind speed (rounded from 3.5)
  });

  it("hides additional info for compact size", () => {
    renderWidget({ weather: mockWeatherData, size: "compact" });
    expect(screen.queryByText("clear sky")).not.toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    renderWidget({ weather: mockWeatherData, onClick: handleClick });

    const widget = screen.getByRole("button");
    fireEvent.click(widget);

    expect(handleClick).toHaveBeenCalledWith("london");
  });

  it("does not call onClick when no weather data", () => {
    const handleClick = vi.fn();
    renderWidget({ weather: undefined, onClick: handleClick });

    // No button role when no data
    const noDataElement = screen.getByText("No data");
    fireEvent.click(noDataElement.parentElement!);

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("handles keyboard navigation - Enter key", () => {
    const handleClick = vi.fn();
    renderWidget({ weather: mockWeatherData, onClick: handleClick });

    const widget = screen.getByRole("button");
    fireEvent.keyDown(widget, { key: "Enter" });

    expect(handleClick).toHaveBeenCalledWith("london");
  });

  it("handles keyboard navigation - Space key", () => {
    const handleClick = vi.fn();
    renderWidget({ weather: mockWeatherData, onClick: handleClick });

    const widget = screen.getByRole("button");
    fireEvent.keyDown(widget, { key: " " });

    expect(handleClick).toHaveBeenCalledWith("london");
  });

  it("renders weather animation", () => {
    renderWidget({ weather: mockWeatherData });
    const animations = screen.getAllByTestId("weather-animation");
    expect(animations.length).toBeGreaterThan(0);
  });

  it("is accessible with proper ARIA label", () => {
    renderWidget({ weather: mockWeatherData });
    const widget = screen.getByRole("button");
    expect(widget).toHaveAttribute("aria-label");
    expect(widget.getAttribute("aria-label")).toContain("London");
    expect(widget.getAttribute("aria-label")).toContain("20°");
    expect(widget.getAttribute("aria-label")).toContain("clear sky");
  });

  it("is keyboard focusable", () => {
    renderWidget({ weather: mockWeatherData });
    const widget = screen.getByRole("button");
    expect(widget).toHaveAttribute("tabIndex", "0");
  });

  it("applies custom className", () => {
    const { container } = renderWidget({
      weather: mockWeatherData,
      className: "custom-class",
    });
    const widget = container.firstChild;
    expect(widget).toHaveClass("custom-class");
  });
});
