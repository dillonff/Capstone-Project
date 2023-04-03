package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.Util;
import au.edu.sydney.comp5703.cs30.chat.entity.Workspace;
import au.edu.sydney.comp5703.cs30.chat.model.CreateWorkspaceRequest;
import au.edu.sydney.comp5703.cs30.chat.model.GetWorkspacesResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedList;

import static au.edu.sydney.comp5703.cs30.chat.Repo.workspaceMemberMap;

@RestController
public class WorkspaceController {
    @RequestMapping(
            value = "/api/v1/workspace", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public Workspace createWorkspace(@RequestBody CreateWorkspaceRequest req) {
        if (req.getName() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "no workspace name provided");
        }
        var workspace = Util.createWorkspace(req.getName());
        return workspace;
    }

    // TODO: member check
    @RequestMapping(
            value = "/api/v1/workspace/{workspaceId}", produces = "application/json", method = RequestMethod.GET
    )
    public Workspace getWorkspace(@PathVariable long workspaceId) {
        var workspace = Repo.workspaceMap.get(workspaceId);
        if (workspace == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "workspace not found");
        }
        return workspace;
    }

    @RequestMapping(
            value = "/api/v1/workspaces", produces = "application/json", method = RequestMethod.GET
    )
    public GetWorkspacesResponse getWorkspaces(@RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var ids = new LinkedList<Long>();
        for (var w : workspaceMemberMap.values()) {
            if (w.getUserId() == auth) {
                ids.add(w.getWorkspaceId());
            }
        }
        return new GetWorkspacesResponse(ids);
    }
}
