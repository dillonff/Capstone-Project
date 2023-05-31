import React from 'react';
import ChatBox from './ChatBox';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import ChannelMember from './ChannelMember';

import {
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
  processChannelMembers
} from '../api.js';
import Event from '../event.js';
import {
  findById, getDmName, useMountedEffect
} from '../util';
import UserAvatar from './UserAvatar';

function Channel({
  workspace,
  channel
}) {
  const [messages, setMessages] = React.useState([]);
  const addUserIdRef = React.useRef();
  
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
      getMounted && setMessages(res);
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
      console.log('new message arrived');
      console.log(data);
      setMessages(messages => [...messages, data]);
    }
    Event.addListener(cb);
    return _ => {
      Event.removeListener(cb);
    }
  }, [channel]);

  const updateMembers = async getMounted => {
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
  }, [channel])

  let name = channel.name;
  if (channel.directMessage) {
    name = getDmName(channel);
  }

  return <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: 'white', color: 'black'}}>
    {/* title */}
    {!channel.directMessage && <h3>#{channel.id} {name}</h3>}
    {channel.directMessage && <h3 style={{display: 'flex'}}><UserAvatar username={name} />({channel.id}) {name}</h3>}

    <div style={{ display: 'flex' }}>
      {/* <input
        type="button"
        value="Add user (id)"
        style={{ marginRight: '5px' }} 
        onClick={(_) => {
          addUserToChannel(
            channel.id,
            addUserIdRef.current.value
          ).then((res) => {
            if (!res.ok) {
              console.error(res);
              alert('cannot add user');
            } else {
              alert('Added!');
            }
          });
          addUserIdRef.current.value = '';
        }}
      ></input>
      <input type="text" ref={addUserIdRef}></input> */}
      
      <Button variant="link" onClick={handleShow}>
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

    <hr />
    
    <div style={{flexGrow: '1', overflow: 'hidden'}}>
      <ChatBox channel={channel} messages={messages} organization={organization} />
    </div>
  </div>
  
}

export default Channel;
