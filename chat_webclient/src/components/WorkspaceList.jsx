import SimpleBoxItem from './SimpleBoxItem';

import {
  nullWorkspace,
  getAllWorkspaces,
  createWorkspace, auth
} from '../api.js';
import React from "react";

const WorkspaceList = ({ workspaces, selectedWorkspace, onWorkspaceClick, organization }) => {
  //return <div></div>
  let workspaceElems = [];
  for (let i = 0; i < workspaces.length; i++) {
    const workspace = workspaces[i];
    if (organization.id > 0) {
      let hasOrgMember = false;
      for (const m of workspace.members) {
        if (m.type === 1 && m.memberId === organization.id) {
          hasOrgMember = true;
          break;
        }
      }
      if (!hasOrgMember)
        continue;
    }
    console.log(workspace);
    const clickCb = () => {
      onWorkspaceClick(workspace);
    };
    let elem = <SimpleBoxItem classNamePrefix="workspace"
      title={workspace.name}
      text={workspace.members.length + ' people'}
      key={i}
      onClick={clickCb}
      selected={workspace.id === selectedWorkspace.id}
    />;
    workspaceElems.push(elem);
  }
  if (workspaceElems.length === 0) {
    workspaceElems.push(<div key="-1">No workspace</div>);
  }

  return (
      <div style={{ display: 'block' }}>

              {workspaceElems}

      </div>
  );
}


export default WorkspaceList;
