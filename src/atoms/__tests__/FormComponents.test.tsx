
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { 
  FieldLabel, 
  InputBase, 
  TextareaBase, 
  DropdownBtn, 
  DateBtn,
  PrimaryCTA 
} from '../FormComponents';

describe('FormComponents', () => {
  // FieldLabel Component Tests
  describe('FieldLabel', () => {
    it('renders correctly with children', () => {
      render(<FieldLabel htmlFor="test">Label Text</FieldLabel>);
      
      const label = screen.getByText('Label Text');
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute('for', 'test');
    });

    it('shows required asterisk when required prop is true', () => {
      render(<FieldLabel htmlFor="test" required>Required Field</FieldLabel>);
      
      expect(screen.getByText('*')).toBeInTheDocument();
      const label = screen.getByText('Required Field');
      expect(label.closest('label')).toHaveAttribute('aria-required', 'true');
    });
  });

  // InputBase Component Tests
  describe('InputBase', () => {
    it('renders correctly with default props', () => {
      render(<InputBase placeholder="Enter text" />);
      
      const input = screen.getByPlaceholderText('Enter text');
      expect(input).toBeInTheDocument();
      expect(input).toHaveClass('border-gray-200');
    });

    it('shows error message when error prop is provided', () => {
      render(<InputBase error="This field is required" />);
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByText('This field is required')).toHaveClass('text-red-500');
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveClass('border-red-500');
    });

    it('passes props to input element', () => {
      render(
        <InputBase 
          data-testid="test-input" 
          placeholder="Test Input" 
          maxLength={10} 
        />
      );
      
      const input = screen.getByTestId('test-input');
      expect(input).toHaveAttribute('placeholder', 'Test Input');
      expect(input).toHaveAttribute('maxLength', '10');
    });
  });

  // TextareaBase Component Tests
  describe('TextareaBase', () => {
    it('renders correctly with default props', () => {
      render(<TextareaBase placeholder="Enter text" />);
      
      const textarea = screen.getByPlaceholderText('Enter text');
      expect(textarea).toBeInTheDocument();
      expect(textarea).toHaveClass('border-gray-200');
      expect(textarea).toHaveClass('resize-none');
    });

    it('shows error message when error prop is provided', () => {
      render(<TextareaBase error="This field is required" />);
      
      expect(screen.getByText('This field is required')).toBeInTheDocument();
      expect(screen.getByText('This field is required')).toHaveClass('text-red-500');
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveClass('border-red-500');
    });

    it('shows character count when provided', () => {
      render(
        <TextareaBase 
          characterCount={10} 
          maxLength={100} 
        />
      );
      
      expect(screen.getByText('10/100')).toBeInTheDocument();
    });

    it('highlights character count when near limit', () => {
      render(
        <TextareaBase 
          characterCount={95} 
          maxLength={100} 
        />
      );
      
      const count = screen.getByText('95/100');
      expect(count).toBeInTheDocument();
      expect(count).toHaveClass('text-orange-500');
    });
  });

  // DropdownBtn Component Tests
  describe('DropdownBtn', () => {
    it('renders correctly with label', () => {
      const handleClick = vi.fn();
      render(
        <DropdownBtn 
          label="Select an option" 
          isOpen={false} 
          onClick={handleClick} 
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Select an option');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('shows dropdown icon and transforms it when open', () => {
      const handleClick = vi.fn();
      const { rerender } = render(
        <DropdownBtn 
          label="Select an option" 
          isOpen={false} 
          onClick={handleClick} 
        />
      );
      
      const icon = document.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).not.toHaveClass('rotate-180');
      
      rerender(
        <DropdownBtn 
          label="Select an option" 
          isOpen={true} 
          onClick={handleClick} 
        />
      );
      
      expect(icon).toHaveClass('rotate-180');
      expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
    });

    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(
        <DropdownBtn 
          label="Select an option" 
          isOpen={false} 
          onClick={handleClick} 
        />
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows error when provided', () => {
      const handleClick = vi.fn();
      render(
        <DropdownBtn 
          label="Select an option" 
          isOpen={false} 
          onClick={handleClick} 
          error="Please select an option"
        />
      );
      
      expect(screen.getByText('Please select an option')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveClass('border-red-500');
    });
  });

  // DateBtn Component Tests
  describe('DateBtn', () => {
    it('renders correctly with placeholder when date is null', () => {
      const handleClick = vi.fn();
      render(
        <DateBtn 
          date={null} 
          onClick={handleClick} 
          placeholder="Select a date" 
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Select a date');
      expect(button.querySelector('span')).toHaveClass('text-gray-400');
    });

    it('displays formatted date when date is provided', () => {
      const handleClick = vi.fn();
      const testDate = "2025-04-30";
      render(
        <DateBtn 
          date={testDate} 
          onClick={handleClick} 
          placeholder="Select a date" 
        />
      );
      
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent(testDate);
      expect(button.querySelector('span')).toHaveClass('text-gray-800');
    });

    it('calls onClick when clicked', () => {
      const handleClick = vi.fn();
      render(
        <DateBtn 
          date={null} 
          onClick={handleClick} 
          placeholder="Select a date" 
        />
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('shows error when provided', () => {
      const handleClick = vi.fn();
      render(
        <DateBtn 
          date={null} 
          onClick={handleClick} 
          placeholder="Select a date" 
          error="Date is required"
        />
      );
      
      expect(screen.getByText('Date is required')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveClass('border-red-500');
    });
  });

  // PrimaryCTA Component Tests
  describe('PrimaryCTA', () => {
    it('renders correctly with children', () => {
      render(<PrimaryCTA>Submit</PrimaryCTA>);
      
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Submit');
      expect(button).toHaveClass('bg-purple-600');
      expect(button).toHaveClass('text-white');
    });

    it('disables button and shows loading state when isLoading is true', () => {
      render(<PrimaryCTA isLoading>Submit</PrimaryCTA>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50');
      expect(button).toHaveClass('cursor-not-allowed');
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(document.querySelector('svg.animate-spin')).toBeInTheDocument();
    });

    it('disables button when disabled prop is provided', () => {
      render(<PrimaryCTA disabled>Submit</PrimaryCTA>);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('opacity-50');
      expect(button).toHaveClass('cursor-not-allowed');
    });

    it('passes additional props to button element', () => {
      const handleClick = vi.fn();
      render(
        <PrimaryCTA 
          onClick={handleClick} 
          data-testid="submit-button"
          type="submit"
        >
          Submit
        </PrimaryCTA>
      );
      
      const button = screen.getByTestId('submit-button');
      expect(button).toHaveAttribute('type', 'submit');
      
      fireEvent.click(button);
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });
});
