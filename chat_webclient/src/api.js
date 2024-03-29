import Event from './event';
import {
  auth,
  nullUser
} from './cred';
import { encodeUrlParams } from './util';

export {
  auth,
  nullUser
};

export class ApiError extends Error {
  constructor(message, cause) {
    super(message, {cause: cause});
  }
}

export const nullOrganization = {
  id: -1,
  name: "Org not loaded",
  fullName: "Organization not loaded",
  email: "",
  description: "unknown organization"
}



export async function login(username, password) {
  let res = await callApiJsonChecked('/auth', 'POST', JSON.stringify({
    username: username,
    password: password
  }));
  auth.token = res.token;
  auth.user = await getUser(res.userId);
  Event.start();
  console.error(auth);
  localStorage.setItem('chat.token', res.token);
  return auth.user
}

export async function loginToken() {
  let token = localStorage.getItem("chat.token");
  if (!token) {
    throw new Error("no token");
  }
  auth.token = token;
  let res = await getUser('current', true);
  auth.user = res;
  Event.start();
}

export function logout() {
  localStorage.removeItem("chat.token");
  window.location.reload();
}

export async function signup(username, password, confirmPassword, phone, email, displayName) {
  if (password !== confirmPassword) {
    throw new Error('Passwords mismatch.');
  }
  let res = await callApiJsonChecked('/users', 'POST', JSON.stringify({
    username: username,
    password: password,
    phone: phone,
    email: email,
    displayName: displayName
  }));
  return res;
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

export const updateUser = (date) => {
  return callApiJsonChecked('/userUpdate', 'POST',JSON.stringify(date));
}


export const getUsers = async (filters, refresh = true) => {
  filters = encodeUrlParams(filters);
  let res = await callApiJsonChecked('/users?' + filters, 'GET');
  for (const user of res) {
    userCache[user.id] = user;
  }
  return res;
}

export const nullChannel = {
  id: -1,
  name: '(not loaded)',
  memberIds: [],
};

export const nullWorkspace = {
  id: -1,
  name: '(not loaded)',
  members: [],
  channelIds: [],
};

export const nullOrganizationMember = {
  id: -1,
  userId: -1,
  organizationId: -1,
  displayName: '(member not loaded)',
  autoJoinChannel: false
}

export const API_ENDPOINT = 'http://127.0.0.1:11451/api/v1';
export function callApi(path, method, body) {
  const headers = {
    authorization: auth.token
  };
  if (typeof body === 'string') {
    headers['content-type'] = 'application/json';
  } else if (body instanceof FormData) {
    // nothing to do
  }
  return fetch(API_ENDPOINT + path, {
    method: method,
    mode: 'cors',
    body: body,
    headers: headers
  });
}

export async function callApiJsonChecked(path, method, body) {
  let res;
  try {
    res = await callApi(path, method, body);
  } catch (e) {
    throw new ApiError("Cannot contact chat server.", e);
  }
  try {
    let data = await res.json();
    if (!res.ok) {
      if (data.message) {
        throw new ApiError(data.message);
      } else {
        throw new ApiError("Server returned a invalid response");
      }
    }
    return data;
  } catch (e) {
    if (e instanceof ApiError)
      throw e;
    throw new ApiError("Invalid response from chat server.", e);
  }
}

export const getAllChannels = async (workspaceId) => {
  let res = await callApiJsonChecked(
    '/channels?workspaceId=' + workspaceId,
    'GET'
  );
  return res;
};

export const getChannelMembers = async (channelId) => {
  let res = await callApiJsonChecked(`/channels/${channelId}/members`, 'GET');
  return res;
}

export const processChannelMembers = async (members) => {
  for (let m of members) {
    switch (m.type) {
      case 0:
        m.user = await getUser(m.userId);
        break;
      case 1:
        m.organization = await getOrg(m.organizationId);
        break;
      default:
        break;
    }
  }
}

export const createChannel = (wid, name, publicChannel, autoJoin, peerMemberType, peerMemberId) => {
  let req = {
    name: name,
    workspace: wid,
    publicChannel: publicChannel,
    autoJoin: autoJoin
  };
  if (peerMemberId) {
    req.peerMemberId = parseInt(peerMemberId);
    req.peerMemberType = parseInt(peerMemberType);
  }
  req = JSON.stringify(req);
  return callApiJsonChecked('/channels', 'POST', req);
}

export const handleChannelPin = (channel, pin) => {
  if (pin) {
    pin = 'pin';
  } else {
    pin = 'unpin';
  }
  return callApiJsonChecked(`/channels/${channel.id}/${pin}`, 'PUT');
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

export const getAllWorkspaces = async (orgId) => {
  let query = '';
  if (orgId && orgId > 0) {
    query = '?organizationId=' + orgId
  }
  let res = await callApiJsonChecked('/workspaces' + query, 'GET');
  return res;
};

export const addUserToChannel = (cid, uid) => {
  let req = {
    memberId: parseInt(uid),
    channelId: parseInt(cid),
    type: 0  // user
  };
  req = JSON.stringify(req);
  return callApiJsonChecked('/channels/join', 'POST', req);
};

export const addOrgToChannel = (cid, oid) => {
  let req = {
    memberId: parseInt(oid),
    channelId: parseInt(cid),
    type: 1  // org
  };
  req = JSON.stringify(req);
  return callApiJsonChecked('/channels/join', 'POST', req);
}

export const processServerMessage = async (m) => {
  let user = await getUser(m.senderId);
  if (m.organizationId > 0) {
    let org = await getOrg(m.organizationId);
    m.organization = org;
  } else {
    m.organization = nullOrganization;
  }
  m.sender = user;
  m.time = new Date(m.timeCreated).toLocaleString();
}

export const getWorkspaceMembers = async (workspaceId) => {
  let members = await callApiJsonChecked(`/workspaces/${workspaceId}/members`);
  // get all users info in one request and save them to cache
  // await getUsers({workspaceId: workspaceId});

  return members;
}

export const processWorkspaceMembers = async (members) => {
  for (let m of members) {
    switch (m.type) {
      case 0:
        m.user = await getUser(m.memberId);
        break;
      case 1:
        m.organization = await getOrg(m.memberId);
        break;
      default:
        break;
    }
  }
}

export const getMessages = async (channelId) => {
  let res = await callApi('/messages?pageSize=50&channelId=' + channelId);
  if (!res.ok) {
    console.error(res);
    throw new Error('cannot get historical messages');
  }
  res = await res.json();
  let newMessages = [];
  for (let m of res.messages.reverse()) {
    await processServerMessage(m);
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


export const addUserToWorkspace = (wid, email) => {
  let req = {
    workspaceId: parseInt(wid),
    type: 0 // user
  };
  if (!isNaN(parseInt(email))) {
    req.memberId = parseInt(email);
  } else {
    req.email = email;
  }
  req = JSON.stringify(req);
  return callApiJsonChecked('/workspaces/join', 'POST', req);
}

export const addOrgToWorkspace = (wid, email) => {
  let req = {
    workspaceId: parseInt(wid),
    type: 1  // org
  };
  if (!isNaN(parseInt(email))) {
    req.memberId = parseInt(email);
  } else {
    req.email = email;
  }
  req = JSON.stringify(req);
  return callApiJsonChecked('/workspaces/join', 'POST', req);
}

const orgCache = {};
export const getOrg = async (id, refresh) => {
  if (orgCache[id] && !refresh) {
    return orgCache[id];
  }
  let res = await callApi('/organizations/' + id, 'GET');
  if (res.ok) {
    res = await res.json();
    orgCache[res.id] = res;
    return res;
  }
  throw new Error('Cannot get org ' + id);
}

export const getOrgs = async () => {
  let res = await callApi('/organizations', 'GET');
  if (res.ok) {
    res = await res.json();
    res.data.map(org => {
      orgCache[org.id] = org;
    });
    return res.data;
  }
  throw new Error('Cannot get orgs');
}

export const createOrg = (name, fullName, email, description) => {
  const body = {
    name: name,
    fullName: fullName,
    email: email,
    description: description
  }
  return callApiJsonChecked('/organizations', 'POST', JSON.stringify(body));
}

export const joinOrg = (orgId, userId, userEmail) => {
  let body = {};
  if (userId) {
    body.userId = userId;
  }
  if (userEmail) {
    body.userEmail = userEmail;
  }
  body = JSON.stringify(body);
  return callApiJsonChecked('/organizations/' + orgId + '/members', 'POST', body);
}

export const setChannelRead = (channelId) => {
  return callApiJsonChecked('/channels/' + channelId + '/read', 'PUT');
}

export const getMembersInfo = async (rawMembers) => {
  const members = [];
  for (let m of rawMembers) {
    switch (m.type) {
      case 0:
        const user = await getUser(m.memberId);
        m = {...m, user: user};
        members.push(m);
        break;
      case 1:
        const org = await getOrg(m.memberId);
        m = {...m, organization: org};
        members.push(m);
        break;
      default:
        break;
    }
  }
  return members;
};

export const getFile = async (id, workspace,sortOptions) => {
  const date={
    id:id,
    workspace:workspace,
    sortOptions:sortOptions
  }
  return await callApiJsonChecked(`/files/list`, 'POST',JSON.stringify(date));
}

export const getWorkspaceAll = async () => {
  let res = await callApi(`/workspaces`, 'GET');
  if (res.ok) {
    res = await res.json();
    return res;
  }
  throw new Error('Cannot get File');
}