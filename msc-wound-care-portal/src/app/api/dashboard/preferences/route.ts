import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

// Validation schema for widget preference updates
const updatePreferenceSchema = z.object({
  widgetId: z.string(),
  updates: z.object({
    enabled: z.boolean().optional(),
    position: z.number().optional(),
    size: z.enum(['small', 'medium', 'large']).optional(),
    customProps: z.record(z.any()).optional(),
  }),
});

// Validation schema for reordering widgets
const reorderWidgetsSchema = z.object({
  preferences: z.array(z.object({
    widgetId: z.string(),
    position: z.number(),
  })),
});

/**
 * PATCH handler for updating dashboard preferences
 * 
 * @param req - Next.js request object
 * @returns Success/error response
 */
export async function PATCH(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const email = session.user.email;
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: email as string },
      select: {
        id: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Parse and validate request body
    const body = await req.json();
    const validationResult = updatePreferenceSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { widgetId, updates } = validationResult.data;
    
    // Check if preference exists
    const preference = await prisma.dashboardPreference.findFirst({
      where: {
        userId: user.id,
        widgetId,
      },
    });
    
    if (!preference) {
      return NextResponse.json(
        { error: 'Widget preference not found' },
        { status: 404 }
      );
    }
    
    // Update preference
    await prisma.dashboardPreference.update({
      where: { id: preference.id },
      data: updates,
    });
    
    return NextResponse.json({
      success: true,
      message: 'Preference updated successfully',
    });
    
  } catch (error) {
    console.error('Error updating dashboard preferences:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for reordering widgets
 * 
 * @param req - Next.js request object
 * @returns Success/error response
 */
export async function PUT(req: NextRequest) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const email = session.user.email;
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { email: email as string },
      select: {
        id: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Parse and validate request body
    const body = await req.json();
    const validationResult = reorderWidgetsSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { preferences } = validationResult.data;
    
    // Update each preference position in a transaction
    await prisma.$transaction(
      preferences.map(pref => 
        prisma.dashboardPreference.updateMany({
          where: {
            userId: user.id,
            widgetId: pref.widgetId,
          },
          data: {
            position: pref.position,
          },
        })
      )
    );
    
    return NextResponse.json({
      success: true,
      message: 'Widget order updated successfully',
    });
    
  } catch (error) {
    console.error('Error reordering widgets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 