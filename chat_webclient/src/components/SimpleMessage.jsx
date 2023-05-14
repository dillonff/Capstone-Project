import React from 'react';
import profilePic from './profile.png';

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
                <div style={{display: 'inline', fontWeight: 'bold'}}>{message.sender.username}</div>  - {time}
            </label>
            <div style={{fontSize: 'x-large'}}>{message.content}</div>
        </div>
    </div>
}

export default SimpleMessage;
