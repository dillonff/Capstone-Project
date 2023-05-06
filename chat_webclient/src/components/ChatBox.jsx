import React from 'react';

import InputEmoji from 'react-input-emoji';

import {
  callApi
} from '../api';

import SimpleMessage from './SimpleMessage';

function ChatBox({ channel, messages }) {
  const msgInputRef = React.useRef();
  const [text, setText] = React.useState('');

  const messageElems = [];
  for (const message of messages) {
    messageElems.push(<SimpleMessage key={message.id} message={message} />);
  }

  const sendMessage = (msg) => {
    let body = {
      content: msg,
      channelId: channel.id,
    };
    body = JSON.stringify(body);
    callApi('/messages/send', 'POST', body).then(
      (res) => {
        if (res.ok) {
          setText('');
        } else {
          console.error(res);
          alert('Cannot send message');
        }
      }
    );
  }

  return <div style={{ display: 'flex', height: '100%', flexDirection: 'column', color: 'black'}}>
    {/* message list */}
    <div
      style={{
        flexGrow: '1',
        width: '100%',
        overflow: 'auto',
        backgroundColor: '#fafafa'
      }}
    >
      {messageElems}
    </div>

    {/** message input box */}
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '15px',
      }}
    >
      <InputEmoji
        value={text}
        onChange={setText}
        cleanOnEnter
        onEnter={sendMessage}
        placeholder="Type a message"
      />
      <input
        type="text"
        ref={msgInputRef}
        style={{display: 'none'}}
      ></input>
      <input
        type="button"
        value="Send"
        onClick={_ => sendMessage(text)}
      ></input>
    </div>
  </div>
}

export default ChatBox;
