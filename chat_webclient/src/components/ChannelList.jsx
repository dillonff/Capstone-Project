import React from 'react';

import SimpleBoxItem from './SimpleBoxItem';
import ValeIcon from '../assets/ValeIcon.png';
import LogoutIcon from '../assets/logout.png';
import TagIcon from '@mui/icons-material/Tag';

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
      />
    );
    channelElems.push(elem);
  }
  if (channelElems.length === 0) {
    channelElems.push(<div key="-1">No channel</div>);
  }

  return (
    <>
      {/* <SideBar /> */}
      <div className="channel-list__list__wrapper" style={{ padding: '5px' }}>
        {/* <CompanyHeader /> */}
        <div>{channelElems}</div>
      </div>
    </>
  );
};

export default ChannelList;
