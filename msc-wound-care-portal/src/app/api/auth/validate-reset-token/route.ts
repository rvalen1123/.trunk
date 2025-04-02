import { NextRequest, NextResponse } from 'next/server';

/**
 * Validates a password reset token
 * Mocked implementation for demo purposes
 * 
 * @param token - The reset token to validate
 * @returns Whether the token is valid
 */
async function validateToken(token: string): Promise<boolean> {
  // In a real app, verify the token against the database
  // const resetToken = await prisma.passwordResetToken.findUnique({
  //   where: { token },
  // });
  
  // Check if token exists and is not expired
  // if (!resetToken || resetToken.expires < new Date()) {
  //   return false;
  // }
  
  // For demo purposes, assume the token is valid if it's not empty
  return !!token && token.length > 10;
}

/**
 * GET handler for token validation
 * 
 * @param request - Next.js request object
 * @returns Next.js response object
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const token = request.nextUrl.searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      );
    }
    
    const isValid = await validateToken(token);
    
    if (isValid) {
      return NextResponse.json({ success: true, valid: true });
    } else {
      return NextResponse.json(
        { success: true, valid: false, error: 'Invalid or expired token' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Token validation failed:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to validate token' },
      { status: 500 }
    );
  }
} 