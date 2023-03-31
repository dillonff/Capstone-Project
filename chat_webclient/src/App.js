import logo from './logo.svg';
import React, { useRef, useState } from 'react';
import './App.css';

const nullChannel = {
  id: -1,
  name: '(not loaded)',
  participantIds: []
}

function App() {


  let [status, setStatus] = React.useState('disconnected');
  let [ws, setWs] = useState(null);
  let [msgList, setMsgList] = useState([]);
  const msgListRef = React.useRef(msgList);
  let [msgToSend, setMsgToSend] = useState('');
  let [userName, setUserName] = useState('user-' + new Date().getTime());
  let [channels, setChannels] = useState([]);
  const channelsRef = useRef(channels);
  let [currentChannel, setCurrentChannel] = useState(nullChannel);
  const addUserIdRef = useRef(null);
  let msgElems = [];
  for (let i = 0; i < msgList.length; i++) {
    const msg = msgList[i];
    let elem = <div key={i}>
      <label>id: {msg.sender}</label>
      <div style={{fontSize: 'x-large'}}>{msg.message}</div>
    </div>;
    msgElems.push(elem);
  }

  let channelElems = [];
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    console.log(channel);
    const clickCb = () => {
      setMsgList([]);
      setCurrentChannel(channel);
    }
    let elem = <div key={i} style={{padding: '5px', margin: '5px', border: '1px solid black', cursor: 'pointer'}} onClick={clickCb}>
      <div>{channel.name}</div>
      <div>{channel.participantIds.length} people</div>
    </div>
    channelElems.push(elem);
  }

  const getAllChannels = (ws) => {
    const req = {
      type: 'getChannels',
      args: {}
    }
    window.ws.send(JSON.stringify(req));
  }

  const addUserToChannel = (ws, cid, uid) => {
    const req = {
      type: 'joinChannel',
      args: {
        user: parseInt(uid),
        channel: parseInt(cid)
      }
    }
    ws.send(JSON.stringify(req));
  }

  const doConnect = () => {
    let newWs = new WebSocket('ws://127.0.0.1:11451/chat-ws');
    newWs.onmessage = (event) => {
      let res = JSON.parse(event.data);
      // console.log(event);
      console.log(res)
      switch (res.type) {
        case 'res':
          switch (res.request) {
            case 'auth':
              if (res.success) {
                setStatus(`logged in as (${res.result.userId})`);
                getAllChannels(window.ws);
              }
              break;
            case 'sendMessage':
              break;
            case 'getChannels':
              for (let channelId of res.result.channelIds) {
                let req = {
                  type: 'getChannelInfo',
                  args: {
                    channelId: channelId
                  }
                };
                window.ws.send(JSON.stringify(req));
              }
              break;
            case 'getChannelInfo':
              let newChannels = [];
              let hasId = false;
              for (let channel of channelsRef.current) {
                
                console.error(channel);
                if (channel.id != res.result.id) {
                  newChannels.push(channel);
                } else {
                  hasId = true;
                  newChannels.push(res.result);
                }
              }
              if (!hasId) {
                newChannels.push(res.result);
              }
              console.log(newChannels)
              setChannels(newChannels);
              channelsRef.current = newChannels;
              if (currentChannel.id === -1 && res.result.name === 'general') {
                setCurrentChannel(res.result);
              }
              break;
            case 'createChannel':
              getAllChannels();
              break;
          }
          break;
        case 'newMessage':
          let msg = {
            message: res.data.preview,
            sender: res.data.senderId   // TODO: obtain the user info and then set this sender properly
          }
          let newMsgList = [...msgListRef.current, msg];
          setMsgList(newMsgList);
          msgListRef.current = newMsgList;
          break;
        default:
          break;
      }
    }
    newWs.onerror = (e) => {
      setStatus('error');
      console.error(e);
    }
    newWs.onopen = (e) => {
      newWs.send(JSON.stringify({
        'type': 'auth',
        'args': {
          userName: userName
        }
      }));
      setWs(newWs);
      window.ws = newWs;
      setStatus('connected');
    }
    newWs.onclose = (e) => {
      setStatus('closed');
    }
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      {/* channels */}
      <div style={{width: '150px', marginLeft: '20px'}}>
        <div style={{marginBottom: '10px'}}>
          <input type='button' value='create channel' onClick={_ => {
            let name = prompt('channel name: ');
            if (name) {
              const req = {
                'type': 'createChannel',
                args: {
                  name: name
                }
              }
              window.ws.send(JSON.stringify(req));
            }
          }}></input>
          <input type='button' value='refresh channel' onClick={_ => {
            getAllChannels();
          }}></input>
        </div>
        {channelElems}
      </div>
      <div style={{width: '400px', margin: 'auto', padding: '5px'}}>
        <div style={{marginBottom: '15px'}}>
          <input type="button" value="Connect" onClick={doConnect}></input>
          <span style={{marginLeft: '5px'}}>{status}</span>
        </div>
        <div>
          <label>user name: </label>
          <input type='text' value={userName} onChange={e => setUserName(e.target.value)}></input>
        </div>
        <div>Channel ({currentChannel.id}): {currentChannel.name}</div>
        <div style={{display: 'flex'}}>
          <input type='button' value='Add user (id)' style={{marginRight: '5px'}} onClick={_ => {
            addUserToChannel(window.ws, currentChannel.id, addUserIdRef.current.value);
            addUserIdRef.current.value = '';
            getAllChannels();
          }}></input>
          <input type='text' ref={addUserIdRef}></input>
        </div>
        <div style={{height: '600px', backgroundColor: '#fafafa', overflowY: 'scroll'}}>
          {msgElems}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px'}}>
          <input type="text" value={msgToSend} onInput={e => setMsgToSend(e.target.value)}></input>
          <input type="button" value="Send" onClick={() => {
            let msg = {
              type: 'sendMessage',
              args: {
                content: msgToSend,
                channel: currentChannel.id   // hardcoded 'general channel'
              }
            }
            ws.send(JSON.stringify(msg));
            setMsgToSend("");
          }}></input>
        </div>
      </div>
    </div>
  );
}

export default App;
