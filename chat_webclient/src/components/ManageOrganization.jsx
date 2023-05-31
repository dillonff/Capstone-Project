import React from 'react';

import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import CorporateFareSharpIcon from '@mui/icons-material/CorporateFareSharp';
import MailOutlineIcon from '@mui/icons-material/MailOutline';

import OrganizationForm from './OrganizationForm';
import { Button, Checkbox, FormControl, FormControlLabel, TextField } from '@mui/material';
import OrganizationMemberList from './OrganizationMemberList';
import { auth, nullOrganizationMember } from '../api';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function OrganizationMemberSettings({member}) {
  return <form>
    <TextField
      fullWidth
      defaultValue={member.displayName}
      name={member.displayName}
      required
      label="Display Name"
      variant="standard"
    />
    <FormControlLabel
      label="Auto join new channels that your organization joins"
      required
      control={<Checkbox name="autoJoinChannel" defaultChecked={member.autoJoinChannel}/>}
    />
    <br />
    <div style={{textAlign: 'right'}}>
      <Button variant="outlined">Save</Button>
    </div>
  </form>
}

export default function ManageOrganization({org}) {
  const [value, setValue] = React.useState(0);
  const formRef = React.useRef();

  let member = nullOrganizationMember;
  for (const m of org.members) {
    if (m.userId === auth.user.id) {
      member = m;
    }
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return <div style={{ width: '100%', display: 'flex', flexDirection: 'column', minHeight: '80px' }}>
    <div style={{display: 'flex', alignItems: 'center'}}>
      <CorporateFareSharpIcon sx={{marginRight: '20px', fontSize: '4em'}} />
      <div>
        <h4>{org.fullName}</h4>
        <div><MailOutlineIcon /> <a href={`mailto:${org.email}`}>{org.email}</a> </div>
      </div>
    </div>

    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        <Tab label="Information" {...a11yProps(0)} />
        <Tab label="Members" {...a11yProps(1)} />
        <Tab label="My Settings" {...a11yProps(2)} />
      </Tabs>
    </Box>
    
    <Box sx={{ width: '100%', minHeight: '4em', display: 'flex', flexDirection: 'column' }}>
      <TabPanel value={value} index={0} style={{flex: '1 1 auto', overflowY: 'auto'}}>
        <OrganizationForm initialOrg={org} formRef={formRef} />
        <Button variant="outlined" sx={{marginTop: '1em'}}>Save</Button>
      </TabPanel>
      <TabPanel value={value} index={1} className="flex-scroll">
        <OrganizationMemberList members={org.members} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <OrganizationMemberSettings member={member} />
      </TabPanel>
    </Box>
  </div>
}

