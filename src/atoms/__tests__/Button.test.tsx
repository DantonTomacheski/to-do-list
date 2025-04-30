import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";
import { vi } from "vitest";

describe("Button", () => {
  it("renders correctly with default props", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-[#6236ff]"); // primary variant class
  });

  it("applies variant classes correctly", () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-[#6236ff]");

    rerender(<Button variant="secondary">Secondary</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-pink-500");

    rerender(<Button variant="outline">Outline</Button>);
    expect(screen.getByRole("button")).toHaveClass("border-[#6236ff]");
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("py-2 px-5 text-sm");

    rerender(<Button size="md">Medium</Button>);
    expect(screen.getByRole("button")).toHaveClass("py-3 px-8 text-base");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("py-4 px-10 text-lg");
  });

  it("applies fullWidth class when specified", () => {
    render(<Button fullWidth>Full Width</Button>);
    expect(screen.getByRole("button")).toHaveClass("w-full");
  });

  it("displays icon based on iconPosition and showIcon props", () => {
    const { rerender } = render(
      <Button showIcon iconPosition="right">
        Right Icon
      </Button>
    );
    expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();

    rerender(
      <Button showIcon iconPosition="left">
        Left Icon
      </Button>
    );
    expect(screen.getByRole("button").querySelector("svg")).toBeInTheDocument();

    rerender(<Button showIcon={false}>No Icon</Button>);
    expect(
      screen.getByRole("button").querySelector("svg")
    ).not.toBeInTheDocument();
  });

  it("accepts custom icon", () => {
    const CustomIcon = () => <span data-testid="custom-icon">★</span>;
    render(<Button icon={<CustomIcon />}>Custom Icon</Button>);

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
  });

  it("calls onClick handler when clicked", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles ripple effect on click", () => {
    render(<Button>Ripple</Button>);
    const button = screen.getByRole("button");

    // Initially no ripple spans
    expect(button.querySelectorAll("span.animate-ripple").length).toBe(0);

    // After click, a ripple span should be added
    fireEvent.click(button);
    expect(button.querySelectorAll("span.animate-ripple").length).toBe(1);
  });
});
