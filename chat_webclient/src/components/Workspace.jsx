import React from 'react';

import Button from 'react-bootstrap/Button';

import {
  auth,
  callApi,
  getAllChannels,
  nullChannel,
  addUserToWorkspace,
  createChannel,
} from '../api.js';
import ChannelList from './ChannelList.jsx';
import ChannelContainer from './ChannelList.jsx';
import Channel from './Channel';
import Event from '../event';

const Workspace = ({ initialWorkspace }) => {
  const workspace = initialWorkspace;
  let [channels, setChannels] = React.useState([]);
  let [currentChannel, setCurrentChannel] = React.useState(nullChannel);
  let [members, setMembers] = React.useState([]);
  let addUserIdToWorkspaceRef = React.useRef();

  React.useEffect((_) => {
    getAndUpdateChannels();
  }, []);

  const getMembersInfo = async (memberIds) => {
    const members = [];
    for (const id of memberIds) {
      let res = await callApi('/users/' + id, 'GET');
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

  const getAndUpdateChannels = async _ => {
    let newChannels = channels;
    try {
      newChannels = await getAllChannels(workspace.id);
    } catch (e) {
      console.error(e);
      alert(e);
    }
    for (const channel of newChannels) {
      if (channel.id === currentChannel.id) {
        setCurrentChannel(channel);
      }
      if (currentChannel.id === -1 && channel.name === 'general') {
        setCurrentChannel(channel);
      }
    }
    setChannels(newChannels);
  }

  React.useEffect(_ => {
    if (workspace.id === -1)
      return;
    let cb = Event.getDefaultCallback();
    cb.onInfoChanged = (data) => {
      if (data.infoType.startsWith('channel')) {
        getAndUpdateChannels();
      }
    };
    Event.addListener(cb);
    return _ => {
      Event.removeListener(cb);
    }
  }, [workspace, currentChannel]);

  React.useEffect(_ => {
    if (workspace.id === -1)
      return;
    getMembersInfo(workspace.memberIds).then(ms => {
      setMembers(ms);
    });
  }, [workspace]);


  return <div style={{ display: 'flex', height: '100%', flexShrink: '0' }}>
    {/**workspace stuff */}
    <div style={{ flex: '0 0 380px', paddingLeft: '20px', overflow: 'auto', height: "100%" }}>

      {/* workspace info */}
      <div>
        <h3>Workspace ({workspace.id}): {workspace.name}</h3>
      </div>

      {/* some buttons */}

      <div style={{ display: 'flex', marginBottom: '5px', alignItems: 'center' }}>
        <Button
          type="button"
          style={{margin: '5px', flexGrow: 1}}
          size="sm"
          variant='primary'
          onClick={(_) => {
            addUserToWorkspace(
              workspace.id,
              addUserIdToWorkspaceRef.current.value
            ).then((res) => {
              if (!res.ok) {
                console.error(res);
                alert('cannot add user');
              } else {
                addUserIdToWorkspaceRef.current.value = '';
                alert('Added!');
              }
            });
          }}
        >Add user (id)</Button>
        <div style={{margin: '5px', display: 'inline'}}>
          <input style={{padding: '5px', minWidth: '30px'}} type="text" ref={addUserIdToWorkspaceRef}></input>
        </div>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <Button
          style={{margin: '5px'}}
          type="button"
          value=""
          variant='success'
          onClick={_ => {
            let name = prompt('channel name');
            if (name) {
              createChannel(workspace.id, name).catch(e => {
                console.error(e);
                alert(e);
              })
            }
          }}
        >create channel</Button>
        <Button
          type="button"
          value="refresh channel"
          variant='secondary'
          onClick={(_) => {
            getAndUpdateChannels();
          }}
        >refresh channels</Button>


      </div>
      <hr />
      <h4>Channels</h4>
      <ChannelList
        channels={channels}
        selectedChannel={currentChannel}
        onChannelClick={c => setCurrentChannel(c)}
      />

      <hr />

      {/**workspace members */}
      <h4>Workspace Members</h4>
      <ul>
          {members.map(m => {
            return <li>{m.username}</li>
          })}
      </ul>

    </div>
    

    {/** channel component */}
    <div style={{height: "100%", width: '100%'}}>
      <Channel channel={currentChannel} workspace={workspace} />
    </div>


  </div>
};

export default Workspace;
