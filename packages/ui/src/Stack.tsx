import React from 'react';
import { Stack as MuiStack, StackProps } from '@mui/material';

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  (props, ref) => <MuiStack ref={ref} {...props} />
);
Stack.displayName = 'Stack';
