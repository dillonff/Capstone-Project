import React from 'react';
import profilePic from './profile.png';

import {
    getOrg,
    nullOrganization
} from '../api';

function SimpleMessage({
    message,
    shouldScrollTo
}) {
    const msgRef = React.useRef();

    React.useEffect(_ => {
        if (shouldScrollTo) {
            console.log('should scroll: ', message.id, shouldScrollTo);
            msgRef.current.scrollIntoView();
        }
    }, []);

    const time = new Date(message.timeCreated).toLocaleString();
    return <div key={message.id} style={{padding: '6px', display: 'flex', alignItems: 'start'}} ref={msgRef}>
        <div style={{padding: "5px"}}>
            <img height="40px" src={profilePic}></img>
        </div>
        <div>
            <label>
                <div style={{display: 'inline', fontWeight: 'bold'}}>{
                    (!message.organization || message.organization.id === -1) ? message.sender.username : (message.organization.name + ` (${message.sender.username})`)
                }</div>  - {time}
            </label>
            <div style={{fontSize: 'x-large'}}>{message.content}</div>
        </div>
    </div>
}

export default SimpleMessage;
