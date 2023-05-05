import React from 'react';

import { callApi } from '../api';

import SimpleMessage from './SimpleMessage';

function ChatBox({ channel, messages }) {
  const msgInputRef = React.useRef();

  const messageElems = [];
  for (const message of messages) {
    messageElems.push(<SimpleMessage key={message.id} message={message} />);
  }

  return (
    <div
      style={{
        display: 'flex',
        maxHeight: '100%',
        height: '80vh',
        flexDirection: 'column',
      }}
    >
      {/* message list */}
      <div
        style={{
          overflowY: 'scroll',
          flexGrow: '1',
          height: '100%',
          backgroundColor: '#fafafa',
        }}
      >
        <div
          style={{
            flexGrow: '1',
            width: '100%',
          }}
        >
          {messageElems}
        </div>
      </div>

      {/** message input box */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '15px',
        }}
      >
        <input type="text" ref={msgInputRef}></input>
        <input
          type="button"
          value="Send"
          onClick={() => {
            let body = {
              content: msgInputRef.current.value,
              channelId: channel.id,
            };
            body = JSON.stringify(body);
            callApi('/messages/send', 'POST', body).then((res) => {
              if (res.ok) {
                msgInputRef.current.value = '';
              } else {
                console.error(res);
                alert('Cannot send message');
              }
            });
          }}
        ></input>
      </div>
    </div>
  );
}

export default ChatBox;
