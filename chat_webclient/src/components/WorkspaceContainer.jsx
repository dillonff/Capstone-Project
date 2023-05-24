import React from 'react';
import Workspace from './Workspace';
import WorkspaceList from './WorkspaceList';
import Header from './Header';
import OrganizationSelector from './OrganizationSelector';

import {
  nullWorkspace,
  getAllWorkspaces,
  addUserToWorkspace,
  createWorkspace,
  auth,
  nullOrganization
} from '../api';

import {
    OrganizationIdContext,
    OrganizationsContext
} from '../AppContext';
import {
    findById
  } from '../util';

import Event from '../event';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function WorkspaceContainer({}) {
    const [selectedWorkspace, setSelectedWorkspace] =
        React.useState(nullWorkspace);
    const [workspaces, setWorkspaces] = React.useState([]);
    const [orgs] = React.useContext(OrganizationsContext);
    const [orgId] = React.useContext(OrganizationIdContext);
    const org = findById(orgId, orgs, nullOrganization);

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
            <div
                style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#1E2B55',
                    color: 'white',
                }}
            >
                <div>
                    <Header/>
                </div>
                {/* <nav style={{ padding: '10px' }}>
          <button
            onClick={(_) => {
              setSelectedWorkspace(nullWorkspace);
            }}
          >
            Re-select workspace
          </button>
        </nav> */}
                {/** flex box for automatically use all the available spaces */}
                <div style={{flexGrow: '1', overflow: 'hidden'}}>
                    <Workspace initialWorkspace={selectedWorkspace} setSelectedWorkspace={setSelectedWorkspace}/>
                </div>
            </div>
        );
    }

    return <>
        {/* <div style={{backgroundColor: "#1868AF", height: "80px"}}>header...</div> */}
        <div style={{backgroundColor: "#1868AF", minHeight: "100%", boxSizing: "border-box", padding: "80px 0 40px 0"}}>
            <div style={{
                display: 'block',
                maxWidth: '65rem',
                margin: 'auto',
                backgroundColor: "white",
                padding: '10px',
                boxSizing: 'border-box',
                borderRadius: '10px',
                boxShadow: '0px 0px 10px 5px rgba(0,0,0,0.2)'
            }}>
                <div>
                    <h2>Hi, {auth.user.username}</h2>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <h4>Organization Profile</h4>
                        <OrganizationSelector />
                    </div>
                </div>

                <h2 style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '25px'}}>
                    <span style={{transform: "translateX(40px)"}}>
                        Workspace for {orgId > 0 ? org.name : auth.user.username}
                    </span>
                    <div style={{display: 'flex', justifyContent: 'flex-end', transform: "translateX(-40px)"}}>
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
                        >Create workspace</Button>
                        <Button
                            type="button"
                            variant="outline-secondary"
                            onClick={(_) => {
                                getAndUpdateWorkspaces().catch((e) => {
                                    console.error(e);
                                    alert(e);
                                });
                            }}
                        >Refresh workspace</Button>
                    </div>
                </h2>


                <WorkspaceList
                    workspaces={workspaces}
                    selectedWorkspace={selectedWorkspace}
                    onWorkspaceClick={(w) => {
                        setSelectedWorkspace(w)
                    }}
                />

            </div>
        </div>
    </>
}

export default WorkspaceContainer;
