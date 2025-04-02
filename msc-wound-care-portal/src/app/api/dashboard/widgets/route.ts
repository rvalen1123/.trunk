import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { PrismaClient } from '@prisma/client';
import { getWidgetsForRole } from '@/lib/dashboard/widget-registry';

const prisma = new PrismaClient();

/**
 * GET handler for dashboard widgets
 * Returns widgets based on user's role
 * 
 * @param req - Next.js request object 
 * @returns Dashboard widgets data
 */
export async function GET(req: NextRequest) {
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
    
    // Get user from database to check role
    const user = await prisma.user.findUnique({
      where: { email: email as string },
      select: {
        id: true,
        role: true,
      },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Get widgets based on role
    const availableWidgets = getWidgetsForRole(user.role);
    
    // Get user's widget preferences
    const userPreferences = await prisma.dashboardPreference.findMany({
      where: { userId: user.id },
    });
    
    // If user has no preferences yet, create default ones
    if (userPreferences.length === 0) {
      const defaultPreferences = availableWidgets.map((widget, index) => ({
        userId: user.id,
        widgetId: widget.id,
        enabled: true,
        position: widget.defaultPosition || index,
        size: widget.defaultSize,
      }));
      
      // Insert default preferences
      await prisma.dashboardPreference.createMany({
        data: defaultPreferences,
      });
      
      // Return default widgets
      return NextResponse.json({
        widgets: availableWidgets,
        preferences: defaultPreferences,
      });
    }
    
    // Map user preferences to widgets
    const widgetPreferences = userPreferences.map(pref => {
      const widget = availableWidgets.find(w => w.id === pref.widgetId);
      
      return {
        ...pref,
        widget,
      };
    }).filter(item => item.widget); // Only return preferences for valid widgets
    
    return NextResponse.json({
      widgets: availableWidgets,
      preferences: widgetPreferences,
    });
    
  } catch (error) {
    console.error('Error fetching dashboard widgets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 