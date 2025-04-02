import React from 'react';
import { useFormContext } from 'react-hook-form';
import { 
  Input, 
  Textarea, 
  Checkbox, 
  RadioGroup, 
  Radio,
  Select,
  SelectItem,
  CheckboxGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from '@heroui/react';
import { CalendarIcon } from '@heroicons/react/24/outline';
import { FormFieldSchema } from '@/lib/types/forms';

interface FormFieldProps {
  field: FormFieldSchema;
}

/**
 * Form field component
 * Renders the appropriate input based on field type
 * 
 * @param props - Component props
 * @returns Form field component
 */
const FormField: React.FC<FormFieldProps> = ({
  field,
}) => {
  const { 
    register, 
    formState: { errors }, 
    watch, 
    setValue,
    getValues,
    control,
  } = useFormContext();
  
  const value = watch(field.name);
  const error = errors[field.name];
  
  // Helper to check conditional visibility
  const isVisible = () => {
    if (!field.conditional) return true;
    
    const { dependsOn, condition, value: conditionValue } = field.conditional;
    const dependsOnValue = getValues(dependsOn);
    
    switch (condition) {
      case 'equals':
        return dependsOnValue === conditionValue;
      case 'notEquals':
        return dependsOnValue !== conditionValue;
      case 'contains':
        return Array.isArray(dependsOnValue) && dependsOnValue.includes(conditionValue);
      case 'notContains':
        return !Array.isArray(dependsOnValue) || !dependsOnValue.includes(conditionValue);
      case 'isEmpty':
        return !dependsOnValue || (Array.isArray(dependsOnValue) && dependsOnValue.length === 0);
      case 'isNotEmpty':
        return !!dependsOnValue && (!Array.isArray(dependsOnValue) || dependsOnValue.length > 0);
      default:
        return true;
    }
  };
  
  if (!isVisible()) {
    return null;
  }
  
  const commonProps = {
    label: field.label,
    placeholder: field.placeholder,
    description: field.helpText,
    isDisabled: field.disabled,
    isReadOnly: field.readOnly,
  };
  
  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'password':
      case 'tel':
      case 'url':
        return (
          <Input
            {...commonProps}
            {...register(field.name)}
            type={field.type}
            isInvalid={!!error}
            errorMessage={error?.message as string}
          />
        );
        
      case 'textarea':
        return (
          <Textarea
            {...commonProps}
            {...register(field.name)}
            isInvalid={!!error}
            errorMessage={error?.message as string}
          />
        );
        
      case 'number':
        return (
          <Input
            {...commonProps}
            {...register(field.name, { valueAsNumber: true })}
            type="number"
            min={field.min}
            max={field.max}
            step={field.step || 1}
            isInvalid={!!error}
            errorMessage={error?.message as string}
          />
        );
        
      case 'checkbox':
        return (
          <Checkbox
            {...register(field.name)}
            isSelected={value}
            isInvalid={!!error}
            errorMessage={error?.message as string}
          >
            {field.label}
          </Checkbox>
        );
        
      case 'select':
        return (
          <Select
            {...commonProps}
            {...register(field.name)}
            selectedKeys={value ? [value] : []}
            onChange={(e) => setValue(field.name, e.target.value, { shouldValidate: true })}
            isInvalid={!!error}
            errorMessage={error?.message as string}
          >
            {(field.options || []).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </Select>
        );
        
      case 'radio':
        return (
          <RadioGroup
            {...commonProps}
            value={value}
            onChange={(val) => setValue(field.name, val, { shouldValidate: true })}
            isInvalid={!!error}
            errorMessage={error?.message as string}
          >
            {(field.options || []).map((option) => (
              <Radio key={option.value} value={option.value}>
                {option.label}
              </Radio>
            ))}
          </RadioGroup>
        );
        
      case 'checkboxGroup':
        return (
          <CheckboxGroup
            {...commonProps}
            value={value || []}
            onChange={(val) => setValue(field.name, val, { shouldValidate: true })}
            isInvalid={!!error}
            errorMessage={error?.message as string}
          >
            {(field.options || []).map((option) => (
              <Checkbox key={option.value} value={option.value}>
                {option.label}
              </Checkbox>
            ))}
          </CheckboxGroup>
        );
        
      case 'date':
        return (
          <div>
            <Input
              {...commonProps}
              {...register(field.name)}
              type="date"
              min={field.min}
              max={field.max}
              isInvalid={!!error}
              errorMessage={error?.message as string}
              endContent={<CalendarIcon className="h-5 w-5 text-default-400" />}
            />
          </div>
        );
        
      default:
        return (
          <Input
            {...commonProps}
            {...register(field.name)}
            isInvalid={!!error}
            errorMessage={error?.message as string}
          />
        );
    }
  };
  
  return (
    <div className="w-full">
      {renderField()}
      {field.hint && !error && (
        <p className="text-xs text-default-500 mt-1">{field.hint}</p>
      )}
    </div>
  );
};

export default FormField; 