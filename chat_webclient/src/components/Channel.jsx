import React from 'react';
import ChatBox from './ChatBox';

import Button from '@mui/material/Button';
import Modal from 'react-bootstrap/Modal';

import TagIcon from '@mui/icons-material/Tag';
import MuiButton from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import ChannelMember from './ChannelMember';

import {
  AddGlobalModalsContext,
  OrganizationIdContext,
  OrganizationsContext
} from '../AppContext';

import {
  getMessages,
  addUserToChannel,
  getMessageById,
  getUser,
  auth,
  nullOrganization,
  getOrg,
  getChannelMembers,
  processChannelMembers,
  setChannelRead
} from '../api.js';
import Event from '../event.js';
import {
  findById, getDmName, showError, useMountedEffect
} from '../util';
import UserAvatar from './UserAvatar';

function Channel({
  workspace,
  channel
}) {
  const [messages, setMessages] = React.useState([]);
  const addUserIdRef = React.useRef();
  const addGlobalModal = React.useContext(AddGlobalModalsContext);
  
  const [show, setShow] = React.useState(false);
  const [organizationId] = React.useContext(OrganizationIdContext);
  const [organizations] = React.useContext(OrganizationsContext);
  const organization = findById(organizationId, organizations, nullOrganization);
  const [members, setMembers] = React.useState([]);
  const membersVersion = React.useRef(0);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // get messages when the component is mounted
  useMountedEffect(getMounted => {
    setMessages([]);
    if (channel.id === -1)
      return;
    getMessages(channel.id).then(res => {
      getMounted() && setMessages(res);
    }).catch(e => {
      console.error(e);
      alert(e);
    });
  }, [channel]);

  React.useEffect(_ => {
    const cb = Event.getDefaultCallback();
    cb.onNewMessage = async (data) => {
      if (data.channelId !== channel.id) {
        return;
      }
      // console.log('new message arrived');
      // console.log(data);
      setMessages(messages => [...messages, data]);
    }
    Event.addListener(cb);
    return _ => {
      Event.removeListener(cb);
    }
  }, [channel]);

  const updateMembers = async getMounted => {
    if (channel.members) {
      setMembers(channel.members);
      return;
    }
    // old code to retrieve channel members,
    // but they are now temporarily retrieved by Workspace
    membersVersion.current++;
    const expectedVersion = membersVersion.current;
    let res = await getChannelMembers(channel.id);
    await processChannelMembers(res);
    if (expectedVersion === membersVersion.current && getMounted()) {
      setMembers(res);
    }
  }

  useMountedEffect(getMounted => {
    setMembers([]);
    if (channel.id === -1)
      return;
    updateMembers(getMounted);
  }, [channel]);

  React.useEffect(() => {
    if (messages.length > 0) {
      const m = messages[messages.length - 1];
      const member = channel.callerMember;
      let unread = false;
      if (member && member.lastReadMessageId < channel.latestMessageId) {
        unread = true;
      }
      console.error(m);
      console.error(channel, unread);
      if (m.senderId !== auth.user.id && unread) {
        setChannelRead(m.channelId).then(_ => {
          member.lastReadMessageId = m.id;
          channel.latestMessageId = m.id;
        }).catch(e => {
          showError(addGlobalModal, e);
        });
      }
    }
  }, [messages, channel]);

  let name = channel.name;
  if (channel.directMessage) {
    name = getDmName(channel);
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        padding: '10px',
        boxSizing: 'border-box',
        backgroundColor: 'white',
        color: 'black',
      }}
    >
      {/* title */}
      <h4 className="d-flex align-items-center">
        <div><TagIcon /></div>
        <div>{name}</div>

        <div style={{marginLeft:'10px'}}>
          <Button variant="text" size="small" sx={{color: 'black'}} startIcon={<EditIcon />} onClick={handleShow}>
            Edit members
          </Button>

          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Channel members</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <ChannelMember
                channel={channel}
                workspaceMembers={workspace.members || []}
                channelMembers={members}
              />
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </h4>

      <hr style={{margin: '3px 0'}} />

      <div className="chatbox__container">
        <ChatBox
          channel={channel}
          messages={messages}
          organization={organization}
        />
      </div>
    </div>
  );
}

export default Channel;
