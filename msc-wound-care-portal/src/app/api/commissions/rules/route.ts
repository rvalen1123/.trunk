import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { CommissionService } from '@/lib/services/commission-service';
import { authOptions } from '@/lib/services/auth-service';

/**
 * GET handler for fetching commission rules
 * Supports filtering by active, createdBy, and pagination
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin and staff can view commission rules
    if (session.user.role !== 'ADMIN' && session.user.role !== 'STAFF') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const activeParam = searchParams.get('active');
    const active = activeParam ? activeParam === 'true' : undefined;
    const createdBy = searchParams.get('createdBy') || undefined;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Fetch rules
    const rules = await CommissionService.getAllRules({
      active,
      createdBy,
      limit,
      offset,
    });

    return NextResponse.json({
      rules,
      pagination: {
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching commission rules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commission rules' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new commission rule
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can create commission rules
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { name, rule, active } = body;

    // Validate required fields
    if (!name || !rule) {
      return NextResponse.json(
        { error: 'Name and rule are required' },
        { status: 400 }
      );
    }

    // Create the rule
    const commissionRule = await CommissionService.createRule({
      name,
      rule,
      createdBy: session.user.id,
      active,
    });

    return NextResponse.json(commissionRule, { status: 201 });
  } catch (error) {
    console.error('Error creating commission rule:', error);
    return NextResponse.json(
      { error: 'Failed to create commission rule' },
      { status: 500 }
    );
  }
} 