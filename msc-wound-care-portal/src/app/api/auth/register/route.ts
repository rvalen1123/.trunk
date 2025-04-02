import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Validation schema for registration
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
});

/**
 * POST handler for user registration
 * 
 * @param req - Next.js request object
 * @returns NextResponse with success/error
 */
export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validationResult = registerSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { success: false, message: 'Validation failed', errors: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { email, password, firstName, lastName } = validationResult.data;
    
    // Check if user with email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    // Hash password
    const hashedPassword = await hash(password, 10);
    
    // Create user with STAFF role by default
    // In a real app, you might want to verify email or have admin approve users
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'STAFF', // Default role
      },
    });
    
    // Don't return the password in the response
    const { password: _, ...userWithoutPassword } = newUser;
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'User registered successfully', 
        user: userWithoutPassword 
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
} 