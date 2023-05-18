import React from 'react';

import InputEmoji from 'react-input-emoji';

import {
  callApi
} from '../api';

import SimpleMessage from './SimpleMessage';

function ChatBox({ channel, messages, scrollTo }) {
  const msgInputRef = React.useRef();
  const msgListRef = React.useRef();
  const [scroll, setScroll] = React.useState(-1);
  const [text, setText] = React.useState('');

  const checkScroll = _ => {
    // check if we are at the bottom of the message list
    // if that's true, then we scroll down to the newest message
    const elem = msgListRef.current;
    if (!elem)
      return;
    const totalheight = elem.scrollHeight;
    const elemHeight = elem.clientHeight;
    const scrollPos = elem.scrollTop;
    console.log('debug scroll:', totalheight, elemHeight, scrollPos, messages.length);
    if (elemHeight + scrollPos === totalheight) {
      let m = messages[messages.length-1];
      if (m) {
        setScroll(m.id);
      }
    } else {
      setScroll(-1);
    }
  }

  // React.useEffect(checkScroll, [messages]);
  React.useMemo(_ => {
    checkScroll();
  }, [messages]);

  const messageElems = [];
  for (const message of messages) {
    let s = false;
    if (message.id === scroll) {
      s = true;
    }
    messageElems.push(<SimpleMessage key={message.id} message={message} shouldScrollTo={s} />);
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

  const handleBoldClick = () => {
    setText(prevText => `**${prevText}**`);
  };

  const handleItalicClick = () => {
    setText(prevText => `_${prevText}_`);
  };


  return <div style={{ display: 'flex', height: '100%', flexDirection: 'column', color: 'black'}}>
    {/* message list */}
    <div
      style={{
        flexGrow: '1',
        width: '100%',
        overflow: 'auto',
        backgroundColor: '#fafafa'
      }}
      ref={msgListRef}
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
      <div style={{ display: 'flex' }}>
        <button onClick={handleBoldClick} style={{ fontWeight: 'bold', width: '30px', height: '30px' }}>
          B
        </button>
        <button onClick={handleItalicClick} style={{ fontStyle: 'italic', width: '30px', height: '30px' }}>
          I
        </button>
      </div>
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

    <div>
      {/**debug section */}
      {/* <button
        onClick={_ => {
          checkScroll();
        }}
      >get scroll</button> */}
    </div>
  </div>
}

export default ChatBox;
