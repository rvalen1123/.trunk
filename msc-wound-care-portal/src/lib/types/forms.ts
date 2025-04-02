/**
 * Form field types
 */
export type FormFieldType = 
  | 'text'
  | 'textarea'
  | 'number'
  | 'email'
  | 'password'
  | 'tel'
  | 'url'
  | 'date'
  | 'time'
  | 'datetime'
  | 'checkbox'
  | 'radio'
  | 'select'
  | 'checkboxGroup'
  | 'file'
  | 'hidden';

/**
 * Field option for select, radio, checkbox groups
 */
export interface FieldOption {
  label: string;
  value: string;
}

/**
 * Field validation rules
 */
export interface FieldValidation {
  required?: boolean;
  requiredMessage?: string;
  
  // String validations
  minLength?: number;
  minLengthMessage?: string;
  maxLength?: number;
  maxLengthMessage?: string;
  pattern?: string;
  patternMessage?: string;
  email?: boolean;
  emailMessage?: string;
  
  // Number validations
  min?: number;
  minMessage?: string;
  max?: number;
  maxMessage?: string;
  
  // Type validation
  typeMessage?: string;
  
  // Select, radio validations
  oneOf?: boolean;
  oneOfMessage?: string;
}

/**
 * Conditional display rules
 */
export interface FieldConditional {
  dependsOn: string;
  condition: 'equals' | 'notEquals' | 'contains' | 'notContains' | 'isEmpty' | 'isNotEmpty';
  value?: any;
}

/**
 * Form field schema
 */
export interface FormFieldSchema {
  type: FormFieldType;
  name: string;
  label: string;
  placeholder?: string;
  helpText?: string;
  hint?: string;
  defaultValue?: any;
  options?: FieldOption[];
  validation?: FieldValidation;
  disabled?: boolean;
  readOnly?: boolean;
  fullWidth?: boolean;
  min?: number | string; // For number and date inputs
  max?: number | string; // For number and date inputs
  step?: number; // For number inputs
  conditional?: FieldConditional;
}

/**
 * Form section schema
 */
export interface FormSectionSchema {
  id?: string;
  title?: string;
  description?: string;
  fields: FormFieldSchema[];
}

/**
 * Form schema
 */
export interface FormSchema {
  id: string;
  name: string;
  description?: string;
  sections: FormSectionSchema[];
}

/**
 * Form values type
 */
export type FormValues = Record<string, any>; 