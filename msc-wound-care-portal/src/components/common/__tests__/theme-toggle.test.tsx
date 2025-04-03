import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '../theme-toggle';
import { useTheme } from 'next-themes';

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}));

// Mock useState and useEffect to bypass mounting check and ensure effect runs
const mockSetState = jest.fn();
// const originalReact = jest.requireActual('react'); // Removed as it's implicitly used via jest.requireActual below

// Mock React
jest.mock('react', () => {
  // Get the actual React library
  const original = jest.requireActual('react');
  // Return the mock implementation
  return {
    ...original,
    useState: jest.fn((initialValue) => {
      // If the initial value is specifically `false` (our `mounted` state),
      // return `true` immediately for testing purposes.
      if (initialValue === false) {
        return [true, mockSetState]; // Use the mockSetState defined earlier
      }
      // Otherwise, behave like normal useState for any other potential uses.
      return original.useState(initialValue);
    }),
    useEffect: jest.fn((fn) => {
      // Run the effect immediately in tests
      fn();
    }),
  };
});


describe('ThemeToggle Component', () => {
  const mockSetTheme = jest.fn();

  beforeEach(() => {
    // Reset mocks before each test
    mockSetTheme.mockClear();
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });
    // Ensure mocks for useState/useEffect are reset if needed, though the above setup should handle it.
    (React.useState as jest.Mock).mockImplementation((initialValue) => {
       if (initialValue === false) {
         return [true, mockSetState];
       }
       // Use jest.requireActual to get the real useState behavior for other calls
       const actualUseState = jest.requireActual('react').useState;
       return actualUseState(initialValue);
    });
     (React.useEffect as jest.Mock).mockImplementation((fn) => fn());
  });

  test('renders correctly in light mode and is not checked', () => {
    render(<ThemeToggle />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    // Check the default state based on the mocked theme ('light')
    expect(switchElement).not.toBeChecked();
  });

  test('renders correctly in dark mode and is checked', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });
    render(<ThemeToggle />);
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toBeChecked();
  });

  test('calls setTheme with "dark" when toggled from light mode', () => {
    render(<ThemeToggle />);
    const switchElement = screen.getByRole('switch');
    // Simulate user clicking the switch
    fireEvent.click(switchElement);
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    // When clicking an unchecked switch, the onChange handler should receive checked: true
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  test('calls setTheme with "light" when toggled from dark mode', () => {
    (useTheme as jest.Mock).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });
    render(<ThemeToggle />);
    const switchElement = screen.getByRole('switch');
    // Simulate user clicking the switch
    fireEvent.click(switchElement);
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
    // When clicking a checked switch, the onChange handler should receive checked: false
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  test('applies className prop to the container div', () => {
    const testClassName = 'my-custom-class';
    render(<ThemeToggle className={testClassName} />);
    // Select the container using the data-testid
    const containerElement = screen.getByTestId('theme-toggle-container');
    expect(containerElement).toHaveClass(testClassName);
  });

  // Optional: Test the non-mounted state explicitly if needed,
  // although our mock setup currently bypasses it.
  test('returns null when not mounted (if useState mock is adjusted)', () => {
     // Temporarily override the useState mock for this specific test
     (React.useState as jest.Mock).mockImplementationOnce((initialValue) => {
       if (initialValue === false) {
         return [false, mockSetState]; // Force mounted to false
       }
       const actualUseState = jest.requireActual('react').useState;
       return actualUseState(initialValue);
     });

     const { container } = render(<ThemeToggle />);
     // When not mounted, the component returns null
     expect(container.firstChild).toBeNull();
   });
});
