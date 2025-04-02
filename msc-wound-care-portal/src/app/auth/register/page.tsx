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
import { EnvelopeIcon, LockClosedIcon, UserIcon, BuildingOfficeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

/**
 * Registration page component
 * Handles user registration
 * 
 * @returns Registration page component
 */
export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  /**
   * Updates form data state when input changes
   * 
   * @param e - Input change event
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Handles the registration form submission
   * 
   * @param e - Form submission event
   */
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In the real implementation, this will use the API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Registration failed');
      }
      
      // Redirect to login page on success
      router.push("/auth/login?registered=true");
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
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
            <h1 className="text-2xl font-bold text-center">Create an Account</h1>
            <p className="text-sm text-default-500 text-center">
              Join MSC Wound Care Portal
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleRegister} className="flex flex-col gap-4">
            {error && (
              <div className="bg-danger-50 text-danger p-2 rounded text-sm">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Enter your first name"
                name="firstName"
                startContent={<UserIcon className="h-5 w-5 text-default-400" />}
                value={formData.firstName}
                onChange={handleChange}
                isRequired
              />
              <Input
                label="Last Name"
                placeholder="Enter your last name"
                name="lastName"
                startContent={<UserIcon className="h-5 w-5 text-default-400" />}
                value={formData.lastName}
                onChange={handleChange}
                isRequired
              />
            </div>
            
            <Input
              label="Email"
              placeholder="Enter your email"
              type="email"
              name="email"
              startContent={<EnvelopeIcon className="h-5 w-5 text-default-400" />}
              value={formData.email}
              onChange={handleChange}
              isRequired
            />
            
            <Input
              label="Password"
              placeholder="Create a password"
              type="password"
              name="password"
              startContent={<LockClosedIcon className="h-5 w-5 text-default-400" />}
              value={formData.password}
              onChange={handleChange}
              isRequired
            />
            
            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              type="password"
              name="confirmPassword"
              startContent={<LockClosedIcon className="h-5 w-5 text-default-400" />}
              value={formData.confirmPassword}
              onChange={handleChange}
              isRequired
            />
            
            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              isDisabled={isLoading}
              fullWidth
            >
              Create Account
            </Button>
          </form>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col items-center gap-2">
          <p className="text-sm text-default-500">
            Already have an account?{" "}
            <Link href="/auth/login" size="sm">
              Sign in
            </Link>
          </p>
          <p className="text-xs text-default-400">
            © 2025 MSC Wound Care. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
} 