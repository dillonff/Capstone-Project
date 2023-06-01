import { List, ListItem, ListItemText } from '@mui/material';
import React from 'react';

import Button from 'react-bootstrap/Button';

import {
  addUserToChannel,
  getOrg,
  getUser
} from '../api';
import { useMountedEffect } from '../util';

function ChannelMember({
  channel,
  workspaceMembers,
  channelMembers
}) {
  let membersNotJoinned = [];
  let userMembersIdSet = new Set(channelMembers.map(m => m.userId));
  for (let m of workspaceMembers) {
    switch (m.type) {
      case 0: // user
        if (!userMembersIdSet.has(m.memberId)) {
          membersNotJoinned.push({
            displayName: m.user.username,
            otherText: 'Workspace user',
            onAdd: _ => {
              addUserToChannel(channel.id, m.user.id).catch(e => {
                console.error(e);
                alert(e);
              })
            }
          });
        }
        break;
      case 1:
        if (!channelMembers.some(cm => cm.type === 1 && cm.organizationId === m.memberId)) {
          membersNotJoinned.push({
            displayName: m.organization.name, 
            otherText: m.organization.fullName,
            onAdd: _ => {
              
            }
          });
        }
        break;
      default:
        console.warn("Unknown type:", m.type);
        break;
    }
  }
  
  return <div>
    <h5>Joined members</h5>
    <ul>
      {channelMembers.map((m, i) => {
        if (m.user) {
          return <li key={i}>{m.user.username}</li>;
        } else if (m.organization) {
          return <li key={i}>{m.organization.name} ({m.organization.fullName})</li>;
        } else {
          return <li key={i}>(unknown member {`${m.type}-${m.id}`})</li>
        }
      })}
    </ul>
    <hr />
    <h5>Other workspace members</h5>
    <List>
      {membersNotJoinned.map(m => {
        return <ListItem secondaryAction={
          <Button
            type='button'
            variant='outline-primary'
            onClick={m.onAdd}
          >Add</Button>
        }>
          <ListItemText
            primary={m.displayName}
            secondary={m.otherText}
          />
        </ListItem>;
      })}
    </List>
  </div>
}

export default ChannelMember;
