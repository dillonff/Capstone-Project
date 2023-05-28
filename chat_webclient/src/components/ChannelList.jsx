import React from 'react';

import SimpleBoxItem from './SimpleBoxItem';
import ValeIcon from '../assets/ValeIcon.png';
import LogoutIcon from '../assets/logout.png';
import TagIcon from '@mui/icons-material/Tag';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const ChannelList = ({ channels, selectedChannel, onChannelClick }) => {
  let channelElems = [];
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    console.log(channel);
    if (channel.directMessage) {
      continue;
    }
    const clickCb = () => {
      if (onChannelClick) {
        onChannelClick(channel);
      }
    };
    let elem = (
      <SimpleBoxItem
        classNamePrefix="channel"
        title={channel.name}
        text={channel.memberIds.length + ' people'}
        key={i}
        onClick={clickCb}
        selected={channel.id === selectedChannel.id}
      >
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      </SimpleBoxItem>
    );
    channelElems.push(elem);
  }
  if (channelElems.length === 0) {
    channelElems.push(<div key="-1">No channel</div>);
  }

  return (
    <>
      {/* <SideBar /> */}
      <div className="channel-list__list__wrapper">
        {/* <CompanyHeader /> */}
        <div>{channelElems}</div>
      </div>
    </>
  );
};

export default ChannelList;
