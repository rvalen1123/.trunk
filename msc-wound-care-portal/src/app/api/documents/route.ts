import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { DocumentService } from '@/lib/services/document-service';
import { authOptions } from '@/lib/services/auth-service';
import { DocumentType } from '@prisma/client';

/**
 * GET handler for fetching documents
 * Supports filtering by facilityId, type, and pagination
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
    const facilityId = searchParams.get('facilityId') || undefined;
    const type = (searchParams.get('type') as DocumentType) || undefined;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);
    
    // Get documents based on user role
    const userId = session.user.id;
    const userRole = session.user.role;

    // For non-admin roles, enforce viewing restrictions
    // Admin can see all documents
    const createdById = userRole !== 'ADMIN' ? userId : undefined;

    // Fetch documents and total count in parallel
    const [documents, total] = await Promise.all([
      DocumentService.getAllDocuments({
        facilityId,
        type,
        createdById,
        limit,
        offset,
      }),
      DocumentService.countDocuments({
        facilityId,
        type,
        createdById,
      }),
    ]);

    return NextResponse.json({
      documents,
      pagination: {
        total,
        limit,
        offset,
      },
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

/**
 * POST handler for creating a new document
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { title, type, content, facilityId } = body;

    // Validate required fields
    if (!title || !type || !content) {
      return NextResponse.json(
        { error: 'Title, type, and content are required' },
        { status: 400 }
      );
    }

    // Create the document
    const document = await DocumentService.createDocument({
      title,
      type: type as DocumentType,
      content,
      facilityId,
      createdById: session.user.id,
      updatedById: session.user.id,
    });

    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { error: 'Failed to create document' },
      { status: 500 }
    );
  }
} 