import React, { FormEvent } from 'react';

interface FormData {
  [key: string]: string | number | boolean;
}

interface ValidationRules {
  [key: string]: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    validate?: (value: string) => boolean;
  };
}

interface FormErrors {
  [key: string]: string;
}

const validateForm = (data: FormData, rules: ValidationRules): FormErrors => {
  const errors: FormErrors = {};
  
  Object.keys(rules).forEach((field) => {
    const value = data[field] as string;
    const fieldRules = rules[field];
    
    if (fieldRules.required && !value) {
      errors[field] = 'This field is required';
    } else if (value) {
      if (fieldRules.minLength && value.length < fieldRules.minLength) {
        errors[field] = `Minimum length is ${fieldRules.minLength} characters`;
      }
      
      if (fieldRules.maxLength && value.length > fieldRules.maxLength) {
        errors[field] = `Maximum length is ${fieldRules.maxLength} characters`;
      }
      
      if (fieldRules.pattern && !fieldRules.pattern.test(value)) {
        errors[field] = 'Invalid format';
      }
      
      if (fieldRules.validate && !fieldRules.validate(value)) {
        errors[field] = 'Validation failed';
      }
    }
  });
  
  return errors;
};

const handleFormSubmit = (
  event: FormEvent<HTMLFormElement>,
  data: FormData,
  rules: ValidationRules,
  onSuccess: (data: FormData) => void,
  onError: (errors: FormErrors) => void
): void => {
  event.preventDefault();
  
  const errors = validateForm(data, rules);
  
  if (Object.keys(errors).length === 0) {
    onSuccess(data);
  } else {
    onError(errors);
  }
};