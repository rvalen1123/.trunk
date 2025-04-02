/**
 * User role definitions
 */
export type UserRole = 'Admin' | 'Staff' | 'Rep' | 'Sub-rep';

/**
 * Dashboard widget interface
 */
export interface DashboardWidget {
  id: string;
  name: string;
  description: string;
  component: React.ComponentType<any>;
  defaultProps?: Record<string, any>;
  allowedRoles: UserRole[];
  defaultSize: 'small' | 'medium' | 'large';
  defaultPosition?: number;
}

/**
 * User widget preference
 */
export interface UserWidgetPreference {
  widgetId: string;
  enabled: boolean;
  position: number;
  size: 'small' | 'medium' | 'large';
  customProps?: Record<string, any>;
}

/**
 * Dashboard configuration for a user
 */
export interface UserDashboardConfig {
  userId: string;
  widgets: UserWidgetPreference[];
} 