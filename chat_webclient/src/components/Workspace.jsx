'use strict';

import React from 'react';
import {
  auth,
  callApi,
  getAllChannels,
  nullChannel
} from '../api.js';

const Workspace = (props) => {
  const workspace = props.workspace;
  let [channels, setChannels] = useState([]);
  let [currentChannel, setCurrentChannel] = useState(nullChannel);

  let channelElems = [];
  for (let i = 0; i < channels.length; i++) {
    const channel = channels[i];
    console.log(channel);
    const clickCb = () => {
      setCurrentChannel(channel);
    };
    let elem = <SimpleBoxItem 
      name={channel.name}
      text={channel.memberIds.length + 'people'}
      key={i}
      onClick={clickCb}
      selected={channel.id === currentChannel.id} />
    channelElems.push(elem);
  }
  if (channelElems.length === 0) {
    channelElems.push(<div key="-1">No channel</div>);
  }

  const getAndUpdateChannels = async _ => {
    const newChannels = channels;
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
      if (currentChannel.id === -1 && res.name === 'general') {
        setCurrentChannel(res);
      }
    }
    setChannels(newChannels);
  }

  
  return <div style={{ width: '200px', marginLeft: '20px', overflow: 'hidden' }}>

    {/* workspace info */}
    <div>
      <div>Current workspace ({workspace.id}): {workspace.name}</div>
    </div>

    {/* some buttons */}
    <div style={{ marginBottom: '10px' }}>
      <input
        type="button"
        value="create channel"
        onClick={_ => {
          let name = prompt('channel name');
          if (name) {
            createChannel(workspace.id, name).catch(e => {
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

      <div style={{ display: 'flex' }}>
        <input
          type="button"
          value="Add user (id)"
          style={{ marginRight: '5px' }}
          onClick={(_) => {
            addUserToChannel(
              window.ws,
              currentChannel.id,
              addUserIdRef.current.value
            ).then((res) => {
              if (!res.ok) {
                console.error(res);
                alert('cannot add user');
              } else {
                alert('Added!');
              }
            });
            addUserIdRef.current.value = '';
          }}
        ></input>
        <input type="text" ref={addUserIdRef}></input>
      </div>
    </div>

    {/* channel list */ }
    {channelElems}
  </div>
};

export default Workspace;
