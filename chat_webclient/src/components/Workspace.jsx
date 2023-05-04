
import React from 'react';
import {
  auth,
  callApi,
  getAllChannels,
  nullChannel,
  addUserToWorkspace,
  createChannel
} from '../api.js';
import ChannelList from './ChannelList.jsx';
import ChannelContainer from './ChannelList.jsx';
import Channel from './Channel';
import Event from '../event';

const Workspace = ({ initialWorkspace }) => {
  const workspace = initialWorkspace;
  let [channels, setChannels] = React.useState([]);
  let [currentChannel, setCurrentChannel] = React.useState(nullChannel);
  let addUserIdToWorkspaceRef = React.useRef();

  React.useEffect(_ => {
    getAndUpdateChannels();
  }, []);

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


  return <div style={{ display: 'flex', height: '100%' }}>
    {/**workspace stuff */}
    <div style={{ width: '400px', marginLeft: '20px', overflow: 'hidden' }}>

      {/* workspace info */}
      <div>
        <div>Current workspace ({workspace.id}): {workspace.name}</div>
      </div>

      {/* some buttons */}

      <div style={{ display: 'flex' }}>
        <input
          type="button"
          value="Add user (id)"
          style={{ marginRight: '5px' }}
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
        ></input>
        <input type="text" ref={addUserIdToWorkspaceRef}></input>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <input
          type="button"
          value="create channel"
          onClick={_ => {
            let name = prompt('channel name');
            if (name) {
              createChannel(workspace.id, name).catch(e => {
                console.error(e);
                alert(e);
              })
            }
          }}
        ></input>
        <input
          type="button"
          value="refresh channel"
          onClick={(_) => {
            getAndUpdateChannels();
          }}
        ></input>


      </div>

      <ChannelList
        channels={channels}
        selectedChannel={currentChannel}
        onChannelClick={c => setCurrentChannel(c)}
      />
    </div>

    {/** channel component */}
    <div style={{height: "100%", width: '100%'}}>
      <Channel channel={currentChannel} />
    </div>
  </div>
};

export default Workspace;
