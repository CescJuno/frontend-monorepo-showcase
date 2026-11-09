import React from 'react';
import { Grid as MuiGrid, GridProps } from '@mui/material';

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  (props, ref) => <MuiGrid ref={ref} {...props} />
);
Grid.displayName = 'Grid';
