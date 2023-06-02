import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import UserAvatar from './UserAvatar';


function MemberItem({member}) {
  return <ListItem disableGutters>
    <ListItemAvatar>
      <UserAvatar username={member.displayName} />
    </ListItemAvatar>
    <ListItemText
      primary={member.displayName}
      // secondary={
      //   <React.Fragment>
      //     <Typography
      //       sx={{ display: 'inline' }}
      //       component="span"
      //       variant="body2"
      //       color="text.primary"
      //     >
      //       Ali Connors
      //     </Typography>
      //     {" — I'll be in your neighborhood doing errands this…"}
      //   </React.Fragment>
      // }
    />
  </ListItem>
}

export default function OrganizationMemberList({members, onAddClick}) {
  return (
    <div className="flex-scroll-parent" style={{minHeight: '0'}}>
      <div className="d-flex justify-content-between">
        <div>{members.length} people</div>
        <Button variant="outlined" onClick={onAddClick} >Add member</Button>
      </div>
      <List className="flex-scroll" sx={{ width: '100%', bgcolor: 'background.paper', minHeight: 0 }}>
        {members.map(m => {
          return <>
            <MemberItem member={m} />
            {/* <Divider variant="inset" component="li" /> */}
          </>
        })}
        
      </List>
    </div>
  );
}