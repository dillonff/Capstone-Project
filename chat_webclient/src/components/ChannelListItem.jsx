import React, { useState } from 'react';
import TagIcon from '@mui/icons-material/Tag';
import GroupIcon from '@mui/icons-material/Group';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PushPinIcon from '@mui/icons-material/PushPin';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { auth, handleChannelPin } from '../api';


function ChannelListItem(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  let pinned = false;
  const channel = props.channel;
  const members = props.channel.members;
  if (members) {
    for (const m of members) {
      if (m.userId === auth.user.id) {
        pinned = m.pinned;
      }
    }
  }

  const handlePin = () => {
    handleChannelPin(channel, !pinned);
    handleClose();
  }

  const rootClasses = []
  if (props.selected) {
    rootClasses.push('workspace__wrapper__selected');
  } else {
    rootClasses.push('workspace__wrapper--channel');
  }
  rootClasses.push('d-flex justify-content-between');

  return (
      <div
          className={rootClasses.join(' ')}
          key={props.key}
          onClick={props.onClick}
      >
        <div style={{flex: '1 0 0'}}>
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
            className=""
            onClick={handleClick}
            style={{
              color: pinned ? 'red' : 'grey'
            }}
        >
            <PushPinIcon sx={{ fontSize: 18 }} />
        </IconButton>
        <div className="d-flex flex-column align-items-center">
          <div>
            <FiberManualRecordIcon sx={{ fontSize: 14 }}/>
          </div>
          <IconButton
              className=" "
              onClick={handleClick}
              style={{ color: 'white'}}
          >
            <MoreHorizIcon />
          </IconButton>
        </div>
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
              <MenuItem onClick={handlePin}><PushPinIcon />{pinned ? 'Unpin' : 'Pin'}</MenuItem>
              <MenuItem onClick={handleClose}><DeleteForeverIcon/>Delete</MenuItem>
          </Menu>
      </div>
  );
}

export default ChannelListItem;
