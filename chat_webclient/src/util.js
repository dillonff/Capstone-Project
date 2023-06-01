import React from 'react';
import SimpleDetailDialog from './components/SimpleDetailDialog';


export function useMountedEffect(func, deps) {
    React.useEffect(_ => {
        let mounted = true;
        const getMounted = _ => mounted;
        const cleanup = func(getMounted);
        return _ => {
            mounted = false;
            if (cleanup) {
                cleanup();
            }
        }
    }, deps);
}

export function findById(id, items, defaultValue) {
    for (const item of items) {
        if (item.id === id) {
            return item;
        }
    }
    return defaultValue;
}

export function encodeUrlParams(params) {
    const pairs = [];
    for (let [key, value] of Object.entries(params)) {
        key = encodeURIComponent(key);
        value = encodeURIComponent(value);
        pairs.push(`${key}=${value}`);
    }
    return pairs.join('&');
}

export function getChannelMemberKey(m) {
    if (m.type === 0) {
        return `0-${m.userId}`;
    } else if (m.type === 1) {
        return `1-${m.organizationId}`;
    } else {
        throw new Error("Invalid channel member type: " + m.type);
    }
}

export function getWorkspaceMemberKey(m) {
    return `${m.type}-${m.memberId}`;
}

export function getDmName(channel) {
    let name = "Direct Message " + channel.id;
    const members = channel.members;
    if (!members || !channel.dmPeerMembers) {
        name = "Direct Message " + channel.id;
    } else {
        const dmPeerMap = {};
        const names = [];
        channel.dmPeerMembers.forEach(dm => {
            dmPeerMap[getChannelMemberKey(dm)] = dm;
        });
        for (const m of members) {
            const dm = dmPeerMap[getChannelMemberKey(m)];
            if (dm) {
                if (m.user) {
                    names.push(m.user.username);
                }
                if (m.organization) {
                    names.push(m.organization.name);
                }
            }
        }
        if (names.length > 3) {
            names = names.slice(0, 3);
            names.push('...');
        }
        name = names.join(', ');
        if (!name) {
            name = "Unknown Direct Message";
        }
    }
    return name;
}

export function orgIsChannelMember(org, channelMembers) {
    const orgKey = `1-${org.id}`;
    for (const m of channelMembers) {
        const mKey = getChannelMemberKey(m);
        if (orgKey === mKey) {
            return true;
        }
    }
    return false;
}

export function showError(addGlobalModal, e) {
    let message = e;
    if (e instanceof Error) {
        console.error(e);
        message = e.message;
    }
    let elem = <div style={{padding: '10px 0', fontSize: 'large'}}>{message}</div>;
    addGlobalModal(SimpleDetailDialog, {title: 'Error', children: elem, fullWidth: false});
}

export function showInfo(addGlobalModal, message) {
    let elem = <div style={{padding: '10px 0', fontSize: 'large'}}>{message}</div>;
    addGlobalModal(SimpleDetailDialog, {title: 'Information', children: elem, fullWidth: false});
}
