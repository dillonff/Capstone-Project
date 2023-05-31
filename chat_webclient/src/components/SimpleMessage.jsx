import React from 'react';

import SimpleFileItem from './SimpleFileItem';
import UserAvatar from './UserAvatar';
import { getOrg, nullOrganization } from '../api';

function SimpleMessage({ message, shouldScrollTo }) {
  const msgRef = React.useRef();

  React.useEffect((_) => {
    if (shouldScrollTo) {
      console.log('should scroll: ', message.id, shouldScrollTo);
      msgRef.current.scrollIntoView();
    }
  }, []);

  const time = new Date(message.timeCreated).toLocaleString();
  return (
    <div
      key={message.id}
      className="message"
      //   style={{ padding: '6px', display: 'flex', alignItems: 'start' }}
      ref={msgRef}
    >
      <div style={{ padding: '5px' }}>
        {/* <img height="40px" src={profilePic}></img> */}
        <UserAvatar username={message.sender.username} />
      </div>
      <div>
        <label>
          <div className="message__data">
            {!message.organization || message.organization.id === -1
              ? message.sender.username
              : message.organization.name + ` (${message.sender.username})`}
          </div>{' '}
          - {time}
        </label>
        <div className="message__text">{message.content}</div>
        <div className="message__files">
          {message.files &&
            message.files.map((f) => {
              return <SimpleFileItem file={f} />;
            })}
        </div>
      </div>
    </div>
  );
}

export default SimpleMessage;
