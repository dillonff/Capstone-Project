import React from 'react';

import Popover from '@mui/material/Popover';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'


export default function EmojiPicker({anchorEl, onClose, onSelect}) {
  const open = !!anchorEl;

  return <Popover
    open={open}
    onClose={onClose}
    anchorEl={anchorEl}
    anchorOrigin={{
      vertical: 'top',
      horizontal: 'left'
    }}
    transformOrigin={{
      vertical: 'bottom',
      horizontal: 'left'
    }}
  >
    <Picker data={data} onEmojiSelect={e => {
      if (onSelect && e.native) {
        onSelect(e.native);
      }
    }} />
  </Popover>
}
