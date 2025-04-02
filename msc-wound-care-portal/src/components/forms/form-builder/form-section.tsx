import React from 'react';
import { Card, CardHeader, CardBody, Divider } from '@heroui/react';
import { FormSectionSchema } from '@/lib/types/forms';
import FormField from './form-field';

interface FormSectionProps {
  section: FormSectionSchema;
}

/**
 * Form section component
 * Renders a group of related form fields within a card
 * 
 * @param props - Component props
 * @returns Form section component
 */
const FormSection: React.FC<FormSectionProps> = ({
  section
}) => {
  if (!section.fields || section.fields.length === 0) {
    return null;
  }
  
  return (
    <Card>
      {(section.title || section.description) && (
        <>
          <CardHeader className={section.description ? 'pb-0' : ''}>
            {section.title && (
              <h3 className="text-lg font-semibold">{section.title}</h3>
            )}
            {section.description && (
              <p className="text-sm text-default-500">{section.description}</p>
            )}
          </CardHeader>
          <Divider />
        </>
      )}
      
      <CardBody>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {section.fields.map((field) => (
            <div 
              key={field.name}
              className={
                field.fullWidth
                  ? 'col-span-1 md:col-span-2'
                  : 'col-span-1'
              }
            >
              <FormField field={field} />
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  );
};

export default FormSection; 