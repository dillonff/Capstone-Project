import { IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import React from 'react';
import { getDmName } from '../util';
import UserAvatar from './UserAvatar';
import SimpleDetailDialog from './SimpleDetailDialog';
import NewDirectMessage from './NewDirectMessage';


export function DirectMessageList({
  channels,
  onDmSelected,
  currentChannelId,
  workspace
}) {
  const [openNewDm, setOpenNewDm] = React.useState(false);

  const dmElems = [];
  for (const channel of channels) {
    if (!channel.directMessage)
      continue;
    const name = getDmName(channel);
    const onDmClick = () => {
      if (onDmSelected) {
        onDmSelected(channel);
      }
    }
    let className = "dmuser__wrapper";
    if (currentChannelId === channel.id) {
      className = "workspace__wrapper__selected";
    }
    dmElems.push(
      <div className={className} onClick={onDmClick}>
        <UserAvatar key={channel.id} username={name}></UserAvatar>
        <div style={{marginLeft: '10px'}}>{name}</div>
      </div>
    );
  }
  return <div>
    <h5 className="d-flex justify-content-between align-items-center">
      <span>Direct Messages</span>
      <IconButton sx={{color: 'inherit'}} onClick={_ => setOpenNewDm(true)}> <AddIcon /> </IconButton>
    </h5>
    {dmElems}
    <div>
      <SimpleDetailDialog
        open={openNewDm}
        onClose={_ => setOpenNewDm(false)}
        title="New Direct Message"
      >
        <NewDirectMessage
          workspace={workspace}
          channels={channels}
          onSelected={_ => setOpenNewDm(false)}
        />
      </SimpleDetailDialog>
    </div>
  </div>
}
