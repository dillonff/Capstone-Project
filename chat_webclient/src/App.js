import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import WorkspaceContainer from './components/WorkspaceContainer';
import {
  auth
} from './api';
import SimpleLogin from './components/SimpleLogin';

function App() {
  const [currentUser, setCurrentUser] = React.useState(auth.user);
  if (!currentUser) {
    return <SimpleLogin onLoggedin={_ => {
      setCurrentUser(auth.user);
    }} />
  }
  return <WorkspaceContainer />;
}

export default App;
