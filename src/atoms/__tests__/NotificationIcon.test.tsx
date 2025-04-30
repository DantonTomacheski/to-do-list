import { render, screen } from "@testing-library/react";
import NotificationIcon from "../NotificationIcon";

describe("NotificationIcon", () => {
  it("renders correctly with notification count", () => {
    render(<NotificationIcon />);

    // Check for SVG element
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass("w-6 h-6");

    // Check for notification badge
    const badge = screen.getByText("1");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-purple-600");
    expect(badge).toHaveClass("text-white");
    expect(badge).toHaveClass("rounded-full");
  });

  it("has proper positioning for the notification badge", () => {
    render(<NotificationIcon />);

    const badge = screen.getByText("1");
    const container = badge.parentElement;

    expect(badge).toHaveClass("absolute");
    expect(badge).toHaveClass("-top-1");
    expect(badge).toHaveClass("-right-1");
    expect(container).toHaveClass("relative"); // Parent should have relative positioning
  });
});
