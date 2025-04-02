import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, UserWidgetPreference } from '../types/dashboard';

interface DashboardContextProps {
  role: UserRole;
  widgetPreferences: UserWidgetPreference[];
  updateWidgetPreference: (widgetId: string, updates: Partial<UserWidgetPreference>) => void;
  resetToDefaultLayout: () => void;
  reorderWidgets: (startIndex: number, endIndex: number) => void;
  isLoading: boolean;
  error: string | null;
}

const DashboardContext = createContext<DashboardContextProps | undefined>(undefined);

/**
 * Dashboard Context Provider component
 * 
 * @param props - Component props
 * @returns Dashboard Context Provider component
 */
export const DashboardProvider: React.FC<{ 
  children: React.ReactNode;
  userId?: string; // Optional for backward compatibility
  role?: UserRole; // Optional for backward compatibility
}> = ({ children }) => {
  const [widgetPreferences, setWidgetPreferences] = useState<UserWidgetPreference[]>([]);
  const [role, setRole] = useState<UserRole>('STAFF');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch widget preferences from API
  useEffect(() => {
    const fetchWidgets = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/dashboard/widgets');
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard widgets');
        }
        
        const data = await response.json();
        
        setRole(data.role || 'STAFF');
        setWidgetPreferences(data.preferences || []);
      } catch (err) {
        console.error('Error fetching dashboard widgets:', err);
        setError('Failed to load dashboard. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWidgets();
  }, []);

  /**
   * Updates preferences for a specific widget
   * 
   * @param widgetId - Widget ID
   * @param updates - Partial updates to widget preferences
   */
  const updateWidgetPreference = async (widgetId: string, updates: Partial<UserWidgetPreference>) => {
    // Optimistically update UI
    setWidgetPreferences(prevPreferences => 
      prevPreferences.map(pref => 
        pref.widgetId === widgetId 
          ? { ...pref, ...updates } 
          : pref
      )
    );
    
    // Send update to API
    try {
      const response = await fetch('/api/dashboard/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          widgetId,
          updates,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update widget preference');
      }
    } catch (err) {
      console.error('Error updating widget preference:', err);
      // Revert the optimistic update if there's an error
      // This would need to be implemented with more sophisticated state tracking
      setError('Failed to update widget. Please try again.');
    }
  };

  /**
   * Resets layout to default for current role
   */
  const resetToDefaultLayout = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/dashboard/preferences/reset', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to reset dashboard layout');
      }
      
      // Refetch widgets after reset
      const widgetsResponse = await fetch('/api/dashboard/widgets');
      
      if (!widgetsResponse.ok) {
        throw new Error('Failed to fetch updated dashboard widgets');
      }
      
      const data = await widgetsResponse.json();
      setWidgetPreferences(data.preferences || []);
    } catch (err) {
      console.error('Error resetting dashboard layout:', err);
      setError('Failed to reset dashboard. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reorders widgets (drag and drop)
   * 
   * @param startIndex - Starting position
   * @param endIndex - Ending position
   */
  const reorderWidgets = async (startIndex: number, endIndex: number) => {
    // Create a copy of current preferences
    const result = Array.from(widgetPreferences);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    // Update positions
    const updatedPreferences = result.map((pref, index) => ({
      ...pref,
      position: index,
    }));
    
    // Optimistically update UI
    setWidgetPreferences(updatedPreferences);
    
    // Send update to API
    try {
      const response = await fetch('/api/dashboard/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preferences: updatedPreferences.map(pref => ({
            widgetId: pref.widgetId,
            position: pref.position,
          })),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update widget order');
      }
    } catch (err) {
      console.error('Error reordering widgets:', err);
      setError('Failed to update widget order. Please try again.');
    }
  };

  return (
    <DashboardContext.Provider
      value={{
        role,
        widgetPreferences,
        updateWidgetPreference,
        resetToDefaultLayout,
        reorderWidgets,
        isLoading,
        error,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

/**
 * Hook to use dashboard context
 * 
 * @returns Dashboard context
 */
export const useDashboard = (): DashboardContextProps => {
  const context = useContext(DashboardContext);
  
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  
  return context;
}; 