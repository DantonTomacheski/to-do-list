import { render, screen, fireEvent, act } from '@testing-library/react';
import { vi } from "vitest";
import StatusFilterChip from "../StatusFilterChip";

// Mock the window.innerWidth
const mockInnerWidth = (width: number) => {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });
};

// Mock the resize event
const mockResize = () => {
  window.dispatchEvent(new Event("resize"));
};

describe("StatusFilterChip", () => {
  beforeEach(() => {
    // Default to desktop view
    mockInnerWidth(1024);
  });

  it("renders correctly with desktop view", () => {
    const handleClick = vi.fn();
    render(
      <StatusFilterChip status="All" isActive={false} onClick={handleClick} />
    );

    const chip = screen.getByRole("tab", { name: "all" });
    expect(chip).toBeInTheDocument();
    expect(chip).toHaveClass("bg-gray-100");
    expect(chip).toHaveClass("text-gray-800");
    expect(screen.getByText("all")).toBeInTheDocument();
  });

  it("shows active state when isActive is true", () => {
    const handleClick = vi.fn();
    render(
      <StatusFilterChip status="To-do" isActive={true} onClick={handleClick} />
    );

    const chip = screen.getByRole("tab", { name: "todo" });
    expect(chip).toHaveAttribute("aria-selected", "true");

    // Check for active indicator
    const activeIndicator = chip.querySelector("div.absolute.bottom-0");
    expect(activeIndicator).toBeInTheDocument();
    expect(activeIndicator).toHaveClass("bg-blue-600");

    // Text should be bold
    expect(screen.getByText("todo")).toHaveClass("font-bold");
  });

  it("calls onClick when clicked", () => {
    const handleClick = vi.fn();
    render(
      <StatusFilterChip
        status="In Progress"
        isActive={false}
        onClick={handleClick}
      />
    );

    fireEvent.click(screen.getByRole("tab"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies correct colors based on status", () => {
    const handleClick = vi.fn();
    const { rerender } = render(
      <StatusFilterChip status="All" isActive={false} onClick={handleClick} />
    );
    expect(screen.getByRole("tab")).toHaveClass("bg-gray-100");

    rerender(
      <StatusFilterChip status="To-do" isActive={false} onClick={handleClick} />
    );
    expect(screen.getByRole("tab")).toHaveClass("bg-blue-100");

    rerender(
      <StatusFilterChip
        status="In Progress"
        isActive={false}
        onClick={handleClick}
      />
    );
    expect(screen.getByRole("tab")).toHaveClass("bg-orange-100");

    rerender(
      <StatusFilterChip status="Done" isActive={false} onClick={handleClick} />
    );
    expect(screen.getByRole("tab")).toHaveClass("bg-green-100");
  });

  it("switches to mobile view when window width is small", () => {
    const handleClick = vi.fn();

    // Set mobile width
    mockInnerWidth(500);

    render(
      <StatusFilterChip status="All" isActive={false} onClick={handleClick} />
    );

    const chip = screen.getByRole("tab");
    expect(chip).toHaveClass("p-2");
    expect(chip).toHaveClass("min-w-[40px]");

    // Should show both icon and text in mobile view
    const svg = chip.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(screen.getByText("all")).toBeInTheDocument();
  });

  it("responds to window resize events", () => {
    const handleClick = vi.fn();

    // Start with desktop view
    mockInnerWidth(1024);

    render(
      <StatusFilterChip status="All" isActive={false} onClick={handleClick} />
    );

    const chip = screen.getByRole("tab");
    expect(chip).toHaveClass("px-4");
    expect(chip).not.toHaveClass("p-2");

    // Switch to mobile view
    mockInnerWidth(500);
    act(() => {
      mockResize();
    });

    // After resize, should have mobile classes
    expect(chip).toHaveClass("p-2");
    expect(chip).toHaveClass("min-w-[40px]");
  });

  it('renders mobile view when screen is small', () => {
    const handleClick = vi.fn();
    
    // Set mobile width first
    mockInnerWidth(500);
    
    render(
      <StatusFilterChip 
        status="All" 
        isActive={false} 
        onClick={handleClick} 
      />
    );
    
    // Initial mobile render should have mobile classes
    const chip = screen.getByRole('tab');
    expect(chip).toHaveClass('p-2');
    expect(chip).toHaveClass('min-w-[40px]');
    
    // Should show mobile UI with icons
    const svg = chip.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });
});
