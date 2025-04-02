/**
 * DocuSeal API Service
 * 
 * This service provides methods for interacting with the DocuSeal API
 * for document generation, e-signatures, and template management.
 */

export interface DocuSealTemplate {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  fields: Array<{
    name: string;
    type: string;
    required: boolean;
  }>;
}

export interface DocuSealSubmission {
  id: string;
  formId: string;
  status: 'pending' | 'completed';
  submitters: Array<{
    name: string;
    email: string;
    status: 'pending' | 'completed';
    url: string;
  }>;
  documentUrl?: string;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, any>;
}

export interface DocuSealBuilderToken {
  token: string;
  url: string;
}

/**
 * Service for interacting with DocuSeal API
 */
export class DocuSealService {
  private apiUrl: string;
  private apiKey: string;
  
  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }
  
  /**
   * Get a list of all available templates
   */
  async getTemplates(): Promise<DocuSealTemplate[]> {
    try {
      const response = await fetch(`${this.apiUrl}/templates`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching DocuSeal templates: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching DocuSeal templates:', error);
      throw error;
    }
  }
  
  /**
   * Get details for a specific template
   */
  async getTemplate(templateId: string): Promise<DocuSealTemplate> {
    try {
      const response = await fetch(`${this.apiUrl}/templates/${templateId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching DocuSeal template: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching DocuSeal template ${templateId}:`, error);
      throw error;
    }
  }
  
  /**
   * Create a new template from a PDF URL
   */
  async createTemplateFromUrl(name: string, pdfUrl: string): Promise<DocuSealTemplate> {
    try {
      const response = await fetch(`${this.apiUrl}/templates`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          pdfUrl
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error creating DocuSeal template: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating DocuSeal template:', error);
      throw error;
    }
  }
  
  /**
   * Generate a builder token for form creation
   */
  async generateBuilderToken(config: {
    user_email: string;
    integration_email: string;
    name: string;
    document_urls: string[];
  }): Promise<DocuSealBuilderToken> {
    try {
      const response = await fetch(`${this.apiUrl}/builder-token`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
      });
      
      if (!response.ok) {
        throw new Error(`Error generating DocuSeal builder token: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error generating DocuSeal builder token:', error);
      throw error;
    }
  }
  
  /**
   * Create a simple submission for a single signer
   */
  async createSubmission(formId: string, signerEmail: string): Promise<DocuSealSubmission> {
    try {
      const response = await fetch(`${this.apiUrl}/submissions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formId,
          signerEmail
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error creating DocuSeal submission: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating DocuSeal submission:', error);
      throw error;
    }
  }
  
  /**
   * Create an advanced submission with multiple signers and prefilled data
   */
  async createAdvancedSubmission(
    formId: string,
    submitters: Array<{
      name: string;
      email: string;
      fields?: Record<string, any>;
    }>,
    prefillData?: Record<string, any>,
    metadata?: Record<string, any>
  ): Promise<DocuSealSubmission> {
    try {
      const response = await fetch(`${this.apiUrl}/submissions/advanced`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formId,
          submitters,
          prefillData,
          metadata
        })
      });
      
      if (!response.ok) {
        throw new Error(`Error creating advanced DocuSeal submission: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating advanced DocuSeal submission:', error);
      throw error;
    }
  }
  
  /**
   * Get the status of a submission
   */
  async getSubmissionStatus(submissionId: string): Promise<DocuSealSubmission> {
    try {
      const response = await fetch(`${this.apiUrl}/submissions/${submissionId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching DocuSeal submission status: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching DocuSeal submission status ${submissionId}:`, error);
      throw error;
    }
  }
  
  /**
   * Get the URL for a signed document
   */
  async getSignedDocumentUrl(submissionId: string): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/submissions/${submissionId}/document`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error fetching signed document URL: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error(`Error fetching signed document URL for submission ${submissionId}:`, error);
      throw error;
    }
  }
}

// Create a singleton instance with environment variables
// In a real app, these would be loaded from .env
const docuSealService = new DocuSealService(
  process.env.NEXT_PUBLIC_DOCUSEAL_API_URL || 'https://api.docuseal.co',
  process.env.DOCUSEAL_API_KEY || ''
);

export default docuSealService;