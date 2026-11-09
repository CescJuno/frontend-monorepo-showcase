import React from 'react';
import { AppBar as MuiAppBar, AppBarProps } from '@mui/material';

export const AppBar = React.forwardRef<HTMLDivElement, AppBarProps>(
  (props, ref) => <MuiAppBar ref={ref} {...props} />
);
AppBar.displayName = 'AppBar';
