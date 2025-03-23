// src/components/FormErrorMessage.tsx
import React from 'react';
import { ErrorMessage } from 'formik';
import { Typography } from '@mui/material';

interface FormErrorMessageProps {
  name: string;
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({ name }) => (
  <ErrorMessage name={name}>
    {(msg) => <Typography color="error">{msg}</Typography>}
  </ErrorMessage>
);
