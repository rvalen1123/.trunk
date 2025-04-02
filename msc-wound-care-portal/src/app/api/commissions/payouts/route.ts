import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { CommissionService } from '@/lib/services/commission-service';
import { authOptions } from '@/lib/services/auth-service';

/**
 * GET handler for fetching commission payouts
 * Supports filtering by userId, period, status and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || undefined;
    const period = searchParams.get('period') || undefined;
    const status = searchParams.get('status') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    // Enforce access restrictions based on role
    const userRole = session.user.role;
    
    // If not an admin or staff, can only see their own payouts
    let filteredUserId = userId;
    if (userRole !== 'ADMIN' && userRole !== 'STAFF') {
      filteredUserId = session.user.id;
    }

    // Fetch payouts
    const payouts = await CommissionService.getPayouts({
      userId: filteredUserId,
      period,
      status,
      limit,
      offset,
    });

    return NextResponse.json({
      payouts,
      pagination: {
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching commission payouts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commission payouts' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a manual commission payout
 * This is typically used by admins to create one-off payouts
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can create manual payouts
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { userId, amount, period, status, metadata } = body;

    // Validate required fields
    if (!userId || !amount || !period) {
      return NextResponse.json(
        { error: 'User ID, amount, and period are required' },
        { status: 400 }
      );
    }

    // Create the payout
    const payout = await CommissionService.createPayout({
      userId,
      amount,
      period,
      status: status || 'PENDING',
      metadata: metadata || { manuallyCreated: true, createdBy: session.user.id },
    });

    return NextResponse.json(payout, { status: 201 });
  } catch (error) {
    console.error('Error creating commission payout:', error);
    return NextResponse.json(
      { error: 'Failed to create commission payout' },
      { status: 500 }
    );
  }
} 