import React from 'react';
import { Toolbar as MuiToolbar, ToolbarProps } from '@mui/material';

export const Toolbar = React.forwardRef<HTMLDivElement, ToolbarProps>(
  (props, ref) => <MuiToolbar ref={ref} {...props} />
);
Toolbar.displayName = 'Toolbar';
