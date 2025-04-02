import React, { useState } from 'react';
import { Card, CardBody, CardHeader, Button, Divider, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import { useDashboard } from '@/lib/dashboard/dashboard-context';
import { getWidgetById } from '@/lib/dashboard/widget-registry';
import { UserWidgetPreference } from '@/lib/types/dashboard';
import { CogIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline';
import { Spinner } from '@heroui/react';

/**
 * Widget wrapper component with customization controls
 * 
 * @param props - Component props
 * @returns Widget wrapper component
 */
const WidgetWrapper: React.FC<{
  preference: UserWidgetPreference;
  onUpdatePreference: (updates: Partial<UserWidgetPreference>) => void;
}> = ({ preference, onUpdatePreference }) => {
  const widget = getWidgetById(preference.widgetId);
  
  if (!widget || !preference.enabled) {
    return null;
  }
  
  const WidgetComponent = widget.component;
  const props = { ...widget.defaultProps, ...(preference.customProps || {}) };
  
  const sizeClasses = {
    small: 'col-span-12 sm:col-span-6 md:col-span-3',
    medium: 'col-span-12 md:col-span-6',
    large: 'col-span-12 md:col-span-8',
  };
  
  return (
    <div className={sizeClasses[preference.size]}>
      <Card className="h-full">
        <CardHeader className="flex justify-between items-center">
          <h3 className="text-md font-semibold">{widget.name}</h3>
          <div className="flex items-center space-x-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly variant="light" aria-label="Widget options">
                  <CogIcon className="h-5 w-5" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Widget options">
                <DropdownItem 
                  key="size-small" 
                  onClick={() => onUpdatePreference({ size: 'small' })}
                  className={preference.size === 'small' ? 'text-primary' : ''}
                >
                  Small
                </DropdownItem>
                <DropdownItem 
                  key="size-medium" 
                  onClick={() => onUpdatePreference({ size: 'medium' })}
                  className={preference.size === 'medium' ? 'text-primary' : ''}
                >
                  Medium
                </DropdownItem>
                <DropdownItem 
                  key="size-large" 
                  onClick={() => onUpdatePreference({ size: 'large' })}
                  className={preference.size === 'large' ? 'text-primary' : ''}
                >
                  Large
                </DropdownItem>
                <DropdownItem key="divider">
                  <Divider />
                </DropdownItem>
                <DropdownItem 
                  key="disable" 
                  className="text-danger" 
                  onClick={() => onUpdatePreference({ enabled: false })}
                >
                  Remove Widget
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button isIconOnly variant="light" aria-label="Move widget">
              <ArrowsUpDownIcon className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <WidgetComponent {...props} />
        </CardBody>
      </Card>
    </div>
  );
};

/**
 * Widget selector component
 * 
 * @param props - Component props
 * @returns Widget selector component
 */
const WidgetSelector: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const { role, widgetPreferences, updateWidgetPreference } = useDashboard();
  
  const handleEnableWidget = (widgetId: string) => {
    updateWidgetPreference(widgetId, { enabled: true });
    onClose();
  };
  
  const disabledWidgets = widgetPreferences.filter(pref => !pref.enabled);
  
  if (disabledWidgets.length === 0) {
    return (
      <Card>
        <CardBody>
          <div className="text-center p-4">
            <p>All available widgets are already displayed.</p>
            <Button className="mt-4" onClick={onClose}>Close</Button>
          </div>
        </CardBody>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Add Widgets</h3>
      </CardHeader>
      <Divider />
      <CardBody>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {disabledWidgets.map((pref) => {
            const widget = getWidgetById(pref.widgetId);
            if (!widget) return null;
            
            return (
              <Card key={pref.widgetId} isPressable onClick={() => handleEnableWidget(pref.widgetId)}>
                <CardBody className="p-4">
                  <h4 className="font-semibold">{widget.name}</h4>
                  <p className="text-sm text-gray-500">{widget.description}</p>
                </CardBody>
              </Card>
            );
          })}
        </div>
        <Button className="mt-4 w-full" onClick={onClose}>Close</Button>
      </CardBody>
    </Card>
  );
};

/**
 * Customizable dashboard component
 * 
 * @returns Customizable dashboard component
 */
const CustomizableDashboard: React.FC = () => {
  const { 
    widgetPreferences, 
    updateWidgetPreference, 
    resetToDefaultLayout, 
    isLoading, 
    error 
  } = useDashboard();
  const [showWidgetSelector, setShowWidgetSelector] = useState(false);
  
  // Filter only enabled widgets and sort by position
  const enabledWidgets = widgetPreferences
    .filter(pref => pref.enabled)
    .sort((a, b) => a.position - b.position);
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Spinner size="lg" />
        <p className="mt-4 text-default-500">Loading dashboard...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] p-4">
        <div className="bg-danger-50 text-danger p-6 rounded-lg text-center max-w-md">
          <h3 className="text-xl font-semibold mb-2">Error Loading Dashboard</h3>
          <p>{error}</p>
          <Button 
            color="primary" 
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Button 
            variant="flat" 
            onClick={() => setShowWidgetSelector(true)}
          >
            Add Widget
          </Button>
          <Button 
            variant="flat" 
            onClick={resetToDefaultLayout}
          >
            Reset Layout
          </Button>
        </div>
      </div>
      
      {showWidgetSelector && (
        <WidgetSelector onClose={() => setShowWidgetSelector(false)} />
      )}
      
      {enabledWidgets.length === 0 ? (
        <div className="p-8 text-center bg-default-100 rounded-lg">
          <p className="text-default-600 mb-4">No widgets are currently enabled.</p>
          <Button
            color="primary"
            onClick={() => setShowWidgetSelector(true)}
          >
            Add Widgets
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-12 gap-4">
          {enabledWidgets.map((preference) => (
            <WidgetWrapper
              key={preference.widgetId}
              preference={preference}
              onUpdatePreference={(updates) => updateWidgetPreference(preference.widgetId, updates)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomizableDashboard; 