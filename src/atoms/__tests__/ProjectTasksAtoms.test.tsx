
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { 
  BackBtn, 
  NotifBell, 
  PageTitle,
  DayChip,
  StatusChip,
  ClockIcon,
  Badge,
  FabAdd,
  getStatusColor
} from '../ProjectTasksAtoms';

// Mock react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ to, className, children, 'aria-label': ariaLabel }: {
    to: string;
    className?: string;
    children: React.ReactNode;
    'aria-label'?: string;
  }) => (
    <a href={to} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  )
}));

describe('ProjectTasksAtoms', () => {
  // BackBtn Component Tests
  describe('BackBtn', () => {
    it('renders correctly with link to specified path', () => {
      render(<BackBtn to="/dashboard" />);
      
      const backButton = screen.getByLabelText('Go back');
      expect(backButton).toBeInTheDocument();
      expect(backButton).toHaveAttribute('href', '/dashboard');
      
      // Check for SVG icon
      const svg = backButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  // NotifBell Component Tests
  describe('NotifBell', () => {
    it('renders correctly with bell icon', () => {
      render(<NotifBell />);
      
      const bellButton = screen.getByLabelText('Notifications');
      expect(bellButton).toBeInTheDocument();
      
      // Check for SVG icon
      const svg = bellButton.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  // PageTitle Component Tests
  describe('PageTitle', () => {
    it('renders with the provided title', () => {
      render(<PageTitle title="Project Tasks" />);
      
      const title = screen.getByText('Project Tasks');
      expect(title).toBeInTheDocument();
      expect(title.tagName).toBe('H1');
      expect(title).toHaveAttribute('id', 'projectTitle');
    });
  });

  // DayChip Component Tests
  describe('DayChip', () => {
    const mockDate = new Date(2025, 3, 15); // April 15, 2025
    
    it('renders correctly with date information', () => {
      const handleClick = vi.fn();
      render(
        <DayChip 
          date={mockDate} 
          isActive={false} 
          onClick={handleClick}
        />
      );
      
      // Should display day name (short format)
      expect(screen.getByText(/Tue/i)).toBeInTheDocument();
      
      // Should display day number
      expect(screen.getByText('15')).toBeInTheDocument();
    });

    it('applies active styling when isActive is true', () => {
      const handleClick = vi.fn();
      render(
        <DayChip 
          date={mockDate} 
          isActive={true} 
          onClick={handleClick}
        />
      );
      
      const chip = screen.getByRole('button');
      expect(chip).toHaveClass('bg-purple-600');
      expect(chip).toHaveClass('text-white');
      expect(chip).toHaveClass('scale-105');
    });

    it('applies today indicator when date is today', () => {
      const today = new Date();
      const handleClick = vi.fn();
      render(
        <DayChip 
          date={today} 
          isActive={false} 
          onClick={handleClick}
        />
      );
      
      const chip = screen.getByRole('button');
      expect(chip).toHaveClass('border');
      expect(chip).toHaveClass('border-purple-300');
    });

    it('calls onClick handler when clicked', () => {
      const handleClick = vi.fn();
      render(
        <DayChip 
          date={mockDate} 
          isActive={false} 
          onClick={handleClick}
        />
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // StatusChip Component Tests
  describe('StatusChip', () => {
    it('renders with the status text', () => {
      const handleClick = vi.fn();
      render(
        <StatusChip 
          status="To-do" 
          isActive={false} 
          onClick={handleClick}
        />
      );
      
      expect(screen.getByText('To-do')).toBeInTheDocument();
    });

    it('applies active styling when isActive is true', () => {
      const handleClick = vi.fn();
      render(
        <StatusChip 
          status="In Progress" 
          isActive={true} 
          onClick={handleClick}
        />
      );
      
      const chip = screen.getByRole('button');
      expect(chip).toHaveClass('bg-purple-600');
      expect(chip).toHaveClass('text-white');
    });

    it('applies inactive styling when isActive is false', () => {
      const handleClick = vi.fn();
      render(
        <StatusChip 
          status="Done" 
          isActive={false} 
          onClick={handleClick}
        />
      );
      
      const chip = screen.getByRole('button');
      expect(chip).toHaveClass('bg-gray-100');
      expect(chip).toHaveClass('text-gray-700');
    });

    it('calls onClick handler when clicked', () => {
      const handleClick = vi.fn();
      render(
        <StatusChip 
          status="All" 
          isActive={false} 
          onClick={handleClick}
        />
      );
      
      fireEvent.click(screen.getByRole('button'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // ClockIcon Component Tests
  describe('ClockIcon', () => {
    it('renders the clock icon correctly', () => {
      const { container } = render(<ClockIcon />);
      
      // Find the SVG element directly in the container
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass('text-purple-600/70');
    });
  });

  // Badge Component Tests
  describe('Badge', () => {
    it('renders with correct status text', () => {
      render(<Badge status="To-do" />);
      expect(screen.getByText('To-do')).toBeInTheDocument();
    });

    it('applies correct color based on status', () => {
      const { rerender } = render(<Badge status="To-do" />);
      expect(screen.getByText('To-do')).toHaveClass('bg-blue-100');
      expect(screen.getByText('To-do')).toHaveClass('text-blue-800');
      
      rerender(<Badge status="In Progress" />);
      expect(screen.getByText('In Progress')).toHaveClass('bg-yellow-100');
      expect(screen.getByText('In Progress')).toHaveClass('text-yellow-800');
      
      rerender(<Badge status="Done" />);
      expect(screen.getByText('Done')).toHaveClass('bg-green-100');
      expect(screen.getByText('Done')).toHaveClass('text-green-800');
    });
  });

  // FabAdd Component Tests
  describe('FabAdd', () => {
    it('renders the floating action button correctly', () => {
      const handleClick = vi.fn();
      render(<FabAdd onClick={handleClick} />);
      
      const button = screen.getByLabelText('Add new task');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('bg-purple-600');
      expect(button).toHaveClass('rounded-full');
      
      // Check for SVG icon
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('calls onClick handler when clicked', () => {
      const handleClick = vi.fn();
      render(<FabAdd onClick={handleClick} />);
      
      fireEvent.click(screen.getByLabelText('Add new task'));
      expect(handleClick).toHaveBeenCalledTimes(1);
    });
  });

  // getStatusColor Function Tests
  describe('getStatusColor', () => {
    it('returns correct color classes for each status', () => {
      expect(getStatusColor('To-do')).toBe('bg-blue-100 text-blue-800');
      expect(getStatusColor('In Progress')).toBe('bg-yellow-100 text-yellow-800');
      expect(getStatusColor('Done')).toBe('bg-green-100 text-green-800');
    });
  });
});
