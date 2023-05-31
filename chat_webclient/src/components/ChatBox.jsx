import React from 'react';
import { flushSync } from 'react-dom';

import SimpleMessage from './SimpleMessage';
import EmojiPicker from './EmojiPicker';
import FileUploadForm from './FileUploadForm';

import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';


import { callApi } from '../api';

// if (
//   typeof customElements !== 'undefined' &&
//   !customElements.get('em-emoji-picker')
// ) {
//   customElements.define('em-emoji-picker', Picker);
// }

function ChatBox({ channel, messages, scrollTo, organization }) {
  const msgInputRef = React.useRef();
  const msgListRef = React.useRef();
  const fileInputRef = React.useRef();
  const [scroll, setScroll] = React.useState(-1);
  const [text, setText] = React.useState('');
  const [emojiAnchor, setEmojiAnchor] = React.useState(null);
  const [alternateEmailAnchor, setAlternateEmailAnchor] = React.useState(null);

    const handleAlternateEmailClick = (event) => {
        setAlternateEmailAnchor(event.currentTarget);
    };

    const handleAlternateEmailClose = () => {
        setAlternateEmailAnchor(null);
    };


    const checkScroll = (_) => {
    // check if we are at the bottom of the message list
    // if that's true, then we scroll down to the newest message
    const elem = msgListRef.current;
    if (!elem) return;
    const totalheight = elem.scrollHeight;
    const elemHeight = elem.clientHeight;
    const scrollPos = elem.scrollTop;
    console.log(
      'debug scroll:',
      totalheight,
      elemHeight,
      scrollPos,
      messages.length
    );
    if (totalheight - elemHeight - scrollPos <= 1) {
      let m = messages[messages.length - 1];
      if (m) {
        setScroll(m.id);
      }
    } else {
      setScroll(-1);
    }
  };

  // React.useEffect(checkScroll, [messages]);
  React.useMemo(
    (_) => {
      checkScroll();
    },
    [messages]
  );

  const messageElems = [];
  for (const message of messages) {
    let s = false;
    if (message.id === scroll) {
      s = true;
    }
    messageElems.push(
      <SimpleMessage key={message.id} message={message} shouldScrollTo={s} />
    );
  }

  const handleKeypress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage(text);
    }
  };

  const sendMessage = (msg, fileIds) => {
    if (!msg && (!fileIds || fileIds.length === 0)) return;
    let body = {
      content: msg,
      channelId: channel.id,
    };
    if (organization && organization.id > 0) {
      body.organizationId = organization.id;
    }
    if (fileIds) {
      body.fileIds = fileIds;
    }
    body = JSON.stringify(body);
    callApi('/messages/send', 'POST', body).then((res) => {
      if (res.ok) {
        setText('');
      } else {
        console.error(res);
        alert('Cannot send message');
      }
    });
  };

  const addEmoji = React.useCallback(
    (nativeEmoji) => {
      const elem = msgInputRef.current;
      console.log(elem);
      const txt = elem.value;
      const start = elem.selectionStart;
      const first = txt.slice(0, start);
      const last = txt.slice(start);
      elem.value = first + nativeEmoji + last;
      const len = nativeEmoji.length;
      console.log(start);
      flushSync((_) => {
        setText(first + nativeEmoji + last);
        // setEmojiAnchor(null);
      });
      elem.focus();
      console.log('before:', elem.selectionStart);
      elem.setSelectionRange(start + len, start + len);
      console.log('after:', elem.selectionStart);
      elem.focus();
    },
    [msgInputRef]
  );

  const EmptyState = () => (
    <div className="chat-empty__container">
      <p className="chat-empty__first">
        This is the beginning of your chat history.
      </p>
      <p className="chat-empty__second">
        Send messages, attachments, links, emojis, and more!
      </p>
    </div>
  );

  return (
    <div className="chatbox__container__wrapper">
      {/* message list */}

      <div className="chatbox__container__messagelist" ref={msgListRef}>
        <EmptyState />
        {messageElems}
      </div>

      <EmojiPicker
        anchorEl={emojiAnchor}
        onClose={(_) => {
          flushSync((_) => {
            setEmojiAnchor(null);
          });
          msgInputRef.current.focus();
        }}
        onSelect={addEmoji}
      />

      <div style={{ display: 'none' }}>
        <FileUploadForm
          inputRef={fileInputRef}
          onFileUploaded={(f) => {
            sendMessage(text, [f.id]);
          }}
        />
      </div>

      {/** message input box */}
      <div className="chatbox__container__input">
        <div className="chatbox__container__input__box">
          <div style={{ flexGrow: 1 }}>
            <Input
              placeholder="Type a message"
              variant="solid"
              color="red"
              slotProps={{
                input: {
                  ref: msgInputRef,
                },
              }}
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                console.log('target:', event.target);
              }}
              onKeyPress={handleKeypress}
              style={{
                borderRadius: '25px',
              }}
            />
          </div>

          {/*<input*/}
          {/*    type="button"*/}
          {/*    value="Send"*/}
          {/*    onClick={_ => sendMessage(text)}*/}
          {/*    style={{*/}
          {/*      marginLeft: 'auto', */}
          {/*      width: '100px', */}
          {/*    }}*/}
          {/*/>*/}
          <div style={{ display: 'flex', width: '100%' }}>
            <IconButton
              color="neutral"
              variant="outlined"
              style={{
                marginTop: '5px',
              }}
              onClick={(_) => setEmojiAnchor(msgInputRef.current)}
            >
              <InsertEmoticonIcon />
            </IconButton>
            <IconButton
              color="neutral"
              variant="outlined"
              style={{
                marginTop: '5px',
              }}
              onClick={handleAlternateEmailClick}
            >
              <AlternateEmailIcon />
            </IconButton>
            <IconButton
              color="neutral"
              variant="outlined"
              style={{
                marginTop: '5px',
              }}
              onClick={(_) => {
                fileInputRef.current.click();
              }}
            >
              <UploadFileIcon />
            </IconButton>

            <Button
              color="neutral"
              onClick={(_) => sendMessage(text)}
              variant="outlined"
              style={{
                marginLeft: 'auto',
                width: '70px',
                height: '5px',
                marginTop: '5px',
              }}
            >
              <SendIcon />
            </Button>
              <Menu
                  anchorEl={alternateEmailAnchor}
                  open={Boolean(alternateEmailAnchor)}
                  onClose={handleAlternateEmailClose}
                  anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right',
                  }}
                  transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                  }}
              >
                  <MenuItem  onClick={handleAlternateEmailClose}> 111 </MenuItem>
                  <MenuItem  onClick={handleAlternateEmailClose}> 22222 </MenuItem>
                  <MenuItem  onClick={handleAlternateEmailClose}> 3333 </MenuItem>
                  <MenuItem  onClick={handleAlternateEmailClose}> 4 </MenuItem>
              </Menu>

          </div>
        </div>
      </div>

      <div>{/**debug section */}</div>
    </div>
  );
}

export default ChatBox;
