import { render, screen } from "@testing-library/react";
import PageTitle from "../PageTitle";

describe("PageTitle", () => {
  it("renders correctly with children", () => {
    render(<PageTitle>Test Title</PageTitle>);

    const title = screen.getByText("Test Title");
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe("H1");
  });

  it('has the correct default classes', () => {
    render(<PageTitle>Test Title</PageTitle>);
    
    const title = screen.getByText('Test Title');
    expect(title).toHaveClass('text-lg');
    expect(title).toHaveClass('font-semibold');
    expect(title).toHaveClass('text-center');
  });
});
