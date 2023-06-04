import React from 'react';
import Workspace from './Workspace';
import WorkspaceList from './WorkspaceList';
import Header from './Header';
import OrganizationSelector from './OrganizationSelector';
import ManageOrganization from './ManageOrganization';
import SimpleDetailDialog from './SimpleDetailDialog';

import {
  nullWorkspace,
  getAllWorkspaces,
  addUserToWorkspace,
  createWorkspace,
  auth,
  nullOrganization,
  getWorkspaceMembers,
  processWorkspaceMembers,
  logout
} from '../api';

import {
    OrganizationIdContext,
    OrganizationsContext
} from '../AppContext';
import {
    findById, useMountedEffect
  } from '../util';

import Event from '../event';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

function WorkspaceContainer({}) {
    const [selectedWorkspace, setSelectedWorkspace] =
        React.useState(nullWorkspace);
    const [workspaces, setWorkspaces] = React.useState([]);
    const [openOrgDialog, setOpenOrgDialog] = React.useState(false);
    const [orgs] = React.useContext(OrganizationsContext);
    const [orgId] = React.useContext(OrganizationIdContext);
    const org = findById(orgId, orgs, nullOrganization);

    const getAndUpdateWorkspaces = async (getMounted) => {
        if (!getMounted())
            return;
        setWorkspaces([]);
        try {
            let oid = null;
            if (orgId > 0)
                oid = orgId;
            let newWorkspaces = await getAllWorkspaces(oid);
            for (let w of newWorkspaces) {
                w.members = await getWorkspaceMembers(w.id);
                console.error(w);
                await processWorkspaceMembers(w.members);
                if (!getMounted())
                    return;
                if (selectedWorkspace.id === w.id) {
                    setSelectedWorkspace(w);
                }
            }
            if (getMounted()) {
                setWorkspaces(newWorkspaces);
            }
        } catch (e) {
            console.error(e);
            alert(e);
        } finally {
            
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

    useMountedEffect(getMounted => {
        getAndUpdateWorkspaces(getMounted);
        let cb = Event.getDefaultCallback();
        cb.onInfoChanged = (data) => {
            if (data.infoType.startsWith('workspace')) {
                getAndUpdateWorkspaces(getMounted);
            }
        };
        Event.addListener(cb);
        return (_) => {
            Event.removeListener(cb);
        };
    }, [orgId]);

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
                <div style={{padding: '5px 40px'}}>
                    <h2>Hi, {auth.user.username}</h2>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <h4>Active Organization Profile</h4>
                        <OrganizationSelector />
                        {org.id > 0 && <a href="" onClick={e => {
                            e.preventDefault();
                            setOpenOrgDialog(true);
                        }}>Manage {org.name}</a>}
                    </div>
                    <SimpleDetailDialog title={`Manage ${org.name}`} open={openOrgDialog} onClose={_ => setOpenOrgDialog(false)}>
                        <ManageOrganization org={org}/>
                    </SimpleDetailDialog>
                </div>

                <hr />

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
                            className="me-2"
                            variant="outline-secondary"
                            onClick={(_) => {
                                getAndUpdateWorkspaces(_ => true).catch((e) => {
                                    console.error(e);
                                    alert(e);
                                });
                            }}
                        >Refresh workspace</Button>
                        <Button
                            type="button"
                            variant="outline-danger"
                            onClick={(_) => {
                                logout();
                            }}
                        >Log out</Button>
                    </div>
                </h2>


                <WorkspaceList
                    workspaces={workspaces}
                    selectedWorkspace={selectedWorkspace}
                    onWorkspaceClick={(w) => {
                        setSelectedWorkspace(w)
                    }}
                    organization={org}
                />

            </div>
        </div>
    </>
}

export default WorkspaceContainer;
