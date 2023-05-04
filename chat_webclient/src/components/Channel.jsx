
import ChatBox from './ChatBox';
import React from 'react';
import {
  getMessages,
  addUserToChannel,
  getMessageById,
  getUser
} from '../api.js';
import Event from '../event.js';

function Channel({
  channel
}) {
  const [messages, setMessages] = React.useState([]);
  const addUserIdRef = React.useRef();

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
      <input
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
      <input type="text" ref={addUserIdRef}></input>
    </div>

    <hr />
    
    <div style={{flexGrow: '1'}}>
      <ChatBox channel={channel} messages={messages} />
    </div>
  </div>
}

export default Channel;
