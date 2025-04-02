import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardBody, CardFooter, Button } from "@nextui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";

interface AIErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface AIErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary specifically designed for AI service failures
 * 
 * This component catches errors in the component tree and displays a fallback UI
 * when AI services encounter errors, allowing the user to retry or continue
 * 
 * @param {AIErrorBoundaryProps} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
export class AIErrorBoundary extends Component<AIErrorBoundaryProps, AIErrorBoundaryState> {
  constructor(props: AIErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): AIErrorBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('AI service error:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    
    // Call the onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Display custom fallback component if provided
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      // Default fallback UI for AI service errors
      return (
        <Card className="w-full">
          <CardBody className="flex flex-col items-center gap-4 p-6">
            <div className="rounded-full bg-warning-100 p-4">
              <ExclamationTriangleIcon className="h-8 w-8 text-warning" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold">AI Service Unavailable</h3>
              <p className="mt-2 text-default-500">
                The AI service is currently unavailable. This could be due to high demand or a temporary service disruption.
              </p>
              <p className="mt-1 text-sm text-default-400">
                Error: {this.state.error?.message || 'Unknown error'}
              </p>
            </div>
          </CardBody>
          <CardFooter className="flex justify-center gap-2 pt-0">
            <Button color="primary" onClick={this.handleReset}>
              Try Again
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default AIErrorBoundary; 