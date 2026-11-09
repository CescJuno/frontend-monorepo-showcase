import React from 'react';
import { Dialog as MuiDialog, DialogProps } from '@mui/material';

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
  (props, ref) => <MuiDialog ref={ref} {...props} />
);
Dialog.displayName = 'Dialog';
