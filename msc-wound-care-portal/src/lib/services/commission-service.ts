import { PrismaClient, CommissionRule, CommissionPayout, Order, User, UserRole } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

const prisma = new PrismaClient();

/**
 * Service for commission-related operations
 */
export const CommissionService = {
  /**
   * Get all commission rules
   * 
   * @param options - Filter options
   * @returns List of commission rules
   */
  async getAllRules(options?: {
    active?: boolean;
    createdBy?: string;
    limit?: number;
    offset?: number;
  }): Promise<CommissionRule[]> {
    const { active, createdBy, limit = 10, offset = 0 } = options || {};
    
    return prisma.commissionRule.findMany({
      where: {
        ...(typeof active === 'boolean' && { active }),
        ...(createdBy && { createdBy }),
      },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Get a commission rule by ID
   * 
   * @param id - Rule ID
   * @returns Commission rule or null if not found
   */
  async getRuleById(id: string): Promise<CommissionRule | null> {
    return prisma.commissionRule.findUnique({
      where: { id },
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  },

  /**
   * Create a new commission rule
   * 
   * @param data - Rule data
   * @returns Created rule
   */
  async createRule(data: {
    name: string;
    rule: any;
    createdBy: string;
    active?: boolean;
  }): Promise<CommissionRule> {
    return prisma.commissionRule.create({
      data,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  },

  /**
   * Update an existing commission rule
   * 
   * @param id - Rule ID
   * @param data - Updated rule data
   * @returns Updated rule
   */
  async updateRule(
    id: string,
    data: {
      name?: string;
      rule?: any;
      active?: boolean;
    }
  ): Promise<CommissionRule> {
    return prisma.commissionRule.update({
      where: { id },
      data,
      include: {
        creator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  },

  /**
   * Delete a commission rule by ID
   * 
   * @param id - Rule ID
   * @returns Deleted rule
   */
  async deleteRule(id: string): Promise<CommissionRule> {
    return prisma.commissionRule.delete({
      where: { id },
    });
  },

  /**
   * Get commission payouts with optional filtering
   * 
   * @param options - Filter options
   * @returns List of commission payouts
   */
  async getPayouts(options?: {
    userId?: string;
    period?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<CommissionPayout[]> {
    const { userId, period, status, limit = 10, offset = 0 } = options || {};
    
    return prisma.commissionPayout.findMany({
      where: {
        ...(userId && { userId }),
        ...(period && { period }),
        ...(status && { status }),
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc',
      },
    });
  },

  /**
   * Create a new commission payout
   * 
   * @param data - Payout data
   * @returns Created payout
   */
  async createPayout(data: {
    userId: string;
    amount: Decimal | number;
    period: string;
    status: string;
    metadata?: any;
  }): Promise<CommissionPayout> {
    // Convert number to Decimal if needed
    const amount = typeof data.amount === 'number' 
      ? new Decimal(data.amount) 
      : data.amount;

    return prisma.commissionPayout.create({
      data: {
        ...data,
        amount,
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });
  },

  /**
   * Calculate commissions for a period
   * This is a complex operation that involves:
   * 1. Finding all applicable orders in the period
   * 2. Determining the commission hierarchy
   * 3. Applying commission rules
   * 4. Creating commission payouts
   * 
   * @param period - Period to calculate (e.g., "2025-04")
   * @returns Created payouts
   */
  async calculateCommissions(period: string): Promise<CommissionPayout[]> {
    // Start a transaction
    return prisma.$transaction(async (tx) => {
      // 1. Get all orders in the period with a status of DELIVERED
      const startDate = new Date(`${period}-01T00:00:00Z`);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);
      
      const orders = await tx.order.findMany({
        where: {
          status: 'DELIVERED',
          createdAt: {
            gte: startDate,
            lt: endDate,
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          user: true,
        },
      });
      
      // 2. Get all active commission rules
      const rules = await tx.commissionRule.findMany({
        where: { active: true },
      });
      
      // 3. Calculate commissions for each rep
      const commissionByUser: Record<string, number> = {};
      
      // Process each order
      for (const order of orders) {
        // Get the rep who placed the order
        const rep = order.user;
        
        // Skip if not a rep or sub-rep
        if (rep.role !== UserRole.REP && rep.role !== UserRole.SUB_REP) {
          continue;
        }
        
        // Calculate commission for this order
        const orderTotal = Number(order.total);
        let commissionRate = 0.05; // Default 5%
        
        // Apply any matching rules (in a real app, this would be more sophisticated)
        for (const rule of rules) {
          const ruleConfig = rule.rule as any;
          if (ruleConfig.default_rate) {
            commissionRate = ruleConfig.default_rate;
          }
          
          // Product-specific rates could be applied here
        }
        
        // Calculate commission for this rep
        const commission = orderTotal * commissionRate;
        commissionByUser[rep.id] = (commissionByUser[rep.id] || 0) + commission;
        
        // If this is a sub-rep, allocate some commission to their parent rep
        if (rep.role === UserRole.SUB_REP && rep.parentId) {
          const parentCommission = commission * 0.2; // Parent gets 20% of sub-rep's commission
          commissionByUser[rep.parentId] = (commissionByUser[rep.parentId] || 0) + parentCommission;
        }
      }
      
      // 4. Create commission payouts
      const payouts: CommissionPayout[] = [];
      
      for (const [userId, amount] of Object.entries(commissionByUser)) {
        if (amount > 0) {
          const payout = await tx.commissionPayout.create({
            data: {
              userId,
              amount: new Decimal(amount.toFixed(2)),
              period,
              status: 'PENDING',
              metadata: { calculatedAt: new Date() },
            },
            include: {
              user: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                },
              },
            },
          });
          
          payouts.push(payout);
        }
      }
      
      return payouts;
    });
  },
}; 