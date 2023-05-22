
import ChatBox from './ChatBox';
import React from 'react';

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
  getOrg
} from '../api.js';
import Event from '../event.js';
import {
  findById
} from '../util';

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

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // get messages when the component is mounted
  React.useEffect(_ => {
    if (channel.id === -1)
      return;
    getMessages(channel.id).then(res => {
      setMessages(res);
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
      let message = {
        content: data.preview,
        sender: await getUser(data.senderId),
        timeCreated: new Date().toUTCString()
      }
      if (organization.id > 0) {
        message.organization = organization;
      }
      let newMessages = [...messages, message];
      setMessages(newMessages);
    }
    Event.addListener(cb);
    return _ => {
      Event.removeListener(cb);
    }
  }, [messages, organization]);

  const [dmName, setDmName] = React.useState('');
  React.useEffect(_ => {
    let mounted = true;
    const peerIds = channel.memberIds.filter(i => i !== auth.user.id);
    if (peerIds.length === 0) {
      peerIds.push(auth.user.id);
    }
    (async _ => {
      const names = [];
      for (const i of peerIds) {
        let u = await getUser(i);
        names.push(u.username);
        if (names.length > 3) {
          names.push('...');
          break;
        }
      }
      if (mounted) {
        setDmName(names.join(', '));
      }
    }) ();
    return _ => {mounted = false;}
  }, [channel])
  let name = channel.name;
  if (channel.directMessage) {
    name = dmName ? dmName : "Direct Message";
  }

  return <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '10px', boxSizing: 'border-box', backgroundColor: 'white', color: 'black'}}>
    {/* title */}
    <h3>#{channel.id} {name}</h3>

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
            workspaceMemberIds={workspace.memberIds}
            channelMemberIds={channel.memberIds}
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
