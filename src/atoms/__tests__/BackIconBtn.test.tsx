import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import BackIconBtn from "../BackIconBtn";

describe("BackIconBtn", () => {
  it("renders correctly with default props", () => {
    const handleClick = vi.fn();
    render(<BackIconBtn onClick={handleClick} />);

    const button = screen.getByRole("button", { name: /back/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute("aria-label", "Back");
  });

  it("renders with custom aria-label when provided", () => {
    const handleClick = vi.fn();
    render(<BackIconBtn onClick={handleClick} ariaLabel="Go back" />);

    const button = screen.getByRole("button", { name: /go back/i });
    expect(button).toHaveAttribute("aria-label", "Go back");
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<BackIconBtn onClick={handleClick} />);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("contains an SVG element", () => {
    const handleClick = vi.fn();
    render(<BackIconBtn onClick={handleClick} />);

    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
  });
});
