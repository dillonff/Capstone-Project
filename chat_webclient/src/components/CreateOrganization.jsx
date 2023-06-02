import React from 'react';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';

import OrganizationForm from './OrganizationForm';

import {
  createOrg
} from '../api';
import { AddGlobalModalsContext } from '../AppContext';
import { showError } from '../util';


function CreateOrganization({onCreated}) {
  const addGlobalModal = React.useContext(AddGlobalModalsContext);

  const formRef = React.useRef();

  return <div style={{minWidth: '300px'}}>
    <h3>Create an organization</h3>
    <OrganizationForm formRef={formRef} />
    <div style={{textAlign: 'right', marginTop: '10px'}}>
      <Button variant="outlined" onClick={_ => {
        const fd = new FormData(formRef.current);
        createOrg(fd.get('name'), fd.get('fullName'), fd.get('email'), fd.get('description')).then(_ => {
          if (onCreated) {
            onCreated();
          }
        }).catch(e => {
          showError(addGlobalModal, e);
        });
      }}>Create</Button>
    </div>
  </div>
}

export default CreateOrganization;
