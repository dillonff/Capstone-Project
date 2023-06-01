import React from 'react';

import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import {
  auth,
  callApi,
  getAllChannels,
  nullChannel,
  addUserToWorkspace,
  createChannel,
  nullWorkspace,
  getOrg,
  getOrgs,
  nullOrganization,
  getUser,
  getMembersInfo,
  getWorkspaceMembers,
  processWorkspaceMembers,
  getChannelMembers,
  processChannelMembers
} from '../api.js';

import ChannelList from './ChannelList.jsx';
import Channel from './Channel';
import CreateOrganization from './CreateOrganization';
import Event from '../event';
import UserAvatar from './UserAvatar';
import { useMountedEffect } from '../util.js';
import { DirectMessageList } from './DirectMessageList.jsx';
import { AddGlobalModalsContext } from '../AppContext.js';
import SimpleDetailDialog from './SimpleDetailDialog.jsx';
import { InviteMemberForm } from './InviteMemberForm.jsx';

const WorkspaceDropdown = ({ workspace }) => {
  return;
};

const Workspace = ({ initialWorkspace, setSelectedWorkspace }) => {
  const workspace = initialWorkspace;
  let [channels, setChannels] = React.useState([]);
  const [currentChannelId, setCurrentChannelId] = React.useState(-1);
  const addGlobalModal = React.useContext(AddGlobalModalsContext);

  let currentChannel = nullChannel;
  if (currentChannelId !== -1) {
    for (const channel of channels) {
      if (channel.id === currentChannelId) {
        currentChannel = channel;
        break;
      }
    }
  }

  React.useEffect((_) => {
    getAndUpdateChannels();
  }, []);

  const getAndUpdateChannels = async (_) => {
    let newChannels = channels;
    try {
      newChannels = await getAllChannels(workspace.id);
    } catch (e) {
      console.error(e);
      alert(e);
    }
    for (const channel of newChannels) {
      if (currentChannel.id === -1 && channel.name === 'general') {
        setCurrentChannelId(channel.id);
      }
    }
    setChannels(newChannels);
  };

  React.useEffect(_ => {
    let channelToGetMember = null;
    for (const c of channels) {
      if (!c.members) {
        channelToGetMember = c;
        break;
      }
    }
    if (channelToGetMember) {
      (async () => {
        let members = await getChannelMembers(channelToGetMember.id);
        await processChannelMembers(members);
        setChannels(oldChannels => {
          let newChannels = [];
          let changed = false;
          for (const c of oldChannels) {
            if (c === channelToGetMember) {
              newChannels.push({...c, members: members});
              changed = true;
            } else {
              newChannels.push(c);
            }
          }
          if (changed) {
            return newChannels;
          }
          return oldChannels;
        });
      }) ();
    }
  }, [channels]);

  React.useEffect(
    (_) => {
      if (workspace.id === -1) return;
      let cb = Event.getDefaultCallback();
      cb.onInfoChanged = (data) => {
        console.error("workspace: check channel change", data);
        if (data.infoType.startsWith('channel')) {
          getAndUpdateChannels();
        }
      };
      Event.addListener(cb);
      return (_) => {
        Event.removeListener(cb);
      };
    },
    [workspace, currentChannel]
  );

  const onAddUserClick = (_) => {
    const elem = <InviteMemberForm
      onInvite={(email) => {
        addUserToWorkspace(workspace.id, email).then(res => {
          alert('Added!');
        }).catch(e => {
          console.error(e);
          alert(e);
        });
      }}
    />;
    addGlobalModal(SimpleDetailDialog, {
      title: 'Invite user to workspace',
      children: elem
    });
  };

  const onCreateChannelClick = (_) => {
    let name = prompt('channel name');
    if (name) {
      createChannel(workspace.id, name, false).catch((e) => {
        console.error(e);
        alert(e);
      });
    }
  };

  return (
    <div style={{ display: 'flex', height: '100%', flexShrink: '0' }}>
      {/**workspace stuff */}
      <div className="sidebar">
        {/* workspace info */}
        <div>{/* <h3>Workspace ({workspace.id}): {workspace.name}</h3> */}</div>
        <div>
          <DropdownButton
            id="workspace-dropdown"
            variant="primary"
            size="md"
            title={`${workspace.name} (${workspace.id})`}
          >
            <Dropdown.Item onClick={onAddUserClick}>
              Invite user
            </Dropdown.Item>
            <Dropdown.Item onClick={onCreateChannelClick}>
              Create channel
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(_) => {
                getAndUpdateChannels();
              }}
            >
              Refresh channel
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(_) => {
                setSelectedWorkspace(nullWorkspace);
              }}
            >
              Swhich Workspace
            </Dropdown.Item>
          </DropdownButton>
        </div>
        {/* some buttons */}
        <div style={{ marginBottom: '10px', display: 'none' }}>
          <Button
            style={{ margin: '5px' }}
            type="button"
            value=""
            variant="success"
            onClick={null}
          >
            create channel
          </Button>
          <Button
            type="button"
            value="refresh channel"
            variant="secondary"
            onClick={(_) => {
              getAndUpdateChannels();
            }}
          >
            refresh channels
          </Button>
        </div>
        <hr />

        <h5>Channels</h5>
        <ChannelList
          channels={channels}
          selectedChannel={currentChannel}
          onChannelClick={(c) => setCurrentChannelId(c.id)}
        />
        <div
          tabIndex="0"
          className="dmuser__wrapper"
          onClick={onCreateChannelClick}
        >
          <AddCircleOutlineIcon />
          Create Channel
        </div>
        <hr />
        {/**workspace members */}
        <DirectMessageList
          channels={channels}
          onDmSelected={c => setCurrentChannelId(c.id)}
          currentChannelId={currentChannelId}
          workspace={workspace}
        />
        <hr />
        
      </div>

      {/** channel component */}
      <div style={{ height: '100%', width: '100%' }}>
        <Channel channel={currentChannel} workspace={workspace} />
      </div>

      <hr />
    </div>
  );
};

export default Workspace;
