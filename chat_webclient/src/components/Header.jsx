import { Avatar } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SearchIcon from '@mui/icons-material/Search';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useState, useEffect } from 'react';
// import { useHistory } from 'react-router-dom';

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
        <Avatar className="header__avatar" />
      </div>
    </div>
  );
}

export default Header;
