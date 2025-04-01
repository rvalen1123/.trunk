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
} from "@nextui-org/react";
import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
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
            <h1 className="text-2xl font-bold text-center">MSC Wound Care Portal</h1>
            <p className="text-sm text-default-500 text-center">
              Sign in to access your account
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
            <Input
              label="Password"
              placeholder="Enter your password"
              type="password"
              startContent={<LockClosedIcon className="h-5 w-5 text-default-400" />}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />
            <div className="flex justify-end">
              <Link href="#" size="sm">
                Forgot password?
              </Link>
            </div>
            <Button
              type="submit"
              color="primary"
              isLoading={isLoading}
              isDisabled={isLoading}
              fullWidth
            >
              Sign In
            </Button>
          </form>
        </CardBody>
        <Divider />
        <CardFooter className="flex flex-col items-center gap-2">
          <p className="text-sm text-default-500">
            Don't have an account?{" "}
            <Link href="#" size="sm">
              Contact your administrator
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
