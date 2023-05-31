import React from 'react';

import TextField from '@mui/material/TextField';

export default function OrganizationForm({initialOrg, formRef}) {
  if (!initialOrg) {
    initialOrg = {
      name: '',
      fullName: '',
      email: '',
      description: ''
    }
  }
  return <form ref={formRef}>
    <TextField
      fullWidth
      defaultValue={initialOrg.name}
      name="name"
      required
      label="Organization Short Name"
      helperText="e.g. USYD"
      variant="standard"
    />
    <TextField
      fullWidth
      defaultValue={initialOrg.fullName}
      name="fullName"
      required
      label="Organization Full Name"
      variant="standard"
      helperText="e.g. University of Sydney"
    />
    <TextField
      fullWidth
      defaultValue={initialOrg.email}
      name="email"
      type="email"
      required
      label="Organization Contact Email"
      variant="standard"
      helperText="name@org.domain.com"
    />
    <TextField
      fullWidth
      defaultValue={initialOrg.description}
      name="description"
      label="Description"
      multiline
      variant="standard"
      helperText="Organization description"
    />
  </form>
}
