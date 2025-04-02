"use client";

import React, { useState } from "react";
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
import { EnvelopeIcon, ArrowLeftIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

/**
 * Forgot Password page component
 * Allows users to request a password reset link
 * 
 * @returns Forgot Password page component
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  /**
   * Handles the password reset request submission
   * 
   * @param e - Form submission event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setIsSubmitted(true);
      } else {
        setError(data.error || 'Failed to send reset email. Please try again.');
      }
    } catch (error) {
      console.error('Failed to send reset email:', error);
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-center">Reset Your Password</h1>
            <p className="text-sm text-default-500 text-center">
              {!isSubmitted 
                ? "Enter your email to receive a password reset link" 
                : "Check your email for reset instructions"}
            </p>
          </div>
        </CardHeader>
        <CardBody>
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <Input
                autoFocus
                label="Email"
                placeholder="Enter your email"
                type="email"
                startContent={<EnvelopeIcon className="h-5 w-5 text-default-400" />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                Send Reset Link
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
                We've sent an email to <strong>{email}</strong> with instructions to reset your password.
              </p>
              <p className="text-sm text-default-500 text-center">
                If you don't see it in your inbox, please check your spam folder.
              </p>
            </div>
          )}
        </CardBody>
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
      </Card>
    </div>
  );
} 