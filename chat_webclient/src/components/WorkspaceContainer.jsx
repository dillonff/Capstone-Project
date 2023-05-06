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
import 'bootstrap/dist/css/bootstrap.min.css';

function WorkspaceContainer({}) {
  const [selectedWorkspace, setSelectedWorkspace] =
    React.useState(nullWorkspace);
  const [workspaces, setWorkspaces] = React.useState([]);

  const getAndUpdateWorkspaces = async (_) => {
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
  };

  React.useEffect(
    (_) => {
      for (const w of workspaces) {
        if (w.id === selectedWorkspace.id) {
          setSelectedWorkspace(w);
          break;
        }
      }
    },
    [workspaces]
  );

  React.useEffect((_) => {
    getAndUpdateWorkspaces();
    let cb = Event.getDefaultCallback();
    cb.onInfoChanged = (data) => {
      if (data.infoType.startsWith('workspace')) {
        getAndUpdateWorkspaces();
      }
    };
    Event.addListener(cb);
    return (_) => {
      Event.removeListener(cb);
    };
  }, []);

  if (selectedWorkspace.id !== -1) {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: "#1E2B55", color: "white"}}>
        <nav style={{ padding: '10px' }}>
          <button
            onClick={(_) => {
              setSelectedWorkspace(nullWorkspace);
            }}
          >
            Re-select workspace
          </button>
        </nav>
        {/** flex box for automatically use all the available spaces */}
        <div style={{ flexGrow: '1', overflow: 'hidden'}}>
          <Workspace initialWorkspace={selectedWorkspace} />
        </div>
      </div>
    );
  }

  return <>
    {/* <div style={{backgroundColor: "#1868AF", height: "80px"}}>header...</div> */}
    <div style={{backgroundColor: "#1868AF", minHeight: "100%", boxSizing: "border-box", padding: "80px 0 40px 0"}}>
      <div style={{ display: 'block', maxWidth: '65rem', margin: 'auto', backgroundColor: "white", boxSizing: 'border-box' }}>
          <h2>Workspace for {auth.user.username}</h2>

          <WorkspaceList
            workspaces={workspaces}
            selectedWorkspace={selectedWorkspace}
            onWorkspaceClick={(w) => {
            setSelectedWorkspace(w)
          }} />

          <div className='mt-3' style={{ display: "block", justifyContent: "space-around" }}>
            <Button
              type="button"
              variant="outline-primary"
              className='me-2'
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
  </>
}

export default WorkspaceContainer;
