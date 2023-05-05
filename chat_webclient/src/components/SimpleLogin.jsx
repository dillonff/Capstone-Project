import React from 'react';
import {
  login
} from '../api';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter username" ref={usernameInputRef} />
        <Form.Text className="text-muted">
          
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" />
      </Form.Group>
      <Button variant="primary" type="submit" onClick={doLogin}>
        Login
      </Button>
    </Form>
  </div>
}

export default SimpleLogin;
