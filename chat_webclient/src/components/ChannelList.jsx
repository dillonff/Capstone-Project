import React from 'react';

import ChannelListItem from './ChannelListItem';
import ValeIcon from '../assets/ValeIcon.png';
import LogoutIcon from '../assets/logout.png';
import TagIcon from '@mui/icons-material/Tag';
import { OrganizationIdContext, OrganizationsContext } from '../AppContext';
import { nullOrganization } from '../api';
import { findById, orgIsChannelMember } from '../util';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import IconButton from '@mui/material/IconButton';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const ChannelList = ({ channels, selectedChannel, onChannelClick }) => {
  const [organizationId] = React.useContext(OrganizationIdContext);
  const [organizations] = React.useContext(OrganizationsContext);
  const organization = findById(organizationId, organizations, nullOrganization);

  let channelElems = [];
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    const members = channel.members || [];
    console.log(channel);
    if (channel.directMessage) {
      continue;
    }
    if (organization.id > 0 && !orgIsChannelMember(organization, members)) {
      continue;
    }
    const clickCb = () => {
      if (onChannelClick) {
        onChannelClick(channel);
      }
    };
    let elem = (
      <ChannelListItem
        classNamePrefix="channel"
        title={channel.name}
        text={members.length + ' people'}
        key={i}
        onClick={clickCb}
        selected={channel.id === selectedChannel.id}
        channel={channel}
      >
        <IconButton>
          <MoreHorizIcon />
        </IconButton>
      </ChannelListItem>
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
