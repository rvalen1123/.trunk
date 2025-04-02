import React, { useState, useCallback, ReactNode } from 'react';
import AIErrorBoundary from './AIErrorBoundary';
import { Card, CardBody, Button, Spinner } from "@nextui/react";

interface AIServiceWrapperProps {
  children: ReactNode;
  serviceName?: string;
  onError?: (error: Error) => void;
  showLoading?: boolean;
}

/**
 * Wrapper component for AI service components that provides error handling and retry functionality
 * 
 * @param {AIServiceWrapperProps} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
export default function AIServiceWrapper({
  children,
  serviceName = 'AI',
  onError,
  showLoading = false
}: AIServiceWrapperProps) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRIES = 3;

  const handleReset = useCallback(() => {
    if (retryCount < MAX_RETRIES) {
      setIsRetrying(true);
      setRetryCount(prev => prev + 1);
      
      // Simulate retry delay
      setTimeout(() => {
        setIsRetrying(false);
      }, 1500);
    }
  }, [retryCount]);

  const handleError = useCallback((error: Error) => {
    // Log error to monitoring service or analytics
    console.error(`${serviceName} service error:`, error);
    
    // Call the onError callback if provided
    if (onError) {
      onError(error);
    }
  }, [serviceName, onError]);

  if (isRetrying) {
    return (
      <Card className="w-full">
        <CardBody className="flex flex-col items-center justify-center p-8">
          <Spinner size="lg" color="primary" />
          <p className="mt-4">Reconnecting to {serviceName} service...</p>
          <p className="text-sm text-default-400">Attempt {retryCount} of {MAX_RETRIES}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <AIErrorBoundary 
      onReset={handleReset} 
      onError={handleError}
      fallbackComponent={
        retryCount >= MAX_RETRIES ? (
          <Card className="w-full">
            <CardBody className="flex flex-col items-center gap-4 p-6">
              <div className="text-center">
                <h3 className="text-xl font-semibold">{serviceName} Service Unavailable</h3>
                <p className="mt-2 text-default-500">
                  We've tried multiple times but couldn't connect to the {serviceName} service.
                </p>
                <p className="mt-1 text-sm text-default-500">
                  Please try again later or contact support if the problem persists.
                </p>
              </div>
              <Button color="primary" onClick={() => window.location.reload()}>
                Refresh Page
              </Button>
            </CardBody>
          </Card>
        ) : undefined
      }
    >
      {children}
    </AIErrorBoundary>
  );
} 