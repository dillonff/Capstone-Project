import {
  auth
} from './cred';

import {
  processServerMessage
} from './api';

const WS_URL = 'ws://127.0.0.1:11451/chat-ws';

let socket = null;
const callbacks = new Set();
const defaultCallback = {
  onAuth: null, //(ok) => {},
  onNewMessage: null, //(data) => {},
  onInfoChanged: null, //(data) => {},
  onEventLost: null //(data) => {}
}

const debugCallback = {
  onAuth: (ok) => {},
  onNewMessage: (data) => {},
  onInfoChanged: (data) => {},
  onEventLost: (data) => {}
}

function onWsOpen() {
  socket.send(JSON.stringify({
    'type': 'auth',
    'args': {
      'userName': auth.user?.username
    }
  }));
}

function onWsClose(event) {
  console.log(event);
  reconnectDelay();
}

function onWsError(event) {
  console.error(event);
  reconnectDelay();
}

function callAllCallback(name, ...args) {
  console.log('callAllCallback: ', arguments);
  for (const cb of callbacks) {
    console.log(cb);
    try {
      if (cb[name]) {
        cb[name](...args);
      }
    } catch (e) {
      console.error(e);
    }
  }
}

function onMessage(event) {
  let res = JSON.parse(event.data);
  console.log(res);
  console.log(callbacks);
  switch (res.type) {
    case 'res':
      handleRes(res);
      break;
    case 'newMessage':
      console.log('calling all onNewMessage...');
      processServerMessage(res.data).then(_ => {
        callAllCallback('onNewMessage', res.data);
      });
      break;
    case 'infoChanged':
      callAllCallback('onInfoChanged', res.data);
      break;
    default:
      console.error('bad ws message received:', res);
  }
}

function handleRes(data) {
  switch (data.request) {
    case 'auth':
      callAllCallback('onAuth', data.success);
      if (!data.success) {
        auth.token = null;
        console.error('ws auth failed!');
        socket.close();
      }
      break;
    default:
      console.error('bad ws messages received:', data);
  }
}

function start() {
  if (!auth.token) {
    console.error('user not authenticated');
    reconnectDelay();
    return;
  }
  if (socket) {
    socket.onopen = null;
    socket.onclose = null;
    socket.onerror = null;
    socket.onmessage = null;
  }
  socket = new WebSocket(WS_URL);
  socket.onopen = onWsOpen;
  socket.onclose = onWsClose;
  socket.onerror = onWsError;
  socket.onmessage = onMessage;
}

function reconnectDelay(timeout) {
  if (!timeout) {
    timeout = 5000;
  }
  setTimeout(() => {
    start();
  }, timeout);
}

function getDefaultCallback() {
  let cb = {};
  Object.assign(cb, defaultCallback);
  return cb;
}

function addListener(callback) {
  console.log("add listener:");
  console.log(callback);
  checkCallback(callback);
  callbacks.add(callback);
  // Object.defineProperty(callbacks, callback, {});
}

function removeListener(callback) {
  console.log("remove listener:");
  console.log(callback);
  if (!callbacks.has(callback)) {
    throw new Error('invalid callback: ' + callback);
  }
  callbacks.delete(callback);
}

function checkCallback(cb) {
  for (const entry in cb) {
    if (!(entry in defaultCallback)) {
      console.warn('unknown callback defined: ' + entry);
      break;
    }
  }
}

export default {
  start,
  getDefaultCallback,
  addListener,
  removeListener
}

