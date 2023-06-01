import React from 'react';
import { login, signup } from '../api';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

import logo from '../assets/ValeIcon.png';

function SimpleLogin({ defaultUsername, onLoggedin }) {
  const usernameInputRef = React.useRef();
  const passwordInputRef = React.useRef();
  const formRef = React.useRef();
  const [username, setUsername] = React.useState(defaultUsername);
  const [isSignup, setSignup] = React.useState(false);

  React.useEffect(_ => {
    console.log(formRef.current);
    console.log(new FormData(formRef.current));
  }, []);

  const doLogin = (event) => {
    event.preventDefault();
    login(usernameInputRef.current.value, passwordInputRef.current.value)
      .then((_) => {
        localStorage.setItem("userID", _.id);
        localStorage.setItem("userInfo", JSON.stringify(_));
        console.log(localStorage.getItem("userID"));
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
  const doSignup = (event) => {
    event.preventDefault();
    let d = new FormData(formRef.current);
    signup(
      d.get('username'),
      d.get('password'),
      d.get('password2'),
      d.get('phone'),
      d.get('email'),
      d.get('displayName')
    )
      .then((_) => {
        alert('Signup successfully, you can now login');
        window.location.reload();
      })
      .catch((e) => {
        console.error(e);
        alert(e);
      });
  };
  const flipSignup = (event) => {
    event.preventDefault();
    if (isSignup) {
      setSignup(false);
    } else {
      setSignup(true);
    }
  };
  return (
    <div style={{ width: '400px', margin: 'auto', paddingTop: '50px', paddingBottom: '20px' }}>
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <img src={logo} height="80"></img>
      </div>
      <h2 style={{ textAlign: 'center' }}>
        {isSignup ? 'Create an account' : 'Login to Vale'}
      </h2>
      <Form ref={formRef}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            required
            isInvalid={false}
            ref={usernameInputRef}
          />
          <Form.Text className="text-muted"></Form.Text>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            name="password"
            required
            placeholder="Password"
            ref={passwordInputRef}
          />
        </Form.Group>

        {isSignup && <>
          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              name="password2"
              placeholder="Confirm Password"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter Email"
              name="email"
              isInvalid={false}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Phone"
              name="phone"
              isInvalid={false}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Display Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Display Name"
              name="displayName"
              isInvalid={false}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>
        </>}

        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="primary"
            type="submit"
            onClick={isSignup ? doSignup : doLogin}
          >
            {isSignup ? 'Signup' : 'Login'}
          </Button>
          <a href="#" onClick={flipSignup}>
            {isSignup ? 'Return to Login' : 'Create an account'}
          </a>
        </div>
      </Form>
    </div>
  );
}

export default SimpleLogin;
