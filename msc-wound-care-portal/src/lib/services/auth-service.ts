import { PrismaClient, User, UserRole } from '@prisma/client';
import { compare, hash } from 'bcrypt';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
  parentId?: string | null;
}

interface VerifyCredentialsResult {
  success: boolean;
  user?: Omit<User, 'password'>;
  message?: string;
}

/**
 * Authentication service for handling common auth operations
 */
const AuthService = {
  /**
   * Creates a new user
   * 
   * @param userData - User data to create
   * @returns Created user without password
   */
  async createUser(userData: CreateUserData): Promise<Omit<User, 'password'>> {
    const hashedPassword = await hash(userData.password, 10);
    
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'STAFF',
        parentId: userData.parentId,
      },
    });
    
    // Don't return the password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  /**
   * Verifies user credentials
   * 
   * @param email - User email
   * @param password - User password
   * @returns Result with user data if successful
   */
  async verifyCredentials(email: string, password: string): Promise<VerifyCredentialsResult> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      return { 
        success: false, 
        message: 'Invalid email or password' 
      };
    }
    
    if (!user.active) {
      return { 
        success: false, 
        message: 'Account is deactivated. Please contact an administrator.' 
      };
    }
    
    const passwordMatch = await compare(password, user.password);
    
    if (!passwordMatch) {
      return { 
        success: false, 
        message: 'Invalid email or password' 
      };
    }
    
    // Don't return the password
    const { password: _, ...userWithoutPassword } = user;
    
    return {
      success: true,
      user: userWithoutPassword,
    };
  },
  
  /**
   * Generates password reset token
   * 
   * @param email - User email
   * @returns Success status and message
   */
  async generatePasswordResetToken(email: string): Promise<{ success: boolean; message: string }> {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    
    if (!user) {
      // Don't reveal if user exists or not for security
      return { 
        success: true, 
        message: 'If the email exists in our system, a reset link will be sent.' 
      };
    }
    
    // Generate a random token
    const resetToken = randomBytes(32).toString('hex');
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 24); // 24 hour expiry
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        resetTokenExpiry: tokenExpiry,
      },
    });
    
    // In a real app, you would send an email with the reset link
    // For now, just return success
    return {
      success: true,
      message: 'If the email exists in our system, a reset link will be sent.',
    };
  },
  
  /**
   * Resets a user's password using a token
   * 
   * @param token - Reset token
   * @param newPassword - New password
   * @returns Success status and message
   */
  async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    // Find user with this token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    });
    
    if (!user) {
      return {
        success: false,
        message: 'Invalid or expired reset token',
      };
    }
    
    // Hash the new password
    const hashedPassword = await hash(newPassword, 10);
    
    // Update the user's password and clear the reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        resetTokenExpiry: null,
      },
    });
    
    return {
      success: true,
      message: 'Password has been reset successfully',
    };
  },
  
  /**
   * Updates a user's password
   * 
   * @param userId - User ID
   * @param currentPassword - Current password
   * @param newPassword - New password
   * @returns Success status and message
   */
  async updatePassword(userId: string, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }
    
    // Verify current password
    const passwordMatch = await compare(currentPassword, user.password);
    
    if (!passwordMatch) {
      return {
        success: false,
        message: 'Current password is incorrect',
      };
    }
    
    // Hash and update the new password
    const hashedPassword = await hash(newPassword, 10);
    
    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });
    
    return {
      success: true,
      message: 'Password updated successfully',
    };
  },
};

export default AuthService; 