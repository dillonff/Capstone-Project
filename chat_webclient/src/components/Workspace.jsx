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
  processChannelMembers,
  addOrgToWorkspace
} from '../api.js';

import ChannelList from './ChannelList.jsx';
import Channel from './Channel';
import CreateOrganization from './CreateOrganization';
import Event from '../event';
import UserAvatar from './UserAvatar';
import { showError, showInfo, useMountedEffect } from '../util.js';
import { DirectMessageList } from './DirectMessageList.jsx';
import { AddGlobalModalsContext } from '../AppContext.js';
import SimpleDetailDialog from './SimpleDetailDialog.jsx';
import { InviteMemberForm } from './InviteMemberForm.jsx';
import { CreateChannelForm } from './CreateChannelForm.jsx';

const WorkspaceDropdown = ({ workspace }) => {
  return;
};

const Workspace = ({ initialWorkspace, setSelectedWorkspace }) => {
  const workspace = initialWorkspace;
  let [channels, setChannels] = React.useState([]);
  const [currentChannelId, setCurrentChannelId] = React.useState(-1);
  const [showCreateChannel, setShowCreateChannel] = React.useState(false);
  const [openInviteOrg, setOpenInviteOrg] = React.useState(false);
  const addGlobalModal = React.useContext(AddGlobalModalsContext);
  const updateChannelCtx = React.useRef({ongoing: false, next: null});
  const workspaceRef = React.useRef(null);

  let currentChannel = nullChannel;
  if (currentChannelId !== -1) {
    for (const channel of channels) {
      if (channel.id === currentChannelId) {
        currentChannel = channel;
        break;
      }
    }
  }

  const getAndUpdateChannels = React.useCallback(async () => {
    let newChannels = [];
    try {
      newChannels = await getAllChannels(workspace.id);
      for (const c of newChannels) {
        const members = await getChannelMembers(c.id);
        await processChannelMembers(members);
        c.members = members;
      }
    } catch (e) {
      showError(addGlobalModal, e);
      return;
    }
    for (const channel of newChannels) {
      if (currentChannel.id === -1 && channel.name === 'general') {
        setCurrentChannelId(channel.id);
      }
    }
    if (workspaceRef.current === workspace) {
      // set channels only when current workspace does not change
      setChannels(newChannels);
    }
  }, [currentChannel, workspace]);

  const updateLoop = React.useCallback(async () => {
    while (updateChannelCtx.current.next) {
      try {
        const func = updateChannelCtx.current.next;
        updateChannelCtx.current.next = null;
        await func();
      } finally {

      }
    }
    updateChannelCtx.current.ongoing = false;
  }, []);

  const updateChannels = React.useCallback(() => {
    const ctx = updateChannelCtx.current;
    ctx.next = getAndUpdateChannels;
    if (!ctx.ongoing) {
      ctx.ongoing = true;
      updateLoop();
    }
  }, [getAndUpdateChannels]);

  React.useEffect((_) => {
    workspaceRef.current = workspace;
    updateChannels();
    return () => {
      workspaceRef.current = null;
    }
  }, [workspace]);

  React.useEffect(
    (_) => {
      if (workspace.id === -1) return;
      let cb = Event.getDefaultCallback();
      cb.onInfoChanged = (data) => {
        console.error("workspace: check channel change", data);
        if (data.infoType.startsWith('channel')) {
          updateChannels();
        }
      };
      Event.addListener(cb);
      return (_) => {
        Event.removeListener(cb);
      };
    },
    [workspace, currentChannel, updateChannels]
  );

  const onAddUserClick = (_) => {
    const elem = <InviteMemberForm
      onInvite={(email) => {
        addUserToWorkspace(workspace.id, email).then(res => {
          showInfo(addGlobalModal, "Member added!");
        }).catch(e => {
          showError(addGlobalModal, e);
        });
      }}
    />;
    addGlobalModal(SimpleDetailDialog, {
      title: 'Invite user to workspace',
      children: elem
    });
  };

  const onCreateChannelClick = (_) => {
    setShowCreateChannel(true);
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
            variant="outline-light"
            menuVariant="dark"
            size="md"
            title={<span >{workspace.name}</span>}
          >
            <Dropdown.Item onClick={onAddUserClick}>
              Invite user
            </Dropdown.Item>
            <Dropdown.Item onClick={() => setOpenInviteOrg(true)}>
              Invite organization
            </Dropdown.Item>
            <Dropdown.Item onClick={onCreateChannelClick}>
              Create channel
            </Dropdown.Item>
            <Dropdown.Item
              onClick={(_) => {
                updateChannels();
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

        {/** create channel form */}
        <SimpleDetailDialog
          open={showCreateChannel}
          onClose={() => setShowCreateChannel(false)}
          fullWidth={false}
          title="Create Channel"
        >
          <CreateChannelForm workspace={workspace} onClose={() => setShowCreateChannel(false)} />
        </SimpleDetailDialog>

        {/** invite org form */}
        <SimpleDetailDialog
          open={openInviteOrg}
          onClose={() => setOpenInviteOrg(false)}
          title="Invite Organization to Workspace"
        >
          <InviteMemberForm
            onInvite={(email) => {
              addOrgToWorkspace(workspace.id, email).then(() => {
                setOpenInviteOrg(false);
              }).catch(e => {
                showError(addGlobalModal, e);
              })
            }}
          />
        </SimpleDetailDialog>

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
