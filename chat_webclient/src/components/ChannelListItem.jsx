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

import Events from '../event';

function getDefaultChannelInfo(channel) {
  let cm = channel?.callerMember;
  console.error(channel);
  if (cm) {
    return {
      unread: cm.lastReadMessageId < channel.latestMessageId,
      mentioned: cm.mentioned
    }
  }
  return {
    unread: false,
    mentioned: false
  }
}

function ChannelListItem(props) {
  const [anchorEl, setAnchorEl] = useState(null);

  const [channelLocalInfo, setChannelLocalInfo] = React.useState(getDefaultChannelInfo);
  const prevChannelRef = React.useRef();

  const channel = props.channel;
  const members = props.channel.members;

  const handleClick = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    return false;
  };

  const handleItemClick = (event) => {
    event.stopPropagation();
    setChannelLocalInfo(i => {
      return {mentioned: false, unread: false}
    });
    props.onClick();
  }

  React.useEffect(() => {
    if (!props.selected && channel !== prevChannelRef.current) {
      setChannelLocalInfo(getDefaultChannelInfo(channel));
    }
    prevChannelRef.current = channel;
    const cb = Events.getDefaultCallback();
    cb.onNewMessage = (data) => {
      console.error(data, 'ok00');
      if (data.channelId === channel.id && !props.selected) {
        console.error(data, 'ok');
        setChannelLocalInfo(i => {
          const mentionStr = `@${auth.user.username}`;
          if (data.content.indexOf(mentionStr + ' ') > 0 || data.content.endsWith(mentionStr)) {
            return {...i, mentioned: true, unread: true};
          }
          return {...i, unread: true};
        });
      }
    }
    Events.addListener(cb);
    return () => {
      Events.removeListener(cb);
    }
  }, [channel, props.selected]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  let pinned = false;
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

  const rootClasses = ['channel-list__item']
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
          onClick={handleItemClick}
      >
        {/** channel name */}
        <div style={{flex: '1 0 0'}}>
          <div>
            <TagIcon className="sidebar__icon" />
            {props.title}
          </div>
          <div>
            <GroupIcon className="sidebar__icon" />
            {props.text}
            {channelLocalInfo.mentioned && <span
              style={{marginLeft: '1em', color: 'red', fontSize: 'small'}}
            >
              @mentioned
            </span>}
          </div>
        </div>

        {/** pinned status */}
        <IconButton
            className=""
            onClick={handleClick}
            style={{
              color: '#f0f0f0',
              display: pinned ? null : 'none',
              alignSelf: 'start'
            }}
        >
            <PushPinIcon sx={{ fontSize: 18 }} />
        </IconButton>

        {/** unread indicator and menu */}
        <div className="d-flex flex-column align-items-center">
          <div style={{
            color: 'red',
            visibility: channelLocalInfo.unread ? null : 'hidden'
          }}>
            <FiberManualRecordIcon sx={{ fontSize: 14 }}/>
          </div>
          <IconButton
              className="channel-list__menu workspace__icon-button "
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
            <MenuItem onClick={handlePin}><PushPinIcon />{pinned ? 'Unpin channel' : 'Pin channel'}</MenuItem>
            <MenuItem onClick={handleClose}><DeleteForeverIcon/>Leave channel</MenuItem>
        </Menu>
      </div>
  );
}

export default ChannelListItem;
