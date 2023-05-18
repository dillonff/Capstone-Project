import React from 'react';

import SimpleBoxItem from './SimpleBoxItem';
import ValeIcon from '../assets/ValeIcon.png';
import LogoutIcon from '../assets/logout.png';

const SideBar = ({ logout }) => (
  <div className="channel-list__sidebar">
    <div className="channel-list__sidebar__icon1">
      <div className="icon1__inner">
        <img src={ValeIcon} alt="Vale" width="30" />
      </div>
    </div>
    <div className="channel-list__sidebar__icon2">
      <div className="icon1__inner">
        <img src={LogoutIcon} alt="Logout" width="30" />
      </div>
    </div>
  </div>
);

const CompanyHeader = () => (
  <div className="channel-list__header">
    <p className="channel-list__header__text">Vale</p>
  </div>
);

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
      <div className="channel-list__list__wrapper" style={{padding: "5px"}}>
        {/* <CompanyHeader /> */}
        <div>{channelElems}</div>
      </div>
    </>
  );
};

export default ChannelList;
