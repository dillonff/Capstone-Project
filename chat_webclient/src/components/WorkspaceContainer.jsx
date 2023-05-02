'use strict';

import {
  nullWorkspace,
  getAllWorkspaces
} from '../api.js';


const Workspace = (props) => {
  let [workspaces, setWorkspaces] = useState([]);
  let [currentWorkspace, setCurrentWorkspace] = useState(nullWorkspace);


  const getAndUpdateWorkspaces = async _ => {
    try {
      let newWorkspaces = await getAllWorkspaces();
      for (let w of newWorkspaces) {
        if (currentWorkspace.id === w.id) {
          setCurrentWorkspace(w);
        }
        if (currentWorkspace.id === -1 && w.name === 'default') {
          setCurrentWorkspace(w);
        }
      }
      setWorkspaces(newWorkspaces);
    }
  }

  {/* workspaces */ }
  return <div style={{display: 'inline-block'}}>
    <div style={{ width: '200px', marginLeft: '20px', overflow: 'hidden' }}>
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
            getAllWorkspaces().catch((e) => {
              console.error(e);
              alert(e);
            });
          }}
        ></input>

        <div style={{ display: 'flex' }}>
          <input
            type="button"
            value="Add user (id)"
            style={{ marginRight: '5px' }}
            onClick={(_) => {
              addUserToWorkspace(
                currentWorkspace.id,
                addUserIdToWorkspaceRef.current.value
              ).then((res) => {
                if (!res.ok) {
                  console.error(res);
                  alert('cannot add user');
                } else {
                  addUserIdToWorkspaceRef.current.value = '';
                  alert('Added!');
                }
              });
            }}
          ></input>
          <input type="text" ref={addUserIdToWorkspaceRef}></input>
        </div>
      </div>

      {workspaceElems}

    </div>

    <Workspace
      workspace={currentWorkspace}
    />

  </div>
}

