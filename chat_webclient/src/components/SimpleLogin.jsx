import React from 'react';
import { login } from '../api';
import { Button } from 'react-chat-elements';

function SimpleLogin({ defaultUsername, onLoggedin }) {
  const usernameInputRef = React.useRef();
  const [username, setUsername] = React.useState(defaultUsername);

  if (!username) {
    setUsername('user-' + new Date().getTime());
  }
  const doLogin = (event) => {
    event.preventDefault();
    login(usernameInputRef.current.value, '')
      .then((_) => {
        if (onLoggedin) {
          onLoggedin();
        }
      })
      .catch((e) => {
        console.error(e);
        alert(e);
      });
    return false;
  };
  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <h2 style={{ textAlign: 'center' }}>Chat app login</h2>
          <form style={{ textAlign: 'center' }} onSubmit={doLogin}>
            <div className="auth__form-container_fields-content_input">
              <label hfmlFor="userName"></label>
              User Name
              <input
                type="text"
                defaultValue={username}
                ref={usernameInputRef}
              />
            </div>
            <div className="auth__form-container_fields-content_button">
              <button type="submit" value="Login">
                {'Sign In'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SimpleLogin;
