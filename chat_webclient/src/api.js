import Event from './event';

export let auth = {
  token: null,
  user: null
}

export async function login(username, password) {
  let res = await callApi('/auth', 'POST', JSON.stringify({
    userName: username
  }));
  if (!res.ok) {
    throw new Error('login failed');
  }
  res = await res.json();
  auth.user = await getUser(res.userId);
  auth.token = res.userId;
  Event.start();
  console.error(auth);
}

const userCache = {};
export async function getUser(id, refresh = false) {
  let user = userCache[id];
  if (!user || refresh) {
    let res = await callApi('/users/' + id, 'GET');
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

export const nullChannel = {
  id: -1,
  name: '(not loaded)',
  memberIds: [],
};

export const nullWorkspace = {
  id: -1,
  name: '(not loaded)',
  memberIds: [],
  channelIds: [],
};

const API_ENDPOINT = 'http://127.0.0.1:11451/api/v1';
export function callApi(path, method, body) {
  return fetch(API_ENDPOINT + path, {
    method: method,
    mode: 'cors',
    body: body,
    headers: {
      authorization: auth.token,
      'content-type': 'application/json',
    },
  });
}

export const getAllChannels = async (workspaceId) => {
  let res = await callApi(
    '/channels?workspaceId=' + workspaceId,
    'GET'
  );
  if (!res.ok) throw new Error('api failed');
  res = await res.json();
  let newChannels = [];
  for (let channelId of res.channelIds) {
    res = await callApi('/channels/' + channelId, 'GET');
    if (!res.ok) throw new Error('api failed');
    res = await res.json();
    newChannels.push(res);
  }
  return newChannels;
};

export const createChannel = (wid, name) => {
  let req = {
    name: name,
    workspace: wid
  };
  req = JSON.stringify(req);
  return callApi('/channels', 'POST', req).then((res) => {
    if (!res.ok) {
      console.error(res);
      throw new Error('Failed to create channel');
    }
  });
}

export const createWorkspace = (name) => {
  let req = {
    name: name,
  };
  req = JSON.stringify(req);
  return callApi('/workspaces', 'POST', req)
    .then((res) => {
      if (!res.ok) {
        console.error(res);
        throw new Error('Failed to create workspace');
      }
    });
}

export const getAllWorkspaces = async () => {
  let res = await callApi('/workspaces', 'GET');
  if (!res.ok) throw new Error('cannot get workspaces');
  res = await res.json();
  let newWorkspaces = [];
  for (let workspaceId of res.workspaceIds) {
    res = await callApi('/workspaces/' + workspaceId, 'GET');
    if (!res.ok) throw new Error('cannot get workspace ' + workspaceId);
    res = await res.json();
    newWorkspaces.push(res);
  }
  return newWorkspaces;
};

export const addUserToChannel = (cid, uid) => {
  let req = {
    userId: parseInt(uid),
    channelId: parseInt(cid),
  };
  req = JSON.stringify(req);
  return callApi('/channels/join', 'POST', req).then(res => {
    if (!res.ok) {
      console.error(res);
      throw Error('Api call failed');
    }
  });
};

export const getMessages = async (channelId) => {
  let res = await callApi('/messages?channelId=' + channelId);
  if (!res.ok) {
    console.error(res);
    throw new Error('cannot get historical messages');
  }
  res = await res.json();
  let newMessages = [];
  for (let m of res.messages.reverse()) {
    let user = await getUser(m.senderId);
    m.sender = user;
    m.time = new Date(m.timeCreated).toLocaleString();
    newMessages.push(m);
  }
  return newMessages;
};

export const getMessageById = async (id) => {
  let res = await callApi('/messages/' + id);
  if (!res.ok) {
    console.error(res);
    throw new Error('cannot get message of id ' + id);
  }
  res = await res.json();
  return res;
}


export const addUserToWorkspace = (wid, uid) => {
  let req = {
    userId: parseInt(uid),
    workspaceId: parseInt(wid)
  };
  req = JSON.stringify(req);
  return callApi('/workspaces/join', 'POST', req);
}


