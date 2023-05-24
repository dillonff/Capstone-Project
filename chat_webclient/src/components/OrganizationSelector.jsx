import React from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';

import CreateOrganization from './CreateOrganization';

import {
  OrganizationIdContext,
  OrganizationsContext
} from '../AppContext';
import {
  auth,
  nullOrganization
} from '../api';
import {
  findById
} from '../util';

export default function OrganizationSelector({}) {
  const [orgId, setOrgId] = React.useContext(OrganizationIdContext);
  const [orgs] = React.useContext(OrganizationsContext);
  const [openCreateOrganization, setOpenCreateOrganization] = React.useState(false);
  const org = findById(orgId, orgs, nullOrganization);

  const handleChange = event => {
    const value = event.target.value;
    if (value === 'create') {
      setOpenCreateOrganization(true);
    }
    const newId = parseInt(value);
    if (isNaN(newId)) {
      console.error('Invalid org id was set:', value);
      return;
    }
    setOrgId(newId);
  }

  return <div>
    <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
      <Select
        id="demo-simple-select-standard"
        value={org.id}
        onChange={handleChange}
        label="Org Profile"
      >
        <MenuItem value={-1}>
          {auth.user.username}
        </MenuItem>
        {orgs.map(o => {
          return <MenuItem value={o.id}>{o.name}</MenuItem>
        })}
        <MenuItem value="create">
          + Create Organization
        </MenuItem>
      </Select>
    </FormControl>

    <Modal open={openCreateOrganization} onClose={_ => setOpenCreateOrganization(false)}>
      <Box sx={{
        position: 'absolute',
        top: '50px',
        left: '50%',
        transform: 'translate(-50%, 0)',
        width: '400px',
        bgcolor: 'background.paper',
        // border: '2px solid #000',
        boxShadow: 24,
        p: 4
      }} >
        <CreateOrganization onCreated={_ => {setOpenCreateOrganization(false)}} />
      </Box>
    </Modal>
  </div>
}
