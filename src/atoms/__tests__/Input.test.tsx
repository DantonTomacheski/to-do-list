import { render, screen } from "@testing-library/react";
import Input from "../Input";

describe("Input", () => {
  it("renders with label and id", () => {
    render(<Input label="Name" id="name" />);

    const input = screen.getByLabelText("Name");
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("id", "name");
  });

  it("shows required asterisk when required prop is true", () => {
    render(<Input label="Name" id="name" required />);

    // Check if the label contains the asterisk
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("applies error styles and shows error message", () => {
    render(<Input label="Email" id="email" error="Invalid email address" />);

    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveClass("border-red-500");

    const errorMessage = screen.getByText("Invalid email address");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-500");
  });

  it("shows helper text when provided and no error", () => {
    render(
      <Input
        label="Password"
        id="password"
        helperText="Must be at least 8 characters"
      />
    );

    const helperText = screen.getByText("Must be at least 8 characters");
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass("text-gray-500");
  });

  it("prioritizes error message over helper text", () => {
    render(
      <Input
        label="Password"
        id="password"
        helperText="Must be at least 8 characters"
        error="Password is required"
      />
    );

    expect(screen.getByText("Password is required")).toBeInTheDocument();
    expect(
      screen.queryByText("Must be at least 8 characters")
    ).not.toBeInTheDocument();
  });

  it("passes additional props to input element", () => {
    render(
      <Input
        label="Username"
        id="username"
        placeholder="Enter username"
        maxLength={20}
        data-testid="username-input"
      />
    );

    const input = screen.getByLabelText("Username");
    expect(input).toHaveAttribute("placeholder", "Enter username");
    expect(input).toHaveAttribute("maxLength", "20");
    expect(input).toHaveAttribute("data-testid", "username-input");
  });

  it("applies custom className to input element", () => {
    render(<Input label="Test" id="test" className="custom-input-class" />);

    const input = screen.getByLabelText("Test");
    expect(input).toHaveClass("custom-input-class");
  });
});
