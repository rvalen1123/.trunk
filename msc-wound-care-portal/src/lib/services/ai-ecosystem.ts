/**
 * AI Ecosystem Service
 * 
 * This service provides methods for interacting with the AI Ecosystem API
 * for product recommendations, training assistance, and form completion.
 */

export enum AssistantType {
  GENERAL = 'GENERAL',
  PRODUCT_RECOMMENDATION = 'PRODUCT_RECOMMENDATION',
  TRAINING = 'TRAINING',
  FORM_COMPLETION = 'FORM_COMPLETION'
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  text: string;
  sources?: Array<{
    title: string;
    url: string;
    content: string;
  }>;
  metadata?: Record<string, any>;
}

export interface ProductRecommendation {
  productId: string;
  productName: string;
  manufacturer: string;
  description: string;
  rationale: string;
  confidence: number;
  alternatives?: Array<{
    productId: string;
    productName: string;
    rationale: string;
  }>;
}

export interface FormExtractionResult {
  extractedData: Record<string, any>;
  confidence: number;
  missingFields?: string[];
  notes?: string;
}

export interface MultiFormResult {
  forms: Array<{
    templateType: string;
    extractedData: Record<string, any>;
    confidence: number;
  }>;
  missingInformation?: string[];
  notes?: string;
}

export interface TrainingResponse {
  answer: string;
  sources?: Array<{
    title: string;
    content: string;
    url?: string;
  }>;
  relatedTopics?: string[];
}

export interface ChatSession {
  id: string;
  assistantType: AssistantType;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Service for interacting with the AI Ecosystem API
 */
export class AIEcosystemService {
  private apiUrl: string;
  private apiKey: string;
  
  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }
  
  /**
   * Send a message to the AI assistant and get a response
   */
  async sendMessage(
    messages: ChatMessage[],
    assistantType: AssistantType,
    sessionId?: string,
    context?: Record<string, any>
  ): Promise<{ response: ChatResponse; sessionId: string }> {
    try {
      const response = await fetch(`${this.apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages,
          assistantType,
          sessionId,
          context
        })
      });
      
      if (!response.ok) {
        throw new Error(`AI chat error: ${response.statusText}`);
      }
      
      const data = await response.json();
      return {
        response: data.response,
        sessionId: data.sessionId || sessionId || ''
      };
    } catch (error) {
      console.error('AI chat error:', error);
      throw error;
    }
  }
  
  /**
   * Get product recommendations based on wound description
   */
  async getProductRecommendations(
    woundDescription: string,
    patientInfo?: Record<string, any>
  ): Promise<ProductRecommendation[]> {
    try {
      const response = await fetch(`${this.apiUrl}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          woundDescription,
          patientInfo
        })
      });
      
      if (!response.ok) {
        throw new Error(`Product recommendation error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Product recommendation error:', error);
      throw error;
    }
  }
  
  /**
   * Extract form data from natural language description
   */
  async extractFormData(
    description: string,
    formTemplateId: string
  ): Promise<FormExtractionResult> {
    try {
      const response = await fetch(`${this.apiUrl}/extract-form`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description,
          formTemplateId
        })
      });
      
      if (!response.ok) {
        throw new Error(`Form extraction error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Form extraction error:', error);
      throw error;
    }
  }
  
  /**
   * Complete multiple forms from a single description
   */
  async completeMultipleForms(
    description: string,
    templateTypes: string[],
    manufacturer?: string
  ): Promise<MultiFormResult> {
    try {
      const response = await fetch(`${this.apiUrl}/complete-forms`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description,
          templateTypes,
          manufacturer
        })
      });
      
      if (!response.ok) {
        throw new Error(`Multiple form completion error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Multiple form completion error:', error);
      throw error;
    }
  }
  
  /**
   * Get training information about wound care
   */
  async getTrainingInfo(question: string): Promise<TrainingResponse> {
    try {
      const response = await fetch(`${this.apiUrl}/training`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          question
        })
      });
      
      if (!response.ok) {
        throw new Error(`Training info error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Training info error:', error);
      throw error;
    }
  }
  
  /**
   * Get chat history for the current user
   */
  async getChatHistory(): Promise<ChatSession[]> {
    try {
      const response = await fetch(`${this.apiUrl}/chat-history`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Chat history error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Chat history error:', error);
      throw error;
    }
  }
  
  /**
   * Get a specific chat session
   */
  async getChatSession(sessionId: string): Promise<ChatSession> {
    try {
      const response = await fetch(`${this.apiUrl}/chat-session/${sessionId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Chat session error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Chat session error:', error);
      throw error;
    }
  }
}

// Create a singleton instance with environment variables
// In a real app, these would be loaded from .env
const aiEcosystemService = new AIEcosystemService(
  process.env.NEXT_PUBLIC_AI_ECOSYSTEM_API_URL || '/api/ai-ecosystem',
  process.env.AI_ECOSYSTEM_API_KEY || ''
);

export default aiEcosystemService;