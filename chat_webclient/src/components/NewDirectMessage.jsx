import { List, ListItem, ListItemButton } from '@mui/material';
import React from 'react';
import { auth, createChannel } from '../api';
import { getChannelMemberKey, getWorkspaceMemberKey } from '../util';
import UserAvatar from './UserAvatar';

export default function NewDirectMessage({
  workspace,
  channels,
  onSelected
}) {
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
        console.error(e);
        alert(e);
      });
      if (onSelected) {
        onSelected();
      }
    }
    elems.push(
      <ListItem disablePadding key={elems.length}>
        <ListItemButton onClick={createDm}>
          <UserAvatar username={name} />{name}
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
    if (c.dmPeerMembers.length === 1 && c.dmPeerMembers[0].userId === auth.user.id) {
      // self dm
      return true;
    } else if (c.dmPeerMembers.length === 2) {
      let workspaceMemberInChannel = false;
      let selfInChannel = false;
      for (const dmm of c.dmPeerMembers) {
        const dmmKey = getChannelMemberKey(dmm);
        const wmKey = getWorkspaceMemberKey(workspaceMember);
        const selfKey = `0-${auth.user.id}`;
        if (dmmKey === wmKey) {
          workspaceMemberInChannel = true;
        }
        if (dmmKey === selfKey) {
          selfInChannel = true;
        }
      }
      if (workspaceMemberInChannel && selfInChannel) {
        return true;
      }
    }
  }
  return false;
}
