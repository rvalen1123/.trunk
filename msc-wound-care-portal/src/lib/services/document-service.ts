import { PrismaClient, Document, DocumentType } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Service for document-related operations
 */
export const DocumentService = {
  /**
   * Get all documents with optional filtering
   * 
   * @param options - Filter options
   * @returns List of documents
   */
  async getAllDocuments(options?: {
    facilityId?: string;
    type?: DocumentType;
    createdById?: string;
    limit?: number;
    offset?: number;
  }): Promise<Document[]> {
    const { facilityId, type, createdById, limit = 10, offset = 0 } = options || {};
    
    return prisma.document.findMany({
      where: {
        ...(facilityId && { facilityId }),
        ...(type && { type }),
        ...(createdById && { createdById }),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        facility: {
          select: {
            id: true,
            name: true,
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
   * Get a document by ID
   * 
   * @param id - Document ID
   * @returns Document or null if not found
   */
  async getDocumentById(id: string): Promise<Document | null> {
    return prisma.document.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        facility: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  /**
   * Create a new document
   * 
   * @param data - Document data
   * @returns Created document
   */
  async createDocument(data: {
    title: string;
    type: DocumentType;
    content: any;
    facilityId?: string;
    createdById: string;
    updatedById: string;
  }): Promise<Document> {
    return prisma.document.create({
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        facility: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  /**
   * Update an existing document
   * 
   * @param id - Document ID
   * @param data - Updated document data
   * @returns Updated document
   */
  async updateDocument(
    id: string,
    data: {
      title?: string;
      content?: any;
      facilityId?: string;
      updatedById: string;
    }
  ): Promise<Document> {
    return prisma.document.update({
      where: { id },
      data,
      include: {
        createdBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        facility: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  },

  /**
   * Delete a document by ID
   * 
   * @param id - Document ID
   * @returns Deleted document
   */
  async deleteDocument(id: string): Promise<Document> {
    return prisma.document.delete({
      where: { id },
    });
  },

  /**
   * Count documents with optional filtering
   * 
   * @param options - Filter options
   * @returns Number of documents
   */
  async countDocuments(options?: {
    facilityId?: string;
    type?: DocumentType;
    createdById?: string;
  }): Promise<number> {
    const { facilityId, type, createdById } = options || {};
    
    return prisma.document.count({
      where: {
        ...(facilityId && { facilityId }),
        ...(type && { type }),
        ...(createdById && { createdById }),
      },
    });
  },
}; 