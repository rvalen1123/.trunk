"use client";

import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Card, CardBody, CardFooter, Button, Divider } from '@heroui/react';
import FormSection from './form-section';
import { FormSchema, FormValues } from '@/lib/types/forms';

interface FormBuilderProps {
  schema: FormSchema;
  initialValues?: FormValues;
  onSubmit: (data: FormValues) => void;
  submitLabel?: string;
  isSubmitting?: boolean;
  resetLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
}

/**
 * Dynamic form builder component
 * Renders a form based on a schema configuration
 * 
 * @param props - Component props
 * @returns Form builder component
 */
const FormBuilder: React.FC<FormBuilderProps> = ({
  schema,
  initialValues = {},
  onSubmit,
  submitLabel = 'Submit',
  isSubmitting = false,
  resetLabel = 'Reset',
  onCancel,
  cancelLabel = 'Cancel',
}) => {
  // Generate Yup validation schema from form schema
  const validationSchema = React.useMemo(() => {
    const schemaObj: Record<string, any> = {};
    
    // Process all sections and their fields
    schema.sections.forEach(section => {
      section.fields.forEach(field => {
        if (field.validation) {
          let fieldSchema = yup.mixed();
          
          // Apply specific validation rules based on field type
          switch (field.type) {
            case 'text':
            case 'textarea':
            case 'email':
              fieldSchema = yup.string();
              
              if (field.validation.required) {
                fieldSchema = fieldSchema.required(field.validation.requiredMessage || 'This field is required');
              }
              
              if (field.validation.minLength) {
                fieldSchema = fieldSchema.min(
                  field.validation.minLength,
                  field.validation.minLengthMessage || `Minimum length is ${field.validation.minLength}`
                );
              }
              
              if (field.validation.maxLength) {
                fieldSchema = fieldSchema.max(
                  field.validation.maxLength,
                  field.validation.maxLengthMessage || `Maximum length is ${field.validation.maxLength}`
                );
              }
              
              if (field.type === 'email') {
                fieldSchema = fieldSchema.email(field.validation.emailMessage || 'Invalid email address');
              }
              
              if (field.validation.pattern) {
                fieldSchema = fieldSchema.matches(
                  new RegExp(field.validation.pattern),
                  field.validation.patternMessage || 'Invalid format'
                );
              }
              break;
              
            case 'number':
              fieldSchema = yup.number()
                .typeError(field.validation.typeMessage || 'Must be a number');
              
              if (field.validation.required) {
                fieldSchema = fieldSchema.required(field.validation.requiredMessage || 'This field is required');
              }
              
              if (field.validation.min !== undefined) {
                fieldSchema = fieldSchema.min(
                  field.validation.min,
                  field.validation.minMessage || `Minimum value is ${field.validation.min}`
                );
              }
              
              if (field.validation.max !== undefined) {
                fieldSchema = fieldSchema.max(
                  field.validation.max,
                  field.validation.maxMessage || `Maximum value is ${field.validation.max}`
                );
              }
              break;
              
            case 'date':
              fieldSchema = yup.date()
                .typeError(field.validation.typeMessage || 'Must be a valid date');
              
              if (field.validation.required) {
                fieldSchema = fieldSchema.required(field.validation.requiredMessage || 'This field is required');
              }
              
              if (field.validation.min) {
                const minDate = new Date(field.validation.min);
                fieldSchema = fieldSchema.min(
                  minDate,
                  field.validation.minMessage || `Date must be after ${minDate.toLocaleDateString()}`
                );
              }
              
              if (field.validation.max) {
                const maxDate = new Date(field.validation.max);
                fieldSchema = fieldSchema.max(
                  maxDate,
                  field.validation.maxMessage || `Date must be before ${maxDate.toLocaleDateString()}`
                );
              }
              break;
              
            case 'checkbox':
              fieldSchema = yup.boolean();
              
              if (field.validation.required) {
                fieldSchema = fieldSchema.oneOf(
                  [true],
                  field.validation.requiredMessage || 'This field must be checked'
                );
              }
              break;
              
            case 'select':
            case 'radio':
              fieldSchema = yup.string();
              
              if (field.validation.required) {
                fieldSchema = fieldSchema.required(field.validation.requiredMessage || 'This field is required');
              }
              
              if (field.validation.oneOf && field.options) {
                fieldSchema = fieldSchema.oneOf(
                  field.options.map(opt => opt.value),
                  field.validation.oneOfMessage || 'Invalid selection'
                );
              }
              break;
              
            case 'checkboxGroup':
              fieldSchema = yup.array().of(yup.string());
              
              if (field.validation.required) {
                fieldSchema = fieldSchema.min(
                  1,
                  field.validation.requiredMessage || 'At least one option must be selected'
                );
              }
              
              if (field.validation.min !== undefined) {
                fieldSchema = fieldSchema.min(
                  field.validation.min,
                  field.validation.minMessage || `At least ${field.validation.min} options must be selected`
                );
              }
              
              if (field.validation.max !== undefined) {
                fieldSchema = fieldSchema.max(
                  field.validation.max,
                  field.validation.maxMessage || `At most ${field.validation.max} options can be selected`
                );
              }
              break;
              
            default:
              if (field.validation.required) {
                fieldSchema = fieldSchema.required(field.validation.requiredMessage || 'This field is required');
              }
          }
          
          schemaObj[field.name] = fieldSchema;
        }
      });
    });
    
    return yup.object(schemaObj);
  }, [schema]);
  
  const methods = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: initialValues,
  });
  
  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
  });
  
  const handleReset = () => {
    methods.reset(initialValues);
  };
  
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <Card>
          <CardBody>
            <div className="space-y-6">
              {schema.sections.map((section, index) => (
                <FormSection key={section.id || index} section={section} />
              ))}
            </div>
          </CardBody>
          
          <Divider />
          
          <CardFooter>
            <div className="flex justify-end gap-2">
              {onCancel && (
                <Button
                  type="button"
                  variant="flat"
                  onClick={onCancel}
                >
                  {cancelLabel}
                </Button>
              )}
              
              <Button
                type="button"
                variant="flat"
                onClick={handleReset}
              >
                {resetLabel}
              </Button>
              
              <Button
                type="submit"
                color="primary"
                isLoading={isSubmitting}
                isDisabled={isSubmitting}
              >
                {submitLabel}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
};

export default FormBuilder; 