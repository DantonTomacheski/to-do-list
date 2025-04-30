
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import WelcomeIllustration from '../WelcomeIllustration';

// Mock the SVG import
vi.mock('@/assets/svgs/welcome-icon.svg', () => ({
  default: 'welcome-icon.svg'
}));

describe("WelcomeIllustration", () => {
  it("renders correctly with default props", () => {
    render(<WelcomeIllustration />);

    const image = screen.getByAltText("Welcome");
    expect(image).toBeInTheDocument();
    expect(image.getAttribute("src")).toBe("welcome-icon.svg");

    const container = image.closest("div");
    expect(container).toHaveClass("w-12 h-12"); // md size by default
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<WelcomeIllustration size="sm" />);
    let container = screen.getByAltText("Welcome").closest("div");
    expect(container).toHaveClass("w-8 h-8");

    rerender(<WelcomeIllustration size="md" />);
    container = screen.getByAltText("Welcome").closest("div");
    expect(container).toHaveClass("w-12 h-12");

    rerender(<WelcomeIllustration size="lg" />);
    container = screen.getByAltText("Welcome").closest("div");
    expect(container).toHaveClass("w-60 h-60");
  });

  it("applies custom className when provided", () => {
    render(<WelcomeIllustration className="custom-class" />);

    const container = screen.getByAltText("Welcome").closest("div");
    expect(container).toHaveClass("custom-class");
  });
});
