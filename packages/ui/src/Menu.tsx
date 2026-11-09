import React from 'react';
import MuiMenu, { MenuProps as MuiMenuProps } from '@mui/material/Menu';

export interface MenuProps extends MuiMenuProps {}

export const Menu: React.FC<MenuProps> = (props) => {
  return <MuiMenu {...props} />;
};