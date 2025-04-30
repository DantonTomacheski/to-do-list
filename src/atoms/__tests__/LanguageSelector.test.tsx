import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

// Create a simple mock for the i18n module
const mockI18n = {
  language: "pt-BR",
  changeLanguage: vi.fn(),
};

// Mock the i18n import used by the component
vi.mock("../i18n", () => ({
  __esModule: true,
  default: mockI18n,
}));

// Mock the react-i18next
vi.mock("react-i18next", () => ({
  initReactI18next: {
    type: "3rdParty",
    init: () => null,
  },
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: mockI18n,
  }),
}));

// Import the component after mocks are set up
import LanguageSelector from "../LanguageSelector";

describe("LanguageSelector", () => {
  // Reset the language before each test
  beforeEach(() => {
    mockI18n.language = "pt-BR";
    mockI18n.changeLanguage.mockClear();
  });
  it("renders with the correct language options", () => {
    render(<LanguageSelector />);

    const select = screen.getByRole("combobox");
    expect(select).toBeInTheDocument();

    // Check if it has both language options
    expect(screen.getByText("Português")).toBeInTheDocument();
    expect(screen.getByText("English")).toBeInTheDocument();
  });

  it("has the current language selected", () => {
    render(<LanguageSelector />);

    const select = screen.getByRole("combobox");
    expect(select).toHaveValue("en-US");
  });

  it("applies custom className when provided", () => {
    render(<LanguageSelector className="custom-class" />);

    const container = screen.getByText("selectLanguage").closest("div");
    expect(container).toHaveClass("custom-class");
  });
});
