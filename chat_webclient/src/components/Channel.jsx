
import ChatBox from './ChatBox';
import React from 'react';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import ChannelMember from './ChannelMember';

import {
  getMessages,
  addUserToChannel,
  getMessageById,
  getUser
} from '../api.js';
import Event from '../event.js';

function Channel({
  workspace,
  channel
}) {
  const [messages, setMessages] = React.useState([]);
  const addUserIdRef = React.useRef();
  
  const [show, setShow] = React.useState(false);

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
      let newMessages = [...messages, message];
      setMessages(newMessages);
    }
    Event.addListener(cb);
    return _ => {
      Event.removeListener(cb);
    }
  }, [messages]);

  return <div style={{display: 'flex', flexDirection: 'column', height: '100%', width: '100%', padding: '10px', boxSizing: 'border-box'}}>
    {/* title */}
    <h3>#{channel.id} {channel.name}</h3>

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
    
    <div style={{flexGrow: '1'}}>
      <ChatBox channel={channel} messages={messages} />
    </div>
  </div>
}

export default Channel;
