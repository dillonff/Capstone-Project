import logo from './logo.svg';
import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const userCache = {};
async function getUser(id, auth, refresh=false) {
  let user = userCache[id];
  if (!user || refresh) {
    let res = await callApi('/users/' + id, 'GET', auth);
    if (res.ok) {
      res = await res.json();
      userCache[res.id] = res;
      user = res;
    } else {
      throw new Error(`Cannot get user ${id}`);
    }
  }
  if (!user) {
    throw new Error(`Error getting user ${id}`);
  }
  return user;
}

const nullChannel = {
  id: -1,
  name: '(not loaded)',
  memberIds: []
}

const nullWorkspace = {
  id: -1,
  name: '(not loaded)',
  memberIds: [],
  channelIds: []
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
  let [workspaces, setWorkspaces] = useState([]);
  let [currentWorkspace, setCurrentWorkspace] = useState(nullWorkspace);
  let [channels, setChannels] = useState([]);
  let [currentChannel, setCurrentChannel] = useState(nullChannel);
  let [workspaceMembers, setWorkspaceMembers] = useState([]);
  let [channelMembers, setChannelMembers] = useState([]);
  const addUserIdRef = useRef(null);
  const addUserIdToWorkspaceRef = useRef(null);

  useEffect(_ => {
    if (currentWorkspace.id === -1)
      return;
    getAllChannels(currentWorkspace.id).catch(e => {
      console.error(e);
      alert(e);
    });
    getMembersInfo(currentWorkspace.memberIds).then(ms => {
      setWorkspaceMembers(ms);
    }).catch(e => {
      console.error(e);
      alert(e);
    });
  }, [currentWorkspace]);

  useEffect(_ => {
    if (currentChannel.id === -1)
      return;
    getMembersInfo(currentChannel.memberIds).then(ms => {
      setChannelMembers(ms);
    }).catch(e => {
      console.error(e);
      alert(e);
    });

    getMessages(currentChannel.id, auth).then(ms => {
      setMsgList(ms);
      msgListRef.current = ms;
    }).catch(e => {
      console.error(e);
      alert('cannot get historical messages');
    });
  }, [currentChannel]);

  let msgElems = [];
  for (let i = 0; i < msgList.length; i++) {
    const msg = msgList[i];
    let elem = <div key={i} style={{padding: '5px'}}>
      <label>{msg.sender}   -  {msg.time}</label>
      <div style={{fontSize: 'x-large'}}>{msg.message}</div>
    </div>;
    msgElems.push(elem);
  }


  let workspaceElems = [];
  for (let i = 0; i < workspaces.length; i++) {
    const workspace = workspaces[i];
    console.log(workspace);
    const clickCb = () => {
      setMsgList([]);
      msgListRef.current = [];
      setCurrentWorkspace(workspace);
    }
    let border = '1px solid black';
    if (currentWorkspace.id === workspace.id) {
      border = '2px solid red';
    }
    let elem = <div key={i} style={{padding: '5px', margin: '5px', border: border, cursor: 'pointer'}} onClick={clickCb}>
      <div>{workspace.name}</div>
      <div>{workspace.memberIds.length} people</div>
    </div>
    workspaceElems.push(elem);
  }
  if (workspaceElems.length === 0) {
    workspaceElems.push(<div key='-1'>No workspace</div>);
  }


  const renderMembers = (members) => {
    let elems = [];
    if (members.length > 0) {
      elems.push(<div key='0' style={{marginTop: '3px'}}>Members</div>);
    }
    for (const member of members) {
      let elem = <div key={member.id} style={{margin: '3px'}}>
        {member.username} ({member.id})
      </div>;
      elems.push(elem);
    }
    return elems;
  }

  let workspaceMembersElem = renderMembers(workspaceMembers);
  let channelMembersElem = renderMembers(channelMembers);

  let channelElems = [];
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    console.log(channel);
    const clickCb = () => {
      setMsgList([]);
      msgListRef.current = [];
      setCurrentChannel(channel);
    }
    let border = '1px solid black';
    if (currentChannel.id === channel.id) {
      border = '2px solid red';
    }
    let elem = <div key={i} style={{padding: '5px', margin: '5px', border: border, cursor: 'pointer'}} onClick={clickCb}>
      <div>{channel.name}</div>
      <div>{channel.memberIds.length} people</div>
    </div>
    channelElems.push(elem);
  }
  if (channelElems.length === 0) {
    channelElems.push(<div key='-1'>No channel</div>);
  }

  const getAllChannels = async (workspaceId) => {
    let res = await callApi('/channels?workspaceId=' + workspaceId, 'GET', auth.current);
    if (!res.ok)
      throw new Error('api failed');
    res = await res.json();
    let newChannels = [];
    for (let channelId of res.channelIds) {
      res = await callApi('/channels/' + channelId, 'GET', auth.current);
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

  const getAllWorkspaces = async () => {
    let res = await callApi('/workspaces', 'GET', auth.current);
    if (!res.ok)
      throw new Error('cannot get workspaces');
    res = await res.json();
    let newWorkspaces = [];
    for (let workspaceId of res.workspaceIds) {
      res = await callApi('/workspaces/' + workspaceId, 'GET', auth.current);
      if (!res.ok)
        throw new Error('cannot get workspace ' + workspaceId);
      res = await res.json();
      newWorkspaces.push(res);
      if (res.id === currentWorkspace.id) {
        setCurrentWorkspace(res);
      }
      if (currentWorkspace.id === -1 && res.name === 'default') {
        setCurrentWorkspace(res);
      }
    }
    setWorkspaces(newWorkspaces);
  }

  const getMembersInfo = async (memberIds) => {
    const members = [];
    for (const id of memberIds) {
      let res = await callApi('/users/' + id, 'GET', auth);
      if (res.ok) {
        res = await res.json();
        members.push(res);
      } else {
        console.error(res);
        alert('Cannot get member info');
        break;
      }
    }
    return members;
  }

  const getMessages = async (channelId) => {
    let res = await callApi('/messages?channelId=' + channelId);
    if (!res.ok) {
      console.error(res);
      alert('cannot get historical messages');
    }
    res = await res.json()
    let newMessages = [];
    for (let m of res.messages) {
      let user = await getUser(m.senderId, auth);
      let message = {
        sender: user.username,
        message: m.content,
        time: new Date(m.timeCreated).toLocaleString()
      }
      newMessages.push(message)
    }
    newMessages.reverse();
    return newMessages;
  }

  const addUserToChannel = (ws, cid, uid) => {
    let req = {
      userId: parseInt(uid),
      channelId: parseInt(cid)
    }
    req = JSON.stringify(req);
    return callApi('/channels/join', 'POST', auth.current, req);
  }

  const addUserToWorkspace = (wid, uid) => {
    let req = {
      userId: parseInt(uid),
      workspaceId: parseInt(wid)
    };
    req = JSON.stringify(req);
    return callApi('/workspaces/join', 'POST', auth.current, req);
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
          (async () => {
            let user = await getUser(res.data.senderId, auth);
            let msg = {
              message: res.data.preview,
              sender: user.username,   // TODO: obtain the user info and then set this sender properly
              time: new Date().toLocaleString()
            }
            console.error(res.data);
            if (res.data.channelId === currentChannel.id) {
              let newMsgList = [...msgListRef.current, msg];
              setMsgList(newMsgList);
              msgListRef.current = newMsgList;
            }
          }) ();
          break;
        case 'infoChanged':
          console.log(res);
          if (res.data.infoType.startsWith('channel')) {
            getAllChannels(currentWorkspace.id);
          } else if (res.data.infoType.startsWith('workspace')) {
            getAllWorkspaces();
          }
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
    getAllWorkspaces().catch(e => {
      console.error(e);
      alert(e);
    });
    
    let newWs = new WebSocket('ws://127.0.0.1:11451/chat-ws');
    setWs(newWs);
  }

  return (
    <div style={{display: 'flex', justifyContent: 'center'}}>
      {/* workspaces */}
      <div style={{width: '200px', marginLeft: '20px', overflow: 'hidden'}}>
        <div style={{marginBottom: '10px'}}>
          <input type='button' value='create workspace' onClick={_ => {
            let name = prompt('workspace name: ');
            if (name) {
              let req = {
                name: name
              }
              req = JSON.stringify(req);
              callApi('/workspaces', 'POST', auth.current, req).then(res => {
                if (!res.ok) {
                  console.error(res);
                  throw new Error('Failed to create workspace');
                }
              }).catch(e => {
                console.error(e);
                alert(e);
              });
            }
          }}></input>
          <input type='button' value='refresh workspace' onClick={_ => {
            getAllWorkspaces().catch(e => {
              console.error(e);
              alert(e);
            });
          }}></input>

          <div style={{display: 'flex'}}>
            <input type='button' value='Add user (id)' style={{marginRight: '5px'}} onClick={_ => {
              addUserToWorkspace(currentWorkspace.id, addUserIdToWorkspaceRef.current.value).then(res => {
                if (!res.ok) {
                  console.error(res);
                  alert('cannot add user');
                } else {
                  addUserIdToWorkspaceRef.current.value = '';
                  alert('Added!');
                }
              });
            }}></input>
            <input type='text' ref={addUserIdToWorkspaceRef}></input>
          </div>

        </div>

        {workspaceElems}

        <div style={{marginTop: '15px'}}>
          {workspaceMembersElem}
        </div>
      </div>


      {/* channels */}
      <div style={{width: '200px', marginLeft: '20px', overflow: 'hidden'}}>
        <div style={{marginBottom: '10px'}}>
          <input type='button' value='create channel' onClick={_ => {
            let name = prompt('channel name: ');
            if (name) {
              let req = {
                name: name,
                workspace: currentWorkspace.id
              }
              req = JSON.stringify(req);
              callApi('/channels', 'POST', auth.current, req).then(res => {
                if (!res.ok) {
                  console.error(res);
                  throw new Error('Failed to create channel');
                }
              });
            }
          }}></input>
          <input type='button' value='refresh channel' onClick={_ => {
            getAllChannels(currentWorkspace.id);
          }}></input>

          <div style={{display: 'flex'}}>
            <input type='button' value='Add user (id)' style={{marginRight: '5px'}} onClick={_ => {
              addUserToChannel(window.ws, currentChannel.id, addUserIdRef.current.value).then(res => {
                if (!res.ok) {
                  console.error(res);
                  alert('cannot add user');
                } else {
                  alert('Added!');
                }
              });
              addUserIdRef.current.value = '';
            }}></input>
            <input type='text' ref={addUserIdRef}></input>
          </div>

        </div>
        {channelElems}

        <div style={{marginTop: '15px'}}>
          {channelMembersElem}
        </div>
      </div>

      <div style={{width: '400px', margin: 'auto', padding: '5px'}}>
        <div style={{marginBottom: '15px'}}>
          <input type="button" value="Login and connect ws" onClick={doConnect}></input>
          <span style={{marginLeft: '5px'}}>{status}</span>
        </div>
        <div>
          <label>user name: </label>
          <input type='text' value={userName} onChange={e => setUserName(e.target.value)}></input>
        </div>
        <div>Workspace ({currentWorkspace.id}): {currentWorkspace.name}</div>
        <div>Channel ({currentChannel.id}): {currentChannel.name}</div>
        
        <div style={{height: '600px', backgroundColor: '#fafafa', overflowY: 'scroll'}}>
          {msgElems}
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px'}}>
          <input type="text" value={msgToSend} onInput={e => setMsgToSend(e.target.value)}></input>
          <input type="button" value="Send" onClick={() => {
            let body = {
              content: msgToSend,
              channelId: currentChannel.id
            }
            body = JSON.stringify(body);
            callApi('/messages/send', 'POST', auth.current, body).then(res => {
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
