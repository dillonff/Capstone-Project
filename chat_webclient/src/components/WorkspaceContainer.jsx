import React from 'react';
import Workspace from './Workspace';
import WorkspaceList from './WorkspaceList';

import {
  nullWorkspace,
  getAllWorkspaces,
  addUserToWorkspace,
  createWorkspace
} from '../api';


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
  }, []);

  if (selectedWorkspace.id !== -1) {
    return <div style={{height: "100%", display: 'flex', flexDirection: 'column'}}>
      <nav style={{padding: '10px'}}>
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
    <div style={{ display: 'inline-block' }}>
      <div style={{ width: '300px', marginLeft: '20px', overflow: 'hidden' }}>
        <div>Select a workspace</div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="button"
            value="create workspace"
            onClick={(_) => {
              let name = prompt('workspace name: ');
              if (name) {
                createWorkspace(name).catch(e => {
                  console.error(e);
                  alert(e);
                })
              }
            }}
          ></input>
          <input
            type="button"
            value="refresh workspace"
            onClick={(_) => {
              getAndUpdateWorkspaces().catch((e) => {
                console.error(e);
                alert(e);
              });
            }}
          ></input>

          
        </div>

        <WorkspaceList
          workspaces={workspaces}
          selectedWorkspace={selectedWorkspace}
          onWorkspaceClick={(w) => {
          setSelectedWorkspace(w)
        }} />

      </div>

    </div>
  )

}

export default WorkspaceContainer;
