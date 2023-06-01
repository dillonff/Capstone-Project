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
  OrganizationsContext,
  AddGlobalModalsContext,
  GlobalModalsContext
} from './AppContext';
import { GlobalModals } from './components/GlobalModals';



function App() {
  const [currentUser, setCurrentUser] = React.useState(auth.user);

  const [organizationId, setOrganizationId] = React.useState(-1);
  const [organizations, setOrganizations] = React.useState([]);
  const [globalModals, setGlobalModals] = React.useState([]);

  const addGlobalModal = React.useCallback((MFunc, props) => {
    if (!props) {
      props = {};
    }
    console.warn(MFunc, props);
    let elem = null;
    const close = () => {
      setGlobalModals(ms => {
        return ms.filter(m => m !== elem);
      });
    }
    elem = <MFunc open={true} onClose={close} key={new Date().getTime()} {...props} />;
    setGlobalModals(ms => [...ms, elem]);
  }, [setGlobalModals]);

  if (Object.is(currentUser, nullUser)) {
    return <SimpleLogin onLoggedin={_ => {
      setCurrentUser(auth.user);
    }} />
  }

  // TODO: getting very complex, use react redux instead
  return <OrganizationIdContext.Provider value={[organizationId, setOrganizationId]}>
    <OrganizationsContext.Provider value={[organizations, setOrganizations]}>
      <AddGlobalModalsContext.Provider value={addGlobalModal}>
        <GlobalModals globalModals={globalModals} />
        <OrganizationListener />
        <WorkspaceContainer />
      </AddGlobalModalsContext.Provider>
    </OrganizationsContext.Provider>
  </OrganizationIdContext.Provider>
  
}



export default App;
