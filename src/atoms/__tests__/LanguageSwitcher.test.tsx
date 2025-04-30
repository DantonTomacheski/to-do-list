import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import LanguageSwitcher from "../LanguageSwitcher";

// Create mocks that we can control in the tests
const mockChangeLanguage = vi.fn();
let mockCurrentLanguage = "pt-BR";

// Mock react-i18next with the mock functions
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      get language() {
        return mockCurrentLanguage;
      },
      changeLanguage: mockChangeLanguage.mockImplementation((newLang: string) => {
        mockCurrentLanguage = newLang;
      }),
    },
  }),
}));

describe("LanguageSwitcher", () => {
  it("renders with the current language indicator", () => {
    render(<LanguageSwitcher />);

    const button = screen.getByRole("button", { name: /toggle language/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent("🇧🇷");
    expect(button).toHaveTextContent("PT");
  });

  it("toggles language when clicked", () => {
    // Reset the mocks and language before the test
    mockCurrentLanguage = "pt-BR";
    mockChangeLanguage.mockClear();

    // Initial render with Portuguese
    const { rerender } = render(<LanguageSwitcher />);
    const button = screen.getByRole("button", { name: /toggle language/i });
    expect(button).toHaveTextContent("🇧🇷");
    expect(button).toHaveTextContent("PT");

    // First click should change to English
    fireEvent.click(button);
    
    // Verify that changeLanguage was called correctly
    expect(mockChangeLanguage).toHaveBeenCalledWith("en-US");
    
    // Rerender to pick up the new language state
    rerender(<LanguageSwitcher />);
    expect(button).toHaveTextContent("🇺🇸");
    expect(button).toHaveTextContent("EN");

    // Click again to go back to Portuguese
    fireEvent.click(button);
    
    // Verify that changeLanguage was called with pt-BR
    expect(mockChangeLanguage).toHaveBeenCalledWith("pt-BR");
    
    // Rerender to pick up the change
    rerender(<LanguageSwitcher />);
    expect(button).toHaveTextContent("🇧🇷");
    expect(button).toHaveTextContent("PT");
  });
});
