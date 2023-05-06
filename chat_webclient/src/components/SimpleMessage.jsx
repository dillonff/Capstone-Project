import React from 'react';

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
    return <div key={message.id} style={{padding: '5px'}} ref={msgRef}>
        <label>
            <div style={{display: 'inline', fontWeight: 'bold'}}>{message.sender.username}</div>  - {time}
        </label>
        <div style={{fontSize: 'x-large'}}>{message.content}</div>
    </div>
}

export default SimpleMessage;
