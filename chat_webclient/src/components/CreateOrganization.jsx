import React from 'react';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';

import {
  createOrg
} from '../api';


function CreateOrganization({onCreated}) {
  const formRef = React.useRef();

  return <div style={{minWidth: '300px'}}>
    <h3>Create an organization</h3>
    <form ref={formRef}>
      <TextField fullWidth name="name" required label="Short name" helperText="e.g. Telstra" variant="standard" />
      <TextField fullWidth name="fullName" required label="Organization Full Name" variant="standard" helperText="e.g. Telstra Group Limited" />
      <TextField fullWidth name="email" type="email" required label="Organization Contact Email" variant="standard" helperText="name@org.domain.com" />
      <TextField fullWidth name="description" required label="Description" multiline variant="standard" />
      <div>
        <Button variant="outlined" onClick={_ => {
          const fd = new FormData(formRef.current);
          createOrg(fd.get('name'), fd.get('fullName'), fd.get('email'), fd.get('description')).then(_ => {
            if (onCreated) {
              onCreated();
            }
          })
        }}>Create</Button>
      </div>
    </form>
  </div>
}

export default CreateOrganization;
