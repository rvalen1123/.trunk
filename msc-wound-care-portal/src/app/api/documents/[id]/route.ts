import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { DocumentService } from '@/lib/services/document-service';
import { authOptions } from '@/lib/services/auth-service';

/**
 * GET handler for fetching a specific document by ID
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

    const id = params.id;
    
    // Get the document
    const document = await DocumentService.getDocumentById(id);
    
    if (!document) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    // Check permissions (admin can see all, others can only see their own)
    if (session.user.role !== 'ADMIN' && document.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(document);
  } catch (error) {
    console.error('Error fetching document:', error);
    return NextResponse.json(
      { error: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

/**
 * PUT handler for updating a specific document by ID
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

    const id = params.id;
    
    // Check if document exists and user has permission
    const existingDocument = await DocumentService.getDocumentById(id);
    
    if (!existingDocument) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    // Check permissions (admin can update all, others can only update their own)
    if (session.user.role !== 'ADMIN' && existingDocument.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Parse request body
    const body = await request.json();
    const { title, content, facilityId } = body;

    // Update the document
    const updatedDocument = await DocumentService.updateDocument(id, {
      title,
      content,
      facilityId,
      updatedById: session.user.id,
    });

    return NextResponse.json(updatedDocument);
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      { error: 'Failed to update document' },
      { status: 500 }
    );
  }
}

/**
 * DELETE handler for removing a specific document by ID
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

    const id = params.id;
    
    // Check if document exists and user has permission
    const existingDocument = await DocumentService.getDocumentById(id);
    
    if (!existingDocument) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 });
    }
    
    // Check permissions (admin can delete all, others can only delete their own)
    if (session.user.role !== 'ADMIN' && existingDocument.createdById !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Delete the document
    await DocumentService.deleteDocument(id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      { error: 'Failed to delete document' },
      { status: 500 }
    );
  }
} 