import React from 'react';
import Workspace from './Workspace';
import WorkspaceList from './WorkspaceList';

import {
  nullWorkspace,
  getAllWorkspaces,
  addUserToWorkspace,
  createWorkspace,
} from '../api';

import Event from '../event';

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
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <nav style={{ padding: '10px' }}>
          <button
            onClick={(_) => {
              setSelectedWorkspace(nullWorkspace);
            }}
          >
            Re-select workspace
          </button>
        </nav>
        <div style={{ flexGrow: '1' }}>
          <Workspace initialWorkspace={selectedWorkspace} />
        </div>
      </div>
    );
  }

  return (
    <div className="workspace__container">
      <div className="workspace__container_fields">
        <div className="workspace__container_fields-content">
          <h3>Select a workspace</h3>
          <WorkspaceList
            workspaces={workspaces}
            selectedWorkspace={selectedWorkspace}
            onWorkspaceClick={(w) => {
              setSelectedWorkspace(w);
            }}
          />
          <div className="workspace__container_fields-content_button">
            <button
              type="button"
              value="create workspace"
              onClick={(_) => {
                let name = prompt('workspace name: ');
                if (name) {
                  createWorkspace(name).catch((e) => {
                    console.error(e);
                    alert(e);
                  });
                }
              }}
            >
              {'Create Workspace'}
            </button>
            <button
              type="button"
              value="refresh workspace"
              onClick={(_) => {
                getAndUpdateWorkspaces().catch((e) => {
                  console.error(e);
                  alert(e);
                });
              }}
            >
              {'Refresh Workspace'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkspaceContainer;
