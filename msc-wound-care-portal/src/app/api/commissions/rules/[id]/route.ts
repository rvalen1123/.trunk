import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { CommissionService } from '@/lib/services/commission-service';
import { authOptions } from '@/lib/services/auth-service';

/**
 * GET handler for fetching a specific commission rule by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const id = params.id;
    
    // Get the rule
    const rule = await CommissionService.getRuleById(id);
    
    if (!rule) {
      return NextResponse.json({ error: 'Commission rule not found' }, { status: 404 });
    }

    return NextResponse.json(rule);
  } catch (error) {
    console.error('Error fetching commission rule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch commission rule' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating a specific commission rule by ID
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can update commission rules
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const id = params.id;
    
    // Check if rule exists
    const existingRule = await CommissionService.getRuleById(id);
    
    if (!existingRule) {
      return NextResponse.json({ error: 'Commission rule not found' }, { status: 404 });
    }

    // Parse request body
    const body = await request.json();
    const { name, rule, active } = body;

    // Update the rule
    const updatedRule = await CommissionService.updateRule(id, {
      name,
      rule,
      active,
    });

    return NextResponse.json(updatedRule);
  } catch (error) {
    console.error('Error updating commission rule:', error);
    return NextResponse.json(
      { error: 'Failed to update commission rule' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing a specific commission rule by ID
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admin can delete commission rules
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const id = params.id;
    
    // Check if rule exists
    const existingRule = await CommissionService.getRuleById(id);
    
    if (!existingRule) {
      return NextResponse.json({ error: 'Commission rule not found' }, { status: 404 });
    }

    // Delete the rule
    await CommissionService.deleteRule(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting commission rule:', error);
    return NextResponse.json(
      { error: 'Failed to delete commission rule' },
      { status: 500 }
    );
  }
} 