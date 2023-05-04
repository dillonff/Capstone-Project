import React from 'react';
import {
  login
} from '../api';

function SimpleLogin({
  defaultUsername,
  onLoggedin
}) {
  const usernameInputRef = React.useRef();
  const [username, setUsername] = React.useState(defaultUsername);

  if (!username) {
    setUsername('user-' + new Date().getTime());
  }
  const doLogin = event => {
    event.preventDefault();
    login(usernameInputRef.current.value, '').then(_ => {
      if (onLoggedin) {

        onLoggedin();

      }
    }).catch(e => {
      console.error(e);
      alert(e);
    });
    return false;
  }
  return <div style={{width: '400px', margin: 'auto', paddingTop: '100px'}}>
    <h2 style={{textAlign: 'center'}}>Chat app login</h2>
    <form style={{textAlign: 'center'}} onSubmit={doLogin}>
      <div>
        <label style={{}}>username: 
          <input style={{margin: '5px'}} type='text' defaultValue={username} ref={usernameInputRef} />
        </label>
      </div>
      <div>
        <input type='submit' value="Login" />
      </div>
    </form>
  </div>
}

export default SimpleLogin;
