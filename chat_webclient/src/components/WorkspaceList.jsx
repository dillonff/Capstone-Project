import SimpleBoxItem from './SimpleBoxItem';
import Workspace from './Workspace';

import {
  nullWorkspace,
  getAllWorkspaces,
  createWorkspace, auth
} from '../api.js';
import React from "react";


const WorkspaceList = ({
  workspaces,
  selectedWorkspace,
  onWorkspaceClick
}) => {

  let workspaceElems = [];
  for (let i = 0; i < workspaces.length; i++) {
    const workspace = workspaces[i];
    console.log(workspace);
    const clickCb = () => {
      onWorkspaceClick(workspace);
    };
    let elem = <SimpleBoxItem
      title={workspace.name}
      text={workspace.memberIds.length + ' people'}
      key={i}
      onClick={clickCb}
      selected={workspace.id === selectedWorkspace.id}
    />;
    workspaceElems.push(elem);
  }
  if (workspaceElems.length === 0) {
    workspaceElems.push(<div key="-1">No workspace</div>);
  }

  return <div style={{display: 'block'}}>
      {workspaceElems}
      </div>
}

export default WorkspaceList;
