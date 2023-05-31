import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import { Avatar, Box } from '@mui/material';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


// Redux Imports
import { Navigate, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from 'react-redux'
import {updateUser,getUser} from "../api" 

export default function Edit() {

  const [user, setUser] = useState({
    "id": '',
    "username": "",
    "password": "",
    "phone": "",
    "email": "",
    "isDeleted": ''
  });

  useEffect(() => {
    const userID = localStorage.getItem("userID"); 
     getUser(userID).then((e)=>{
        console.log(e);
        setUser(e)
     })
  }, [])
  const setValue = (e, key)=>{
    let newState = {...user}
    newState[key] = e.target.value
    setUser(newState)

  };
  const prohibitRefresh = (e) => {
    e.preventDefault() || (e.returnValue = false);  
  };
  const updateUserInfo = (e) => {
    console.log(user);
    const job = {
      id:user.id,
      username:user.username,
      email:user.email,
      phone:user.phone
    }
    updateUser(job).then((e)=>{console.log("修改成功");})
  };
  
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
            onSubmit={(e) => updateUserInfo(e)}
           > 
            <Typography style={{
                color: "#2196f3",
                fontWeight: 'bold',
                fontSize: 30
              }}
            >
              Edit profile
            </Typography>
            <TextField
              hidden={true}
              id="id"
              name="id"
             value={user.id}
              autoFocus
              // hideLabel="true"
              style={{
                display: 'none'
              }}
            />
            <Typography style={{
              fontSize: 20
            }}>
              Name
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              name="username"
              value={user.username}
              onChange={(e) => { setValue(e, 'username') }}
              autoFocus
            />

            <Typography style={{
              fontSize: 20
            }}
            >
              Email
            </Typography>
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="email"
              value={user.email}
              type="text"
              id="email"
              onChange={(e) => { setValue(e, 'email') }}
            />
            <Typography style={{
              fontSize: 20
            }}
            >
              Phone Number
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              name="phone"
              value={user.phone}
              id="phone"
              onChange={(e) => { setValue(e, 'phone') }}
            />
            <Button
               fullWidth
               variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={e => updateUserInfo(e)}
            >
              Update
            </Button>
            <Button component={Link} to={ '/changepassword'}>
              Change Password
            </Button> 
          </Box>
        </CardContent>
      </Card>
    </>
  )
}