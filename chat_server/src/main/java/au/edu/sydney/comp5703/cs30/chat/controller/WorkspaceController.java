package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.Util;
import au.edu.sydney.comp5703.cs30.chat.entity.Workspace;
import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import au.edu.sydney.comp5703.cs30.chat.mapper.WorkspaceMapper;
import au.edu.sydney.comp5703.cs30.chat.model.CreateWorkspaceRequest;
import au.edu.sydney.comp5703.cs30.chat.model.GetWorkspacesResponse;
import au.edu.sydney.comp5703.cs30.chat.model.InfoChangedPush;
import au.edu.sydney.comp5703.cs30.chat.model.JoinWorkspaceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedList;

import static au.edu.sydney.comp5703.cs30.chat.WsUtil.*;

@RestController
public class WorkspaceController {
    @Autowired
    private WorkspaceMapper workspaceMapper;

    @Autowired
    private UserMapper userMapper;

    @RequestMapping(
            value = "/api/v1/workspaces", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public Workspace createWorkspace(@RequestBody CreateWorkspaceRequest req, @RequestHeader(HttpHeaders.AUTHORIZATION) long auth) throws Exception {
        var user = userMapper.findById(auth);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "user not authorized");
        }
        if (req.getName() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "no workspace name provided");
        }
        var workspace = Util.createWorkspace(req.getName());
        Repo.addMemberToWorkspace(workspace.getId(), user.getId());
        // TODO: send to the user who created it only
        var p = makeServerPush("infoChanged", new InfoChangedPush("workspace"));
        broadcastMessages(p);
        p = makeServerPush("infoChanged", new InfoChangedPush("channel"));
        broadcastMessages(p);
        return workspace;
    }

    // TODO: member check
    @RequestMapping(
            value = "/api/v1/workspaces/{workspaceId}", produces = "application/json", method = RequestMethod.GET
    )
    public Workspace getWorkspace(@PathVariable long workspaceId) {
        var workspace = workspaceMapper.findById(workspaceId);
        if (workspace == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "workspace not found");
        }
        return workspace;
    }

    @RequestMapping(
            value = "/api/v1/workspaces/join", produces = "application/json", method = RequestMethod.POST
    )
    public String joinWorkspace(@RequestBody JoinWorkspaceRequest req) throws Exception {
        var workspace = workspaceMapper.findById(req.getWorkspaceId());
        var user = userMapper.findById(req.getUserId());
        if (workspace == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "workspace not found");
        }
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
        if (workspaceMapper.isMember(workspace.getId(), user.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already a member");
        }
        Repo.addMemberToWorkspace(workspace.getId(), user.getId());
        var p = makeServerPush("infoChanged", new InfoChangedPush("workspace"));
        broadcastMessages(p);
        return "{}";
    }

    @RequestMapping(
            value = "/api/v1/workspaces", produces = "application/json", method = RequestMethod.GET
    )
    public GetWorkspacesResponse getWorkspaces(@RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var ids = new LinkedList<Long>();
        var workspaces = workspaceMapper.findByMemberId(auth);
        workspaces.forEach(workspace -> {
            ids.add(workspace.getId());
        });
        return new GetWorkspacesResponse(ids);
    }
}
