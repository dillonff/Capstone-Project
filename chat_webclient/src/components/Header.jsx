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
import BadgeIcon from '@mui/icons-material/Badge';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { Link } from "react-router-dom";
import {auth, getUser, logout} from "../api" 


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

    const [userInfo, setUserInfo] = useState({});

    const tabAnchorEl = (el, status) => {
      console.log(el, 'eee');
      setAnchorEl(el)
    }
    useEffect(() => {
      const userInfo = auth.user;
      if (userInfo) {
        setUserInfo(userInfo);
      }
    }, [])

    const handleprofile=()=>{
      const w=window.open('about:blank');
      w.location.href='/editprofile';
    }

    const handlefile=()=>{
      const w=window.open('about:blank');
      w.location.href='/file';
    }

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
              <FolderOpenIcon           onClick={handlefile}>
              </FolderOpenIcon>
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
            <div className="popover-content" style={{padding: '10px'}}>
              <Grid>
                    <BadgeIcon sx={{ size: 100 }}/>

            Name: {userInfo.username}
            </Grid>
            <Grid>
            <LocalPhoneIcon sx={{ size: 100 }}/>
              Phone: {userInfo.phone}
              </Grid>
              <Grid>
                  <EmailIcon sx={{ size: 100 }} />
                    Email:{userInfo.email}
              </Grid>
              {
                  // userId.toString() === profileUserId ? 
                  <>
                    <Button 
                        // component={Link} to={ '/editprofile'}
                      //  href='/editprofile'
                      onClick={handleprofile}
                        >
      
                        Edit Profile
                    </Button>
                    <br />
                    <Button onClick={logout}>Log out</Button>
                  </>
                }
              <Box width="100%" /> {/* basically adds a new row */}

            </div>
          </Popover>


      </div>
      </div>
    </div>
  );
}

export default Header;
