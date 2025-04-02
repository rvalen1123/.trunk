import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { CommissionService } from '@/lib/services/commission-service';
import { authOptions } from '@/lib/services/auth-service';

/**
 * POST handler for calculating commissions for a given period
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and staff can calculate commissions
    if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { period } = body;

    // Validate required fields
    if (!period) {
      return NextResponse.json(
        { error: 'Period is required (format: YYYY-MM)' },
        { status: 400 }
      );
    }

    // Validate period format
    const periodRegex = /^\d{4}-\d{2}$/;
    if (!periodRegex.test(period)) {
      return NextResponse.json(
        { error: 'Invalid period format. Use YYYY-MM' },
        { status: 400 }
      );
    }

    // Calculate commissions for the period
    const payouts = await CommissionService.calculateCommissions(period);

    return NextResponse.json({
      success: true,
      payouts,
      message: `Calculated commissions for ${period}`,
      count: payouts.length,
    });
  } catch (error) {
    console.error('Error calculating commissions:', error);
    return NextResponse.json(
      { error: 'Failed to calculate commissions' },
      { status: 500 }
    );
  }
} 