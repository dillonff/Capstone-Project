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
} from '../api.js';

import ChannelList from './ChannelList.jsx';
import Channel from './Channel';
import CreateOrganization from './CreateOrganization';
import Event from '../event';
import UserAvatar from './UserAvatar';

const WorkspaceDropdown = ({ workspace }) => {
  return;
};

const Workspace = ({ initialWorkspace, setSelectedWorkspace }) => {
  const workspace = initialWorkspace;
  let [channels, setChannels] = React.useState([]);
  const [currentChannelId, setCurrentChannelId] = React.useState(-1);
  let [members, setMembers] = React.useState([]);
  let addUserIdToWorkspaceRef = React.useRef();

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

  const getMembersInfo = async (memberIds) => {
    const members = [];
    for (const id of memberIds) {
      let res = await callApi('/users/' + id, 'GET');
      if (res.ok) {
        res = await res.json();
        members.push(res);
      } else {
        console.error(res);
        alert('Cannot get member info');
        break;
      }
    }
    return members;
  };

  const getAndUpdateChannels = async (_) => {
    let newChannels = channels;
    try {
      newChannels = await getAllChannels(workspace.id);
    } catch (e) {
      console.error(e);
      alert(e);
    }
    for (const channel of newChannels) {
      if (channel.id === currentChannel.id) {
        setCurrentChannelId(channel.id);
      }
      if (currentChannel.id === -1 && channel.name === 'general') {
        setCurrentChannelId(channel.id);
      }
    }
    setChannels(newChannels);
  };

  React.useEffect(
    (_) => {
      if (workspace.id === -1) return;
      let cb = Event.getDefaultCallback();
      cb.onInfoChanged = (data) => {
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

  React.useEffect(
    (_) => {
      if (workspace.id === -1) return;
      getMembersInfo(workspace.memberIds).then((ms) => {
        setMembers(ms);
      });
    },
    [workspace]
  );

  const onAddUserClick = (_) => {
    let res = prompt('User id to join');
    if (!res) {
      return;
    }
    addUserToWorkspace(workspace.id, res).then((res) => {
      if (!res.ok) {
        console.error(res);
        alert('cannot add user');
      } else {
        // addUserIdToWorkspaceRef.current.value = '';
        alert('Added!');
      }
    });
  };

  const onCreateChannelClick = (_) => {
    let name = prompt('channel name');
    if (name) {
      createChannel(workspace.id, name).catch((e) => {
        console.error(e);
        alert(e);
      });
    }
  };

  const switchToDm = (peerUser) => {
    for (const channel of channels) {
      if (!channel.directMessage) continue;
      const ids = channel.memberIds;
      if (ids.indexOf(auth.user.id) != -1 && ids.indexOf(peerUser.id) != -1) {
        setCurrentChannelId(channel.id);
        return;
      }
    }
    // create DM channel
    createChannel(
      workspace.id,
      `DM-${auth.user.id}-${peerUser.id}`,
      peerUser.id
    ).then((res) => {
      return callApi('/channels/' + res.channelId)
        .then((res) => {
          if (res.ok) {
            return res.json();
          }
          throw new Error('Cannot get channel for DM');
        })
        .then((res) => {
          setCurrentChannelId(res.id);
        });
    });
  };

  const [openCreateOrganization, setOpenCreateOrganization] =
    React.useState(false);

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
            size="lg"
            title={`${workspace.name} (${workspace.id})`}
          >
            <Dropdown.Item onClick={onAddUserClick}>
              Add user (id)
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
                console.log('TODO: Select Workspace');
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
        <h4>Channels</h4>
        <hr />
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
        <h4>Direct Messages</h4>
        <hr />
        <div>
          {members.map((m) => {
            return (
              <div
                tabIndex="0"
                className="dmuser__wrapper"
                onClick={(_) => {
                  switchToDm(m);
                }}
              >
                <div className="dmuser__avatar">
                  <UserAvatar username={m.username} />
                </div>
                {m.username}
              </div>
            );
          })}
        </div>
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
