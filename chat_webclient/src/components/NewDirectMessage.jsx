import { List, ListItem, ListItemButton } from '@mui/material';
import React from 'react';
import { auth, createChannel } from '../api';
import { AddGlobalModalsContext } from '../AppContext';
import { getChannelMemberKey, getWorkspaceMemberKey, showError } from '../util';
import UserAvatar from './UserAvatar';

export default function NewDirectMessage({
  workspace,
  channels,
  onSelected
}) {
  const addGlobalModal = React.useContext(AddGlobalModalsContext);
  
  const membersNoDm = [];
  for (const m of workspace.members) {
    if (!hasDm(m, channels)) {
      membersNoDm.push(m);
    }
  }
  const elems = [];
  for (const m of membersNoDm) {
    let name = '(unknown)';
    if (m.user) {
      name = m.user.username
    } else if (m.organization) {
      name = m.organization.name;
    }
    const createDm = () => {
      createChannel(
        workspace.id,
        `DM_${auth.user.id}_${m.type}-${m.memberId}`,
        false,
        false,
        m.type,
        m.memberId
      ).catch(e => {
        showError(addGlobalModal, e);
      });
      if (onSelected) {
        onSelected();
      }
    }
    elems.push(
      <ListItem disablePadding key={elems.length}>
        <ListItemButton onClick={createDm}>
          <UserAvatar username={name} />
          <span style={{marginLeft: '10px'}}>{name}</span>
        </ListItemButton>
      </ListItem>
    );
  }
  if (elems.length === 0) {
    elems.push(<div key="0">All direct message channels are created.</div>)
  }
  return <div>
    <List>
      {elems}
    </List>
  </div>
}

function hasDm(workspaceMember, channels) {
  for (const c of channels) {
    if (!c.directMessage) {
      continue;
    }
    if (c.dmPeerMembers.length === 1) {
      let workspaceMemberInChannel = false;
      let selfInChannel = c.callerIsMember;
      const dmmKey = getChannelMemberKey(c.dmPeerMembers[0]);
      const wmKey = getWorkspaceMemberKey(workspaceMember);
      if (dmmKey === wmKey) {
        workspaceMemberInChannel = true;
      }
      if (workspaceMemberInChannel && selfInChannel) {
        return true;
      }
    }
  }
  return false;
}
