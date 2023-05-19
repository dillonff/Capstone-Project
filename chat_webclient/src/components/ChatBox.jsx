import React from 'react';

import InputEmoji from 'react-input-emoji';
import EmojiPicker from 'emoji-picker-react';

import {
  callApi
} from '../api';

import SimpleMessage from './SimpleMessage';

import Button from '@mui/joy/Button';
import Input from '@mui/joy/Input';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import {EmojiEmotions} from "@mui/icons-material";
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import UploadFileIcon from '@mui/icons-material/UploadFile';



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
    <div style={{borderRadius: '25px',
      border: '1px solid #ccc',
      backgroundColor: '#f2f2f2',
      padding: '10px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    width:'500px',
      flexGrow: 1}}>
      <div style={{flexGrow: 1,
      }}>

        <Input
            placeholder="Type a message"
            variant="solid"
            color="red"
            style={{
                borderRadius: '25px'}}
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
        <div style={{display: 'flex', width: '100%'
        }}>
            <IconButton
                color="neutral"
                variant="outlined"
                style={{
                    marginTop:'5px',
                }}
            >
                <InsertEmoticonIcon/>
            </IconButton>
            <IconButton
                color="neutral"
                variant="outlined"
                style={{
                    marginTop:'5px',
                }}
            >
                <AlternateEmailIcon/>
            </IconButton>
            <IconButton
                color="neutral"
                variant="outlined"
                style={{
                    marginTop:'5px',
                }}
            >
                <UploadFileIcon/>
            </IconButton>

            <Button
                color="neutral"
                onClick={_ => sendMessage(text)}
                variant="outlined"
                style={{
                    marginLeft: 'auto',
                    width: '70px',
                    height:'5px',
                    marginTop:'5px'
                }}
            >
                <SendIcon />
            </Button>
        </div>

    </div>
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
