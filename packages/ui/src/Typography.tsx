import React from 'react';
import { Typography as MuiTypography, TypographyProps } from '@mui/material';

export const Typography = React.forwardRef<HTMLSpanElement, TypographyProps>(
  (props, ref) => <MuiTypography ref={ref} {...props} />
);
Typography.displayName = 'Typography';
