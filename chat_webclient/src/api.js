'use strict';

const auth = {
  token: null
}

const userCache = {};
async function getUser(id, auth, refresh = false) {
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
  memberIds: [],
};

const nullWorkspace = {
  id: -1,
  name: '(not loaded)',
  memberIds: [],
  channelIds: [],
};

const API_ENDPOINT = 'http://127.0.0.1:11451/api/v1';
function callApi(path, method, auth, body) {
  return fetch(API_ENDPOINT + path, {
    method: method,
    mode: 'cors',
    body: body,
    headers: {
      authorization: auth,
      'content-type': 'application/json',
    },
  });
}

const getAllChannels = async (workspaceId) => {
  let res = await callApi(
    '/channels?workspaceId=' + workspaceId,
    'GET',
    auth.token
  );
  if (!res.ok) throw new Error('api failed');
  res = await res.json();
  let newChannels = [];
  for (let channelId of res.channelIds) {
    res = await callApi('/channels/' + channelId, 'GET', auth.token);
    if (!res.ok) throw new Error('api failed');
    res = await res.json();
    newChannels.push(res);
  }
  return newChannels;
};

const createChannel = (wid, name) => {
  let req = {
    name: name,
    workspace: wid
  };
  req = JSON.stringify(req);
  return callApi('/channels', 'POST', auth.current, req).then((res) => {
    if (!res.ok) {
      console.error(res);
      throw new Error('Failed to create channel');
    }
  });
}

const createWorkspace = (name) => {
  let req = {
    name: name,
  };
  req = JSON.stringify(req);
  return callApi('/workspaces', 'POST', auth.token, req)
    .then((res) => {
      if (!res.ok) {
        console.error(res);
        throw new Error('Failed to create workspace');
      }
    });
}

const getAllWorkspaces = async () => {
  let res = await callApi('/workspaces', 'GET', auth.current);
  if (!res.ok) throw new Error('cannot get workspaces');
  res = await res.json();
  let newWorkspaces = [];
  for (let workspaceId of res.workspaceIds) {
    res = await callApi('/workspaces/' + workspaceId, 'GET', auth.token);
    if (!res.ok) throw new Error('cannot get workspace ' + workspaceId);
    res = await res.json();
    newWorkspaces.push(res);
  }
  return newWorkspaces;
};

export default {
  auth,
  getUser,
  nullChannel,
  nullWorkspace,
  callApi,
  getAllChannels,
  createChannel,
  createWorkspace,
  getAllWorkspaces
};
