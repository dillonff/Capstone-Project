import React from 'react';

import SimpleBoxItem from './SimpleBoxItem';

const ChannelList = ({
  channels,
  selectedChannel,
  onChannelClick
}) => {

  let channelElems = [];
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    console.log(channel);
    const clickCb = () => {
      if (onChannelClick) {
        onChannelClick(channel);
      }
    };
    let elem = <SimpleBoxItem 
      title={channel.name}
      text={channel.memberIds.length + ' people'}
      key={i}
      onClick={clickCb}
      selected={channel.id === selectedChannel.id} />
    channelElems.push(elem);
  }
  if (channelElems.length === 0) {
    channelElems.push(<div key="-1">No channel</div>);
  }


  return <div>
    {channelElems}
  </div>;
};

export default ChannelList;
