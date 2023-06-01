import { Button, Checkbox, FormControlLabel, TextField } from '@mui/material';
import React from 'react';
import { createChannel } from '../api';
import { AddGlobalModalsContext } from '../AppContext';
import { showError } from '../util';


export function CreateChannelForm({
  workspace,
  onClose
}) {
  const [isPublic, setPublic] = React.useState(true);
  const formRef = React.useRef();
  const addGlobalModal = React.useContext(AddGlobalModalsContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const d = new FormData(formRef.current);
    const publicChannel = formRef.current.publicChannel.checked;
    const autoJoin = formRef.current.autoJoin.checked
    createChannel(workspace.id, d.get('name'), publicChannel, autoJoin).then(_ => {
      if (onClose) {
        onClose();
      }
    }).catch((e) => {
      showError(addGlobalModal, e);
    });
  }

  return <form ref={formRef} onSubmit={handleSubmit}>
    <TextField
      fullWidth
      name="name"
      required
      label="Name"
      variant="standard"
    />
    <FormControlLabel
      label="Channel is public to all workspace members"
      control={
        <Checkbox
          name="publicChannel"
          checked={isPublic}
          onChange={e => setPublic(e.target.checked)}
        />
      }
    />
    {isPublic && <FormControlLabel
      label="New workspace members will auto join this channel"
      control={
        <Checkbox
          name="autoJoin"
          defaultChecked={true}
        />
      }
    />}
    <div style={{textAlign: 'right'}}>
      <Button variant="outlined" type="submit">Save</Button>
    </div>
  </form>
}
