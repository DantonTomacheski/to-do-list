import { render, screen, fireEvent, act } from "@testing-library/react";
import { vi } from "vitest";
import DayChip from "../DayChip";

describe("DayChip", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders correctly with given date", () => {
    const date = new Date(2025, 3, 30); // April 30, 2025
    const handleClick = vi.fn();

    render(<DayChip date={date} isSelected={false} onClick={handleClick} />);

    // Check for the day number
    expect(screen.getByText("30")).toBeInTheDocument();
    // Check for the day of week (abbreviated)
    const dayOfWeekElement = screen.getByText(/wed|qua/i); // Either Wed (English) or Qua (Portuguese)
    expect(dayOfWeekElement).toBeInTheDocument();
  });

  it("applies selected styling when isSelected is true", () => {
    const date = new Date();
    const handleClick = vi.fn();

    render(<DayChip date={date} isSelected={true} onClick={handleClick} />);

    const dayChip = screen.getByRole("tab");
    expect(dayChip).toHaveClass("bg-purple-600");
    expect(dayChip).toHaveClass("text-white");
    expect(dayChip).toHaveAttribute("aria-selected", "true");
  });

  it("applies today styling when date is today and not selected", () => {
    const today = new Date();
    const handleClick = vi.fn();

    render(<DayChip date={today} isSelected={false} onClick={handleClick} />);

    const dayChip = screen.getByRole("tab");
    expect(dayChip).toHaveClass("border-purple-600");
  });

  it("calls onClick when clicked", () => {
    const date = new Date();
    const handleClick = vi.fn();

    render(<DayChip date={date} isSelected={false} onClick={handleClick} />);

    fireEvent.mouseDown(screen.getByRole("tab"));
    fireEvent.mouseUp(screen.getByRole("tab"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("calls onLongPress after long press", () => {
    const date = new Date();
    const handleClick = vi.fn();
    const handleLongPress = vi.fn();

    render(
      <DayChip
        date={date}
        isSelected={false}
        onClick={handleClick}
        onLongPress={handleLongPress}
      />
    );

    // Start pressing
    fireEvent.mouseDown(screen.getByRole("tab"));

    // Fast-forward time to trigger long press
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(handleLongPress).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("handles touch events correctly", () => {
    const date = new Date();
    const handleClick = vi.fn();

    render(<DayChip date={date} isSelected={false} onClick={handleClick} />);

    fireEvent.touchStart(screen.getByRole("tab"));
    fireEvent.touchEnd(screen.getByRole("tab"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("cancels long press on touch cancel", () => {
    const date = new Date();
    const handleClick = vi.fn();
    const handleLongPress = vi.fn();

    render(
      <DayChip
        date={date}
        isSelected={false}
        onClick={handleClick}
        onLongPress={handleLongPress}
      />
    );

    // Start pressing
    fireEvent.touchStart(screen.getByRole("tab"));

    // Cancel before timeout
    fireEvent.touchCancel(screen.getByRole("tab"));

    // Fast-forward time
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(handleLongPress).not.toHaveBeenCalled();
    expect(handleClick).not.toHaveBeenCalled();
  });
});
