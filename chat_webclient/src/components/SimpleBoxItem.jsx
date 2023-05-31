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
        <div style={{width:"110px"}}>
          <div style={{width:"110px"}}>
            <TagIcon className="sidebar__icon" />
            {props.title}
          </div>
          <div style={{width:"110px"}}>
            <GroupIcon className="sidebar__icon" />
            {props.text}
          </div>
        </div>
          <IconButton
              className="workspace__icon-button workspace__wrapper__selected"
              onClick={handleClick}
              style={{ color: 'grey',marginLeft:'15px',marginBottom:'25px', height:'60px'}}
          >
              <PushPinIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <div style={{width:"60px"}}>
              <div style={{width:"60px", color:'grey', marginLeft:'120px', marginBottom:'38px'}}>
                  <FiberManualRecordIcon sx={{ fontSize: 14 }}/>
              </div>
          </div>
        <IconButton
            className="workspace__icon-button workspace__wrapper__selected"
            onClick={handleClick}
            style={{ color: 'white', marginLeft:'auto' , height:'60px'}}
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
