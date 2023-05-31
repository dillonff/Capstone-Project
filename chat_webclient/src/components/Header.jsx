import React from 'react';
import { Avatar,Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import { useState, useEffect } from 'react';
import Popover from '@mui/material/Popover';
import Grid from '@mui/material/Unstable_Grid2';
import EmailIcon from '@mui/icons-material/Email';
import Typography from '@mui/material/Typography';
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import {getUser} from "../api" 


function Header() {
  //   const history = useHistory();
  //   const [user, setUser] = useState(null);

  //   const moveToAcc = () => {
  //     const user = JSON.parse(localStorage.getItem('user'));
  //     history.push(`/users/${user.uid}`);
  //   };
  //   useEffect(() => {
  //     const data = localStorage.getItem('user');
  //     // setUser(JSON.parse(data));
  //   }, []);

    const [anchorEl, setAnchorEl] = useState(null);
    const [userInfo, setUserInfo] = useState({ name: 'John Doe', email: 'johndoe@example.com' });
    // ...
    const tabAnchorEl = (el, status) => {
      console.log(el, 'eee');
      setAnchorEl(el)
    }
    useEffect(() => {
      const userInfo = localStorage.getItem("userInfo"); // 用户信息
      if (userInfo) {
        setUserInfo(JSON.parse(userInfo))
      }
    }, [])

  return (
    <div className="header">
      <div className="header__left">
        <AccessTimeIcon />
      </div>
      <div className="header__middle">
        <SearchIcon />
        <input placeholder="Search..." />
      </div>
      <div className="header__right">
        <HelpOutlineIcon />
        <div className="header__icons">
          <div className="header__file-icon" >
            <Link to="/file">
              <FolderOpenIcon></FolderOpenIcon>
            </Link>
          </div>
          <Avatar
            className="header__avatar"
            onClick={(event) => tabAnchorEl(event.currentTarget, true)}
          />
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => tabAnchorEl(null, false)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <div className="popover-content">
              <p>Name: {userInfo.username}</p>
              <p>Phone: {userInfo.phone}</p>
                {
                  // userId.toString() === profileUserId ? 
                  <Button 
                      // component={Link} to={ '/editprofile'}
                      href='/editprofile'
                      >
                      Edit Profile
                  </Button>//: ''
                }
              <Box width="100%" /> {/* basically adds a new row */}

              <Grid>
                  <EmailIcon sx={{ size: 100 }} />
              </Grid>
              <Grid>
                  <Typography style={{
                      fontSize: 20
                  }}
                  >
                    {userInfo.email}
                  </Typography>
              </Grid>
            </div>
          </Popover>


      </div>
      </div>
    </div>
  );
}

export default Header;
