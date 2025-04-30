import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import ProgressCircle from "../ProgressCircle";

// Mock the CircularProgressbar component since it's a third-party library
vi.mock("react-circular-progressbar", () => ({
  CircularProgressbar: ({ value, text }: { value: number; text: string }) => (
    <div
      data-testid="mock-circular-progressbar"
      data-value={value}
      data-text={text}
    >
      {text && <span data-testid="progressbar-text">{text}</span>}
    </div>
  ),
  buildStyles: (props: any) => props,
}));

describe("ProgressCircle", () => {
  it("renders with correct percentage", () => {
    render(<ProgressCircle percentage={75} />);

    const progressbar = screen.getByTestId("mock-circular-progressbar");
    expect(progressbar).toHaveAttribute("data-value", "75");
    expect(progressbar).toHaveAttribute("data-text", "75%");
  });

  it("applies the correct size based on prop", () => {
    const { rerender } = render(<ProgressCircle percentage={50} size="sm" />);
    let progressContainer = screen.getByTestId(
      "mock-circular-progressbar"
    ).parentElement;
    expect(progressContainer).toHaveStyle({ width: "40px", height: "40px" });

    rerender(<ProgressCircle percentage={50} size="md" />);
    progressContainer = screen.getByTestId(
      "mock-circular-progressbar"
    ).parentElement;
    expect(progressContainer).toHaveStyle({ width: "60px", height: "60px" });

    rerender(<ProgressCircle percentage={50} size="lg" />);
    progressContainer = screen.getByTestId(
      "mock-circular-progressbar"
    ).parentElement;
    expect(progressContainer).toHaveStyle({ width: "80px", height: "80px" });
  });

  it("uses default size when not specified", () => {
    render(<ProgressCircle percentage={50} />);
    const progressContainer = screen.getByTestId(
      "mock-circular-progressbar"
    ).parentElement;
    expect(progressContainer).toHaveStyle({ width: "60px", height: "60px" }); // md is default
  });

  it("applies custom classNames", () => {
    render(<ProgressCircle percentage={50} className="test-class" />);
    const progressContainer = screen.getByTestId(
      "mock-circular-progressbar"
    ).parentElement;
    expect(progressContainer).toHaveClass("test-class");
  });

  it("does not show percentage text when showPercentage is false", () => {
    render(<ProgressCircle percentage={50} showPercentage={false} />);

    const progressbar = screen.getByTestId("mock-circular-progressbar");
    expect(progressbar).toHaveAttribute("data-text", "");
    expect(screen.queryByTestId("progressbar-text")).not.toBeInTheDocument();
  });
});
