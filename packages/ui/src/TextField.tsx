import React from 'react';
import { TextField as MuiTextField, TextFieldProps } from '@mui/material';

export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (props, ref) => <MuiTextField ref={ref} {...props} />
);
TextField.displayName = 'TextField';
