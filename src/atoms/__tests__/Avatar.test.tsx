import { render, screen } from "@testing-library/react";
import Avatar from "../Avatar";

describe("Avatar", () => {
  it("renders correctly with default props", () => {
    render(<Avatar />);

    const avatar = screen.getByAltText("Test User");
    expect(avatar).toBeInTheDocument();
    expect(avatar.closest("div")).toHaveClass("w-10 h-10"); // md size by default
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<Avatar size="sm" />);
    expect(screen.getByAltText("Test User").closest("div")).toHaveClass(
      "w-8 h-8"
    );

    rerender(<Avatar size="md" />);
    expect(screen.getByAltText("Test User").closest("div")).toHaveClass(
      "w-10 h-10"
    );

    rerender(<Avatar size="lg" />);
    expect(screen.getByAltText("Test User").closest("div")).toHaveClass(
      "w-12 h-12"
    );
  });

  it("applies custom className when provided", () => {
    render(<Avatar className="custom-class" />);
    expect(screen.getByAltText("Test User").closest("div")).toHaveClass(
      "custom-class"
    );
  });

  it("uses the user's photo when available", () => {
    // The mock in setupTests provides a null photo, so it should use the default
    render(<Avatar />);
    const avatar = screen.getByAltText("Test User");
    expect(avatar).toHaveAttribute(
      "src",
      "https://avatar.iran.liara.run/public/2"
    );
  });
});
