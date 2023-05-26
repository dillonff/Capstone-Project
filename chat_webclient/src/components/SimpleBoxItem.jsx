import React, { useState } from 'react';
import TagIcon from '@mui/icons-material/Tag';
import GroupIcon from '@mui/icons-material/Group';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

function SimpleBoxItem(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
      <div
          className={
            props.selected
                ? 'workspace__wrapper__selected'
                : `workspace__wrapper--${props.classNamePrefix}`
          }
          key={props.key}
          onClick={props.onClick}
      >
        <div>
          <div>
            <TagIcon className="sidebar__icon" />
            {props.title}
          </div>
          <div>
            <GroupIcon className="sidebar__icon" />
            {props.text}
          </div>
        </div>
        <IconButton
            className="workspace__icon-button workspace__wrapper__selected"
            onClick={handleClick}
            style={{ color: 'white', marginLeft: '155px', marginBottom: '8px' }}
        >
          <MoreHorizIcon />
        </IconButton>
          <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
              }}
              transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
              }}
          >
              <MenuItem onClick={handleClose}><PushPinIcon />Pin</MenuItem>
              <MenuItem onClick={handleClose}><DeleteForeverIcon/>Delete</MenuItem>
          </Menu>
      </div>
  );
}

export default SimpleBoxItem;
