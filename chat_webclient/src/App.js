import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';

function App() {
  let [status, setStatus] = React.useState('disconnected');
  let [ws, setWs] = useState(null);
  let [msgList, setMsgList] = useState([]);
  const msgListRef = React.useRef(msgList);
  let [msgToSend, setMsgToSend] = useState('');
  let msgElems = [];
  for (let i = 0; i < msgList.length; i++) {
    const msg = msgList[i];
    let elem = <div key={i}>
      <label>{msg.sender}</label>
      <div style={{fontSize: 'x-large'}}>{msg.message}</div>
    </div>;
    msgElems.push(elem);
  }
  return (
    <div style={{width: '400px', margin: 'auto', padding: '5px'}}>
      <div style={{marginBottom: '15px'}}>
        <input type="button" value="Connect" onClick={() => {
          let newWs = new WebSocket('ws://127.0.0.1:11451/chat-ws');
          newWs.onmessage = (event) => {
            let res = JSON.parse(event.data);
            // console.log(event);
            console.log(res)
            switch (res.type) {
              case 'res':
                break;
              case 'push':
                let msg = {
                  message: res.message,
                  sender: res.senderId
                }
                let newMsgList = [...msgListRef.current, msg];
                setMsgList(newMsgList);
                msgListRef.current = newMsgList;
              default:
                break;
            }
          }
          newWs.onerror = (e) => {
            setStatus('error');
            console.error(e);
          }
          newWs.onopen = (e) => {
            newWs.send(JSON.stringify({cmd: 'auth'}));
            setWs(newWs);
            setStatus('connected');
          }
          newWs.onclose = (e) => {
            setStatus('closed');
          }
        }}></input>
        <span>{status}</span>
      </div>
      <div style={{height: '600px', backgroundColor: '#fafafa', overflowY: 'scroll'}}>
        {msgElems}
      </div>
      <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '15px'}}>
        <input type="text" value={msgToSend} onInput={e => setMsgToSend(e.target.value)}></input>
        <input type="button" value="Send" onClick={() => {
          let msg = {
            cmd: 'sendMessage',
            message: msgToSend
          }
          ws.send(JSON.stringify(msg));
        }}></input>
      </div>
    </div>
  );
}

export default App;
