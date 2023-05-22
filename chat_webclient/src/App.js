import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import WorkspaceContainer from './components/WorkspaceContainer';

import {
  auth,
  nullUser
} from './api';

import SimpleLogin from './components/SimpleLogin';
import OrganizationListener from './components/OrganizationListener';

import {
  OrganizationIdContext,
  OrganizationsContext
} from './AppContext';



function App() {
  const [currentUser, setCurrentUser] = React.useState(auth.user);

  const [organizationId, setOrganizationId] = React.useState(-1);
  const [organizations, setOrganizations] = React.useState([]);

  if (Object.is(currentUser, nullUser)) {
    return <SimpleLogin onLoggedin={_ => {
      setCurrentUser(auth.user);
    }} />
  }

  // TODO: getting very complex, use react redux instead
  return <OrganizationIdContext.Provider value={[organizationId, setOrganizationId]}>
    <OrganizationsContext.Provider value={[organizations, setOrganizations]}>
      <OrganizationListener />
      <WorkspaceContainer />
    </OrganizationsContext.Provider>
  </OrganizationIdContext.Provider>
  
}



export default App;
