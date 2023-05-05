import React from 'react';
import Workspace from './Workspace';
import WorkspaceList from './WorkspaceList';

import {
  nullWorkspace,
  getAllWorkspaces,
  addUserToWorkspace,
  createWorkspace,
  auth
} from '../api';

import Event from '../event';
import Button from 'react-bootstrap/Button';


function WorkspaceContainer({
}) {
  const [selectedWorkspace, setSelectedWorkspace] = React.useState(nullWorkspace);
  const [workspaces, setWorkspaces] = React.useState([]);

  const getAndUpdateWorkspaces = async _ => {
    try {
      let newWorkspaces = await getAllWorkspaces();
      for (let w of newWorkspaces) {
        if (selectedWorkspace.id === w.id) {
          setSelectedWorkspace(w);
        }
      }
      setWorkspaces(newWorkspaces);
    } catch (e) {
      console.error(e);
      alert(e);
    }
  }

  React.useEffect(_ => {
    for (const w of workspaces) {
      if (w.id === selectedWorkspace.id) {
        setSelectedWorkspace(w);
        break;
      }
    }
  }, [workspaces]);

  React.useEffect(_ => {
    getAndUpdateWorkspaces();
    let cb = Event.getDefaultCallback();
    cb.onInfoChanged = (data) => {
      if (data.infoType.startsWith('workspace')) {
        getAndUpdateWorkspaces();
      }
    };
    Event.addListener(cb);
    return _ => {
      Event.removeListener(cb);
    }
  }, []);

  if (selectedWorkspace.id !== -1) {
    return <div style={{height: "100%", display: 'flex', flexDirection: 'column'}}>
      <nav style={{padding: '10px'}}>
        <h4 style={{display: 'inline', marginRight: '10px'}}>Hi, {auth.user.username} ({auth.user.id})</h4>
        <button onClick={_ => {
          setSelectedWorkspace(nullWorkspace);
        }}>Re-select workspace</button>
      </nav>
      <div style={{flexGrow: '1'}}>
        <Workspace initialWorkspace={selectedWorkspace} />
      </div>
    </div>
  }

  return (
    <div style={{ display: 'block', width: '250px', margin: 'auto', marginTop: '80px' }}>
      <div style={{ width: '250px', marginLeft: '20px', overflow: 'hidden' }}>
        <h3>Select a workspace</h3>

        <WorkspaceList
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          onWorkspaceClick={(w) => {
          setSelectedWorkspace(w)
        }} />

        <div style={{ marginBottom: '10px', marginLeft: '10px' }} className='d-grid gap-2'>
          <Button
            type="button"
            variant="outline-primary"
            onClick={(_) => {
              let name = prompt('workspace name: ');
              if (name) {
                createWorkspace(name).catch(e => {
                  console.error(e);
                  alert(e);
                });
              }
            }}
          >create workspace</Button>
          <Button
            type="button"
            variant="outline-secondary"
            onClick={(_) => {
              getAndUpdateWorkspaces().catch((e) => {
                console.error(e);
                alert(e);
              });
            }}
          >refresh workspace</Button>

          
        </div>

        

      </div>

    </div>
  )

}

export default WorkspaceContainer;
