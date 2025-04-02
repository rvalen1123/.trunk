"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Input,
  Button,
  Divider,
  Link,
  Image,
} from "@heroui/react";
import { LockClosedIcon, ArrowLeftIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Password strength indicator component
 * 
 * @param props - Component props
 * @returns Password strength indicator component
 */
const PasswordStrengthIndicator: React.FC<{ password: string }> = ({ password }) => {
  const calculateStrength = (password: string): { strength: number; text: string; color: string } => {
    if (!password) return { strength: 0, text: "Empty", color: "bg-default-200" };
    
    let strength = 0;
    
    // Check length
    if (password.length >= 8) strength += 1;
    
    // Check for numbers
    if (/\d/.test(password)) strength += 1;
    
    // Check for lowercase
    if (/[a-z]/.test(password)) strength += 1;
    
    // Check for uppercase
    if (/[A-Z]/.test(password)) strength += 1;
    
    // Check for special characters
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // Map strength to text and color
    const strengthMap = [
      { text: "Very Weak", color: "bg-danger" },
      { text: "Weak", color: "bg-danger" },
      { text: "Fair", color: "bg-warning" },
      { text: "Good", color: "bg-success" },
      { text: "Strong", color: "bg-success" },
      { text: "Very Strong", color: "bg-success" },
    ];
    
    return { 
      strength, 
      ...strengthMap[Math.min(strength, strengthMap.length - 1)]
    };
  };
  
  const { strength, text, color } = calculateStrength(password);
  const percentage = Math.min(100, (strength / 5) * 100);
  
  return (
    <div className="mt-2">
      <div className="h-1 w-full bg-default-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${color} transition-all duration-300 ease-in-out`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs mt-1 text-default-500">{text}</p>
    </div>
  );
};

/**
 * Reset Password page component
 * Allows users to set a new password after receiving a reset link
 * 
 * @returns Reset Password page component
 */
export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const [isValidating, setIsValidating] = useState(true);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const tokenParam = searchParams.get('token');
    setToken(tokenParam);
    
    if (tokenParam) {
      async function validateToken() {
        try {
          const response = await fetch(`/api/auth/validate-reset-token?token=${tokenParam}`);
          const data = await response.json();
          
          if (response.ok && data.success && data.valid) {
            setIsValidToken(true);
          } else {
            setIsValidToken(false);
            setError(data.error || 'Invalid or expired token');
          }
        } catch (error) {
          console.error('Failed to validate token:', error);
          setIsValidToken(false);
          setError('Failed to validate token');
        } finally {
          setIsValidating(false);
        }
      }
      
      validateToken();
    } else {
      setIsValidToken(false);
      setIsValidating(false);
    }
  }, [searchParams]);
  
  /**
   * Validates the password
   * 
   * @returns Whether the password is valid
   */
  const validatePassword = (): boolean => {
    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }
    
    if (!/\d/.test(password)) {
      setError("Password must contain at least one number");
      return false;
    }
    
    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return false;
    }
    
    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return false;
    }
    
    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Password must contain at least one special character");
      return false;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    
    return true;
  };
  
  /**
   * Handles the password reset submission
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!validatePassword()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsSubmitted(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Failed to reset password:', error);
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show loading state while validating token
  if (isValidating) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
        <Card className="max-w-md w-full">
          <CardBody>
            <div className="flex flex-col items-center p-8">
              <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <p className="mt-4">Validating your request...</p>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
  
  // Show error if token is invalid
  if (isValidToken === false) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="flex flex-col items-center gap-3 pb-0">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger-100">
              <ExclamationCircleIcon className="h-8 w-8 text-danger" />
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-2xl font-bold text-center">Invalid or Expired Link</h1>
              <p className="text-sm text-default-500 text-center">
                The password reset link is invalid or has expired.
              </p>
            </div>
          </CardHeader>
          <CardBody>
            <div className="flex flex-col items-center gap-4 py-4">
              <p className="text-center">
                Please request a new password reset link.
              </p>
              {error && (
                <div className="text-danger text-sm flex items-center gap-1">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </CardBody>
          <Divider />
          <CardFooter className="flex flex-col items-center gap-2">
            <Button
              color="primary"
              onClick={() => router.push('/auth/forgot-password')}
              fullWidth
            >
              Request New Link
            </Button>
            <Button
              variant="flat"
              startContent={<ArrowLeftIcon className="h-4 w-4" />}
              onClick={() => router.push('/auth/login')}
              fullWidth
              className="mt-2"
            >
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="flex flex-col items-center gap-3 pb-0">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
            <Image
              alt="MSC Wound Care Logo"
              src="/placeholder-logo.png"
              fallbackSrc="https://via.placeholder.com/150?text=MSC"
              width={50}
              height={50}
            />
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-center">
              {!isSubmitted ? "Reset Your Password" : "Password Reset Successful"}
            </h1>
            <p className="text-sm text-default-500 text-center">
              {!isSubmitted 
                ? "Please enter your new password" 
                : "Your password has been successfully reset"}
            </p>
          </div>
        </CardHeader>
        <CardBody>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Input
                  autoFocus
                  label="New Password"
                  placeholder="Enter your new password"
                  type="password"
                  startContent={<LockClosedIcon className="h-5 w-5 text-default-400" />}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  isRequired
                />
                <PasswordStrengthIndicator password={password} />
              </div>
              
              <Input
                label="Confirm Password"
                placeholder="Confirm your new password"
                type="password"
                startContent={<LockClosedIcon className="h-5 w-5 text-default-400" />}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isRequired
              />
              
              {error && (
                <div className="text-danger text-sm flex items-center gap-1">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
              
              <Button
                type="submit"
                color="primary"
                isLoading={isLoading}
                isDisabled={isLoading}
                fullWidth
              >
                Reset Password
              </Button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success-100">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-8 w-8 text-success-500" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-center">
                Your password has been reset successfully.
              </p>
              <p className="text-sm text-default-500 text-center">
                You will be redirected to the login page in a few seconds...
              </p>
            </div>
          )}
        </CardBody>
        {!isSubmitted && (
          <>
            <Divider />
            <CardFooter className="flex flex-col items-center gap-2">
              <Button
                variant="flat"
                startContent={<ArrowLeftIcon className="h-4 w-4" />}
                onClick={() => router.push('/auth/login')}
                fullWidth
              >
                Back to Login
              </Button>
              <p className="text-xs text-default-400 mt-2">
                © 2025 MSC Wound Care. All rights reserved.
              </p>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
} 