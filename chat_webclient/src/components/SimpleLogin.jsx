import React from 'react';
import {
  login,
  signup,
  sugnup
} from '../api';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

import logo from '../assets/ValeIcon.png';

function SimpleLogin({
  defaultUsername,
  onLoggedin
}) {
  const usernameInputRef = React.useRef();
  const passwordInputRef = React.useRef();
  const [username, setUsername] = React.useState(defaultUsername);
  const [isSignup, setSignup] = React.useState(false);

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
  }
  const doSignup = (event) => {
    event.preventDefault();
    const username = usernameInputRef.current.value;
    const password = passwordInputRef.current.value;
    signup(username, password, password).then(_ => {
      alert("Signup successfully, you can now login");
      window.location.reload();
    }).catch(e => {
      console.error(e);
      alert(e);
    });
  }
  const flipSignup = (event) => {
    event.preventDefault();
    if (isSignup) {
      setSignup(false);
    } else {
      setSignup(true);
    }
  }
  return <div style={{width: '400px', margin: 'auto', paddingTop: '50px'}}>
    <div style={{textAlign: 'center', padding: '20px 0'}}>
      <img src={logo} height="80"></img>
    </div>
    <h2 style={{textAlign: 'center'}}>{
      isSignup ? "Create an account" : "Login to Vale"
    }</h2>
    <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Username</Form.Label>
        <Form.Control type="text" placeholder="Enter username" isInvalid={false} ref={usernameInputRef} />
        <Form.Text className="text-muted">
          
        </Form.Text>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" ref={passwordInputRef}/>
      </Form.Group>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button variant="primary" type="submit" onClick={isSignup ? doSignup : doLogin}>
          {isSignup ? "Signup" : "Login"}
        </Button>
        <a href='#' onClick={flipSignup}>
          {isSignup ? "Return to Login" : "Create an account"}
        </a>
      </div>
    </Form>
  </div>
}

export default SimpleLogin;
