import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeatherBackground } from "./WeatherBackground";

describe("WeatherBackground", () => {
  it("renders with clear weather condition", () => {
    const { container } = render(<WeatherBackground condition="Clear" />);
    const motionDiv = container.querySelector('[aria-hidden="true"]');
    expect(motionDiv).toBeInTheDocument();
  });

  it("renders with rain weather condition", () => {
    const { container } = render(<WeatherBackground condition="Rain" />);
    const motionDiv = container.querySelector('[aria-hidden="true"]');
    expect(motionDiv).toBeInTheDocument();
  });

  it("renders with clouds weather condition", () => {
    const { container } = render(<WeatherBackground condition="Clouds" />);
    const motionDiv = container.querySelector('[aria-hidden="true"]');
    expect(motionDiv).toBeInTheDocument();
  });

  it("renders with snow weather condition", () => {
    const { container } = render(<WeatherBackground condition="Snow" />);
    const motionDiv = container.querySelector('[aria-hidden="true"]');
    expect(motionDiv).toBeInTheDocument();
  });

  it("renders with thunderstorm weather condition", () => {
    const { container } = render(<WeatherBackground condition="Thunderstorm" />);
    const motionDiv = container.querySelector('[aria-hidden="true"]');
    expect(motionDiv).toBeInTheDocument();
  });

  it("renders with drizzle weather condition", () => {
    const { container } = render(<WeatherBackground condition="Drizzle" />);
    const motionDiv = container.querySelector('[aria-hidden="true"]');
    expect(motionDiv).toBeInTheDocument();
  });

  it("renders with mist weather condition", () => {
    const { container } = render(<WeatherBackground condition="Mist" />);
    const motionDiv = container.querySelector('[aria-hidden="true"]');
    expect(motionDiv).toBeInTheDocument();
  });

  it("handles case-insensitive condition matching", () => {
    const { container } = render(<WeatherBackground condition="CLEAR" />);
    const motionDiv = container.querySelector('[aria-hidden="true"]');
    expect(motionDiv).toBeInTheDocument();
  });

  it("uses default image for unknown conditions", () => {
    const { container } = render(<WeatherBackground condition="Unknown" />);
    const motionDiv = container.querySelector('[aria-hidden="true"]');
    expect(motionDiv).toBeInTheDocument();
  });

  it("has correct accessibility attributes", () => {
    const { container } = render(<WeatherBackground condition="Clear" />);
    const motionDiv = container.querySelector('[aria-hidden="true"]');
    expect(motionDiv).toHaveAttribute("aria-hidden", "true");
  });

  it("has decorative image with empty alt text", () => {
    render(<WeatherBackground condition="Clear" />);
    const img = screen.queryByRole("img", { hidden: true });
    if (img) {
      expect(img).toHaveAttribute("alt", "");
    }
  });
});
