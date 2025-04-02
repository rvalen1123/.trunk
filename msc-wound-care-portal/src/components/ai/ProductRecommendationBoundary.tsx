import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardBody, CardFooter, Button, Divider } from "@nextui/react";
import { ExclamationTriangleIcon, ArrowPathIcon } from "@heroicons/react/24/solid";
import { ProductRecommendation } from '@/lib/services/ai-ecosystem';

interface ProductRecommendationBoundaryProps {
  children: ReactNode;
  woundType?: string;
  onReset?: () => void;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ProductRecommendationBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Specialized error boundary for product recommendation components
 * 
 * This component displays fallback product recommendations when 
 * the AI service for product recommendations fails
 * 
 * @param {ProductRecommendationBoundaryProps} props - Component props
 * @returns {JSX.Element} - Rendered component
 */
export class ProductRecommendationBoundary extends Component<ProductRecommendationBoundaryProps, ProductRecommendationBoundaryState> {
  // Fallback recommendations based on common wound types
  private fallbackRecommendations: Record<string, ProductRecommendation[]> = {
    'default': [
      {
        productId: 'fb-001',
        productName: 'FallbackDerm Advanced Dressing',
        manufacturer: 'MSC WoundCare',
        description: 'General-purpose hydrocolloid dressing suitable for most wound types',
        rationale: 'Provides a protective barrier while maintaining a moist wound environment',
        confidence: 0.85
      },
      {
        productId: 'fb-002',
        productName: 'StaticHeal Antimicrobial Gel',
        manufacturer: 'MSC WoundCare',
        description: 'Broad-spectrum antimicrobial gel',
        rationale: 'Reduces bacterial load in contaminated wounds',
        confidence: 0.75
      }
    ],
    'pressure': [
      {
        productId: 'fb-003',
        productName: 'PressureGuard Foam Dressing',
        manufacturer: 'MSC WoundCare',
        description: 'Specialized foam dressing for pressure injuries',
        rationale: 'Provides cushioning and reduces pressure on wound site',
        confidence: 0.9
      }
    ],
    'diabetic': [
      {
        productId: 'fb-004',
        productName: 'DiabCare Specialist Dressing',
        manufacturer: 'MSC WoundCare',
        description: 'Dressing designed for diabetic foot ulcers',
        rationale: 'Promotes healing in low-perfusion environments',
        confidence: 0.9
      }
    ],
    'venous': [
      {
        productId: 'fb-005',
        productName: 'VenousFlow Compression System',
        manufacturer: 'MSC WoundCare',
        description: 'Multi-layer compression bandage system',
        rationale: 'Manages edema and improves venous return',
        confidence: 0.85
      }
    ]
  };

  constructor(props: ProductRecommendationBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ProductRecommendationBoundaryState {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Product recommendation service error:', error, errorInfo);
    
    // Call the onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    
    // Call the onReset callback if provided
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  getFallbackRecommendations(): ProductRecommendation[] {
    const { woundType } = this.props;
    
    if (woundType && this.fallbackRecommendations[woundType.toLowerCase()]) {
      return this.fallbackRecommendations[woundType.toLowerCase()];
    }
    
    return this.fallbackRecommendations.default;
  }

  render(): ReactNode {
    if (this.state.hasError) {
      const fallbackRecommendations = this.getFallbackRecommendations();
      
      return (
        <Card className="w-full">
          <CardBody className="p-4">
            <div className="flex items-center gap-2 text-warning mb-4">
              <ExclamationTriangleIcon className="h-5 w-5" />
              <p className="text-sm">
                Unable to connect to our recommendation service. Showing standard recommendations instead.
              </p>
            </div>
            
            <h3 className="text-lg font-semibold">Recommended Products</h3>
            <p className="text-xs text-default-500 mb-4">Static recommendations based on common wound care protocols</p>
            
            <div className="space-y-4">
              {fallbackRecommendations.map((product) => (
                <Card key={product.productId} className="p-2 shadow-sm">
                  <CardBody className="p-3">
                    <h4 className="font-semibold">{product.productName}</h4>
                    <p className="text-xs text-default-500">{product.manufacturer}</p>
                    <p className="text-sm mt-2">{product.description}</p>
                    <Divider className="my-2" />
                    <div className="text-sm">
                      <span className="font-semibold">Why: </span>
                      <span>{product.rationale}</span>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </CardBody>
          <CardFooter className="flex justify-end gap-2 pt-0">
            <Button 
              variant="light" 
              startContent={<ArrowPathIcon className="h-4 w-4" />}
              onClick={this.handleReset}
            >
              Try Again
            </Button>
          </CardFooter>
        </Card>
      );
    }

    return this.props.children;
  }
}

export default ProductRecommendationBoundary; 