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
import {updateUser,getUser} from "../api" //修改接口，获取用户信息接口

export default function Edit() {

  const [user, setUser] = useState({});

  useEffect(() => {
    const userID = localStorage.getItem("userID"); //登录的账号
     getUser(userID).then((e)=>{
        console.log(e);
     })
  }, [])
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
  const updateUser = (e) => {
    
  prohibitRefresh(e)
  const data = new FormData(e.currentTarget);
    // const data = new FormData(e.currentTarget)
    const id = Number(data.get('id'));
    const name = data.get('Name').toString();
    const number = data.get('mobileNumber').toString();
    const job = {
      username:"",
      email:"",
      phone:""
      //填写对应数据
    }
    updateUser(id,job).then((e)=>{console.log("修改成功");})
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
           /*   onSubmit={(e) => updateUser(e)}
           */
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
              hidden="true"
              id="id"
              name="id"
             // value={user.id}
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
              Name
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              id="Name"
              name="Name"
            //  value={user.Name}
            //  onChange={(e) => { setUser(e.target.value) }}
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
             // value={user.email}
              type="text"
              id="email"
           //   onChange={(e) => { setUser(e.target.value) }}
            />
 {/*  */}
           
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
              name="mobileNumber"
             // value={user.mobileNumber}
              id="mobileNumber"
             // onChange={(e) => { setUser(e.target.value) }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}

            >
              Update
            </Button>
            {
                                //userId.toString() === profileUserId ? 
                                <Button component={Link} to={ '/changepassword?id=' /*+ userId */}>
                                Change Password
                            </Button> 
                            /*: ''*/
                            }
          </Box>
        </CardContent>
      </Card>
    </>
  )
}