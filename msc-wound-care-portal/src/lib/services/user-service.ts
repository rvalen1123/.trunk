import { PrismaClient, User, UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * Service for user-related operations
 */
export const UserService = {
  /**
   * Get all users with optional filtering
   * 
   * @param options - Filter options
   * @returns List of users
   */
  async getAllUsers(options?: {
    role?: UserRole;
    active?: boolean;
    parentId?: string;
    limit?: number;
    offset?: number;
    searchTerm?: string;
  }): Promise<User[]> {
    const { role, active, parentId, limit = 10, offset = 0, searchTerm } = options || {};
    
    return prisma.user.findMany({
      where: {
        ...(role && { role }),
        ...(typeof active === 'boolean' && { active }),
        ...(parentId && { parentId }),
        ...(searchTerm && {
          OR: [
            { firstName: { contains: searchTerm, mode: 'insensitive' } },
            { lastName: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
          ],
        }),
      },
      include: {
        parent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        facilities: {
          include: {
            facility: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        lastName: 'asc',
      },
    });
  },

  /**
   * Get a user by ID
   * 
   * @param id - User ID
   * @returns User or null if not found
   */
  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id },
      include: {
        parent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        subordinates: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
        facilities: {
          include: {
            facility: true,
          },
        },
        dashboardPreferences: true,
      },
    });
  },

  /**
   * Get a user by email
   * 
   * @param email - User email
   * @returns User or null if not found
   */
  async getUserByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  /**
   * Create a new user
   * 
   * @param data - User data
   * @returns Created user
   */
  async createUser(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    active?: boolean;
    parentId?: string;
  }): Promise<User> {
    // Hash the password
    const hashedPassword = await hash(data.password, 10);
    
    return prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });
  },

  /**
   * Update an existing user
   * 
   * @param id - User ID
   * @param data - Updated user data
   * @returns Updated user
   */
  async updateUser(
    id: string,
    data: {
      email?: string;
      firstName?: string;
      lastName?: string;
      role?: UserRole;
      active?: boolean;
      parentId?: string | null;
    }
  ): Promise<User> {
    return prisma.user.update({
      where: { id },
      data,
      include: {
        parent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  },

  /**
   * Update a user's password
   * 
   * @param id - User ID
   * @param newPassword - New password
   * @returns Updated user
   */
  async updatePassword(id: string, newPassword: string): Promise<User> {
    const hashedPassword = await hash(newPassword, 10);
    
    return prisma.user.update({
      where: { id },
      data: {
        password: hashedPassword,
      },
    });
  },

  /**
   * Delete a user by ID
   * 
   * @param id - User ID
   * @returns Deleted user
   */
  async deleteUser(id: string): Promise<User> {
    return prisma.user.delete({
      where: { id },
    });
  },

  /**
   * Count users with optional filtering
   * 
   * @param options - Filter options
   * @returns Number of users
   */
  async countUsers(options?: {
    role?: UserRole;
    active?: boolean;
    parentId?: string;
    searchTerm?: string;
  }): Promise<number> {
    const { role, active, parentId, searchTerm } = options || {};
    
    return prisma.user.count({
      where: {
        ...(role && { role }),
        ...(typeof active === 'boolean' && { active }),
        ...(parentId && { parentId }),
        ...(searchTerm && {
          OR: [
            { firstName: { contains: searchTerm, mode: 'insensitive' } },
            { lastName: { contains: searchTerm, mode: 'insensitive' } },
            { email: { contains: searchTerm, mode: 'insensitive' } },
          ],
        }),
      },
    });
  },

  /**
   * Add a user to a facility
   * 
   * @param userId - User ID
   * @param facilityId - Facility ID
   * @returns Created facility user relationship
   */
  async addUserToFacility(userId: string, facilityId: string) {
    return prisma.facilityUser.create({
      data: {
        userId,
        facilityId,
      },
      include: {
        facility: true,
        user: true,
      },
    });
  },

  /**
   * Remove a user from a facility
   * 
   * @param userId - User ID
   * @param facilityId - Facility ID
   * @returns Deleted facility user relationship
   */
  async removeUserFromFacility(userId: string, facilityId: string) {
    return prisma.facilityUser.delete({
      where: {
        userId_facilityId: {
          userId,
          facilityId,
        },
      },
    });
  },

  /**
   * Get subordinates (direct reports) for a user
   * 
   * @param userId - User ID
   * @returns List of subordinate users
   */
  async getSubordinates(userId: string): Promise<User[]> {
    return prisma.user.findMany({
      where: {
        parentId: userId,
      },
      orderBy: {
        lastName: 'asc',
      },
    });
  },

  /**
   * Assign a subordinate to a manager/rep
   * 
   * @param subordinateId - Subordinate user ID
   * @param managerId - Manager user ID
   * @returns Updated subordinate user
   */
  async assignSubordinate(subordinateId: string, managerId: string): Promise<User> {
    // Verify manager exists
    const manager = await prisma.user.findUnique({
      where: { id: managerId },
    });
    
    if (!manager) {
      throw new Error('Manager not found');
    }
    
    // Make sure manager has appropriate role
    if (manager.role !== UserRole.ADMIN && manager.role !== UserRole.REP) {
      throw new Error('Only Admins and Reps can have subordinates');
    }
    
    return prisma.user.update({
      where: { id: subordinateId },
      data: {
        parentId: managerId,
      },
      include: {
        parent: true,
      },
    });
  },
}; 