import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing form state, validation, and submission.
 * 
 * @param {Object} options - Configuration options
 * @param {Object} options.initialValues - Initial form values
 * @param {Function} options.onSubmit - Form submission handler
 * @param {Function} options.validate - Form validation function
 * @param {boolean} options.validateOnChange - Whether to validate on every change
 * @param {boolean} options.validateOnBlur - Whether to validate on field blur
 * @param {Function} options.transform - Transform form values before submission
 * @param {Object} options.dependencies - External dependencies that should reset form when changed
 * @returns {Object} Form state and handlers
 * 
 * @example
 * const { 
 *   values, 
 *   errors, 
 *   touched,
 *   isSubmitting,
 *   handleChange,
 *   handleBlur,
 *   handleSubmit,
 *   reset,
 *   setFieldValue,
 *   setFieldError,
 * } = useForm({
 *   initialValues: { name: '', email: '' },
 *   onSubmit: async (values) => {
 *     await submitToAPI(values);
 *   },
 *   validate: (values) => {
 *     const errors = {};
 *     if (!values.name) errors.name = 'Name is required';
 *     if (!values.email) errors.email = 'Email is required';
 *     return errors;
 *   }
 * });
 */
const useForm = ({
  initialValues = {},
  onSubmit,
  validate,
  validateOnChange = false,
  validateOnBlur = true,
  transform,
  dependencies = []
}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  // Reset the form with new initial values when dependencies change
  useEffect(() => {
    reset(initialValues);
  }, [...dependencies, JSON.stringify(initialValues)]); // eslint-disable-line react-hooks/exhaustive-deps

  // Validation function
  const validateForm = useCallback(async (formValues = values) => {
    if (!validate) return {};
    
    setIsValidating(true);
    let validationErrors = {};
    
    try {
      // Allow both synchronous and asynchronous validation
      const result = validate(formValues);
      validationErrors = result instanceof Promise ? await result : result;
    } catch (error) {
      console.error('Form validation error:', error);
    } finally {
      setIsValidating(false);
    }
    
    setErrors(validationErrors);
    return validationErrors;
  }, [validate, values]);

  // Check if the form is valid
  const isValid = useCallback(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues(prevValues => ({
      ...prevValues,
      [name]: newValue
    }));
    
    // Mark field as touched
    if (!touched[name]) {
      setTouched(prevTouched => ({
        ...prevTouched,
        [name]: true
      }));
    }
    
    // Validate if needed
    if (validateOnChange) {
      validateForm({
        ...values,
        [name]: newValue
      });
    }
  }, [touched, validateOnChange, validateForm, values]);

  // Handle input blur
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    // Mark field as touched
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    // Validate on blur if enabled
    if (validateOnBlur) {
      validateForm();
    }
  }, [validateOnBlur, validateForm]);

  // Set a field value programmatically
  const setFieldValue = useCallback((name, value, shouldValidate = false) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
    
    if (shouldValidate) {
      validateForm({
        ...values,
        [name]: value
      });
    }
  }, [validateForm, values]);

  // Set field error manually
  const setFieldError = useCallback((name, error) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error
    }));
  }, []);

  // Set field as touched
  const setFieldTouched = useCallback((name, isTouched = true, shouldValidate = false) => {
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: isTouched
    }));
    
    if (isTouched && shouldValidate) {
      validateForm();
    }
  }, [validateForm]);

  // Reset the form
  const reset = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Form submission handler
  const handleSubmit = useCallback(async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    
    // Increase submission count
    setSubmitCount(count => count + 1);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Validate form
    const validationErrors = await validateForm();
    
    // Check if form is valid
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        // Transform values if needed
        const submitValues = transform ? transform(values) : values;
        
        // Call submit handler
        if (onSubmit) {
          await onSubmit(submitValues, {
            setFieldValue,
            setFieldError,
            setFieldTouched,
            resetForm: reset
          });
        }
      } catch (error) {
        console.error('Form submission error:', error);
        
        // Extract API errors if available
        if (error.response?.data?.errors) {
          setErrors(prevErrors => ({
            ...prevErrors,
            ...error.response.data.errors
          }));
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validateForm, onSubmit, transform, setFieldValue, setFieldError, setFieldTouched, reset]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValidating,
    submitCount,
    isValid: isValid(),
    dirty: JSON.stringify(values) !== JSON.stringify(initialValues),
    
    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    
    // Field helpers
    setFieldValue,
    setFieldError,
    setFieldTouched,
    setValues,
    setErrors,
    setTouched,
    
    // Form-level validation
    validateForm
  };
};

export default useForm;