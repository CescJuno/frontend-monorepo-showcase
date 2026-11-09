import React from 'react';
import { Select as MuiSelect, SelectProps } from '@mui/material';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Select = React.forwardRef<HTMLSelectElement, SelectProps<any>>(
  (props, ref) => <MuiSelect ref={ref} {...props} />
);
Select.displayName = 'Select';
