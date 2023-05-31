import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { Avatar, Box } from '@mui/material';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import md5 from 'js-md5';


// Redux Imports
// import { useSelector, useDispatch } from 'react-redux'

export default function Edit() {
  // const isLoggedIn = useSelector(state => state.user.isLoggedIn)
  // const count = useSelector(state => state.user.counter)
  const [user, setUser] = useState({});
  const [comments, setComments] = useState([]);
  const [authenticated, setAuthenticated] = useState(localStorage.getItem(localStorage.getItem("authenticated") || false));
  const [inputValue, setInputValue] = useState('');
  


  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search)
  //   fetch('http://localhost:8080/user/' + params.get('id'))
  //     .then(response => response.json())
  //     .then(data => {
  //       setUser(data['data']['user']);
  //       // setComments(data['data']['comments']);
  //       // console.log(user.birthday);
  //     })

  // }, []);
  const setValue = (e)=>{
    let value = e.target.value;
    let name = e.target.name;
        this.setUser({
            [name]: value
        })

  };
  const prohibitRefresh = (e) => {
    e.preventDefault() || (e.returnValue = false);  
};
  const updatePassword = (e) => {
  prohibitRefresh(e)
  const data = new FormData(e.currentTarget);
    const id = Number(data.get('id'));
    const newpassword = data.get('newpassword').toString();
    const newpassword2 = data.get('newpassword2').toString();
    const useroldpassword=user.password;
    const encryptedPassword=md5(data.get('oldpassword').toString());
    if(useroldpassword!==encryptedPassword){
        alert("Old password is wrong!")
        return
    }
    else if (newpassword!==newpassword2) {
        alert("Re-enter password is different from the password!")
        return
      }
      else{
        const password=md5(newpassword);
        fetch('http://localhost:8080/updatePassword', {
            method: "POST",
            headers: {
              "Content-type": "application/json"
            },
            body: JSON.stringify({
              "id": id,
              "Name": null,
              "email": null,
              "password": password,
              "birthday": null,
              "mobileNumber": null
            })
          })
            .then(response => response.json())
            .then(data => {
                alert("Change success!");
          window.location = "/profile?id=" + id
              // window.location.href()
            }
            )
        }
    }

  ;
  return (
    <>
      <Card
        sx={{
          minWidth: 800,
          minHeight: 300,
          borderRadius: 5,
          margin: 10,
          boxShadow: 10,
          opacity: 1
        }}
        style={{
          backgroundColor: "white"
        }}
      >
        <CardContent>
          <Box  component="form" 
              onSubmit={(e) => updatePassword(e)}>
            <TextField
              hidden="true"
              id="id"
              name="id"
              value={user.id}
              autoFocus
              hideLabel="true"
              style={{
                display: 'none'
              }}
            />
            <Typography style={{
              fontSize: 20
            }}
            >
              Please enter your old password:
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              id="oldpassword"
              name="oldpassword"
              autoFocus
            />
            <Typography style={{
              fontSize: 20
            }}
            >
              Please enter your new password:
            </Typography>
            <TextField
              margin="normal"
              type="password"
              required
              fullWidth
              id="newpassword"
              name="newpassword"
              autoFocus
            />
                        <Typography style={{
              fontSize: 20
            }}
            >
              Please re-enter your new password:
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              type="password"
              id="newpassword2"
              name="newpassword2"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}

            >
              Change
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  )
}