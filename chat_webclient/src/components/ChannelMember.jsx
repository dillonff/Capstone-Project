import React from 'react';

import Button from 'react-bootstrap/Button';

import {
  addUserToChannel,
  getUser
} from '../api';

function ChannelMember({
  channel,
  workspaceMemberIds,
  channelMemberIds
}) {
  const [channelMembers, setChannelMembers] = React.useState([]);
  const [workspaceMembers, setWorkspaceMembers] = React.useState([]);

  React.useEffect(_ => {
    let wm = [];
    let cm = [];
    console.log(workspaceMemberIds);
    (async _ => {
      for (let mid of workspaceMemberIds) {
        const user = await getUser(mid);
        wm.push(user);
      }
      for (let mid of channelMemberIds) {
        const user = await getUser(mid);
        cm.push(user);
      }
      setChannelMembers(cm);
      setWorkspaceMembers(wm);
    })();

  }, [channel]);

  let membersNotJoinned = [];
  for (let m of workspaceMembers) {
    let hasMember = false;
    for (let m2 of channelMembers) {
      if (m.id === m2.id) {
        hasMember = true;
        break;
      }
    }
    if (!hasMember) {
      membersNotJoinned.push(m);
    }
  }
  console.log(channelMembers);
  
  return <div>
    <h4>Joined members</h4>
    <ul>
      {channelMembers.map(m => {
        return <li>{m.username}</li>;
      })}
    </ul>
    <hr />
    <h4>Other workspace members</h4>
    <ul>
      {membersNotJoinned.map(m => {
        return <li style={{marginBottom: '2px'}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{display: 'inline'}}>{m.username}</div>
            <Button
              type='button'
              variant='outline-primary'
              onClick={_ => {
                addUserToChannel(channel.id, m.id).catch(e => {
                  console.error(e);
                  alert(e);
                })
              }}
            >Add</Button>
          </div>
        </li>;
      })}
    </ul>
  </div>
}

export default ChannelMember;
