import React from 'react';
import { Drawer as MuiDrawer, DrawerProps } from '@mui/material';

export const Drawer = React.forwardRef<HTMLDivElement, DrawerProps>(
  (props, ref) => <MuiDrawer ref={ref} {...props} />
);
Drawer.displayName = 'Drawer';
