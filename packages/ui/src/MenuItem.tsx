import React from 'react';
import MuiMenuItem, { MenuItemProps as MuiMenuItemProps } from '@mui/material/MenuItem';

export interface MenuItemProps extends MuiMenuItemProps {}

export const MenuItem: React.FC<MenuItemProps> = (props) => {
  return <MuiMenuItem {...props} />;
};