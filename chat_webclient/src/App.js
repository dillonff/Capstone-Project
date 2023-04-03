import logo from './logo.svg';
import React, { useRef, useState } from 'react';
import './App.css';

const nullChannel = {
  id: -1,
  name: '(not loaded)',
  participantIds: []
}

const API_ENDPOINT = 'http://127.0.0.1:11451/api/v1';
function callApi(path, method, auth, body) {
  return fetch(API_ENDPOINT + path, {
    method: method,
    mode: 'cors',
    body: body,
    headers: {
      'authorization': auth,
      'content-type': 'application/json'
    }
  });
}

function App() {
  let [status, setStatus] = React.useState('disconnected');
  let [ws, setWs] = useState(null);
  let [msgList, setMsgList] = useState([]);
  let auth = useRef();
  const msgListRef = React.useRef(msgList);
  let [msgToSend, setMsgToSend] = useState('');
  let [userName, setUserName] = useState('user-' + new Date().getTime());
  let [channels, setChannels] = useState([]);
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
      msgListRef.current = [];
      setCurrentChannel(channel);
    }
    let elem = <div key={i} style={{padding: '5px', margin: '5px', border: '1px solid black', cursor: 'pointer'}} onClick={clickCb}>
      <div>{channel.name}</div>
      <div>{channel.participantIds.length} people</div>
    </div>
    channelElems.push(elem);
  }
  if (channelElems.length === 0) {
    channelElems.push(<div key='-1'>No channel</div>);
  }

  const getAllChannels = async () => {
    let res = await callApi('/channels', 'GET', auth.current);
    if (!res.ok)
      throw new Error('api failed');
    res = await res.json();
    let newChannels = [];
    for (let channelId of res.channelIds) {
      res = await callApi('/channel/' + channelId, 'GET', auth.current);
      if (!res.ok)
        throw new Error('api failed');
      res = await res.json();
      newChannels.push(res);
      if (res.id === currentChannel.id) {
        setCurrentChannel(res);
      }
      if (currentChannel.id === -1 && res.name === 'general') {
        setCurrentChannel(res);
      }
    }
    setChannels(newChannels);
  }

  const addUserToChannel = (ws, cid, uid) => {
    let req = {
      user: parseInt(uid),
      channel: parseInt(cid)
    }
    req = JSON.stringify(req);
    return callApi('/channel/join', 'POST', auth.current, req);
  }

  if (ws) {
    ws.onmessage = (event) => {
      let res = JSON.parse(event.data);
      // console.log(event);
      console.log(res)
      switch (res.type) {
        case 'res':
          setStatus(`logged in as (${res.result.userId})`);
          break;
        case 'newMessage':
          let msg = {
            message: res.data.preview,
            sender: res.data.senderId   // TODO: obtain the user info and then set this sender properly
          }
          console.error(res.data);
          if (res.data.channelId === currentChannel.id) {
            let newMsgList = [...msgListRef.current, msg];
            setMsgList(newMsgList);
            msgListRef.current = newMsgList;
          }
          break;
        case 'infoChanged':
          getAllChannels();
          break;
        default:
          break;
      }
    }
    ws.onerror = (e) => {
      setStatus('error');
      console.error(e);
    }
    ws.onopen = (e) => {
      ws.send(JSON.stringify({
        'type': 'auth',
        'args': {
          userName: userName
        }
      }));
      setStatus('connected');
    }
    ws.onclose = (e) => {
      setStatus('closed');
    }
  }

  const doConnect = async () => {
    let res = await callApi('/auth', 'POST', '-1', JSON.stringify({
      userName: userName
    }));
    if (!res.ok) {
      console.error(res);
      return false;
    }
    res = await res.json();
    auth.current = res.userId;
    getAllChannels();
    
    let newWs = new WebSocket('ws://127.0.0.1:11451/chat-ws');
    setWs(newWs);
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      {/* channels */}
      <div style={{width: '150px', marginLeft: '20px'}}>
        <div style={{marginBottom: '10px'}}>
          <input type='button' value='create channel' onClick={_ => {
            let name = prompt('channel name: ');
            if (name) {
              let req = {
                name: name
              }
              req = JSON.stringify(req);
              callApi('/channel', 'POST', auth.current, req);
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
            addUserToChannel(window.ws, currentChannel.id, addUserIdRef.current.value).then(res => {
              if (!res.ok) {
                console.error(res);
                alert('cannot add user');
              }
            });
            addUserIdRef.current.value = '';
          }}></input>
          <input type='text' ref={addUserIdRef}></input>
        </div>
        <div style={{height: '600px', backgroundColor: '#fafafa', overflowY: 'scroll'}}>
          {msgElems}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px'}}>
          <input type="text" value={msgToSend} onInput={e => setMsgToSend(e.target.value)}></input>
          <input type="button" value="Send" onClick={() => {
            let body = {
              content: msgToSend,
              channel: currentChannel.id
            }
            body = JSON.stringify(body);
            callApi('/sendMessage', 'POST', auth.current, body).then(res => {
              if (res.ok) {
                setMsgToSend("");
              } else {
                console.error(res);
              }
            })
          }}></input>
        </div>
      </div>
    </div>
  );
}

export default App;
