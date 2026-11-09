import React from 'react';
import { Avatar as MuiAvatar, AvatarProps } from '@mui/material';

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (props, ref) => <MuiAvatar ref={ref} {...props} />
);
Avatar.displayName = 'Avatar';
