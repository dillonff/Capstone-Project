package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.Util;
import au.edu.sydney.comp5703.cs30.chat.entity.Workspace;
import au.edu.sydney.comp5703.cs30.chat.entity.WorkspaceMember;
import au.edu.sydney.comp5703.cs30.chat.mapper.OrganizationMapper;
import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import au.edu.sydney.comp5703.cs30.chat.mapper.WorkspaceMapper;
import au.edu.sydney.comp5703.cs30.chat.mapper.WorkspaceMemberMapper;
import au.edu.sydney.comp5703.cs30.chat.model.CreateWorkspaceRequest;
import au.edu.sydney.comp5703.cs30.chat.model.GetWorkspacesResponse;
import au.edu.sydney.comp5703.cs30.chat.model.InfoChangedPush;
import au.edu.sydney.comp5703.cs30.chat.model.JoinWorkspaceRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedList;
import java.util.List;

import static au.edu.sydney.comp5703.cs30.chat.WsUtil.*;

@RestController
public class WorkspaceController {
    @Autowired
    private WorkspaceMapper workspaceMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private WorkspaceMemberMapper workspaceMemberMapper;

    @Autowired
    private OrganizationMapper organizationMapper;

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
        Repo.addMemberToWorkspace(workspace.getId(), 0, user.getId());
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
        if (workspace == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "workspace not found");
        }
        long providedMemberId = req.getMemberId() == null ? -1L : req.getMemberId();
        long memberId;
        switch (req.getType()) {
            case 0:
                var user = userMapper.findById(providedMemberId);
                if (user == null && StringUtils.hasLength(req.getEmail())) {
                    var users = userMapper.findByEmail(req.getEmail());
                    if (users.size() == 1) {
                        user = users.get(0);
                    }
                }
                if (user == null) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
                } else {
                    memberId = user.getId();
                }
                break;
            case 1:
                var org = organizationMapper.findById(providedMemberId);
                if (org == null && StringUtils.hasLength(req.getEmail()))  {
                    org = organizationMapper.findByEmail(req.getEmail());
                }
                if (org == null) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "org not found");
                } else {
                    memberId = org.getId();
                }
                break;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid type");
        }

        if (workspaceMemberMapper.isMember(workspace.getId(), req.getType(), memberId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already a member");
        }
        Repo.addMemberToWorkspace(workspace.getId(), req.getType(), memberId);
        var p = makeServerPush("infoChanged", new InfoChangedPush("workspace"));
        broadcastMessages(p);
        return "{}";
    }

    @RequestMapping(
            value = "/api/v1/workspaces", produces = "application/json", method = RequestMethod.GET
    )
    public List<Workspace> getWorkspaces(@RequestParam(required = false) Long organizationId, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var ids = new LinkedList<Long>();
        var type = 0;
        var memberId = 0L;
        if (organizationId != null) {
            type = 1;
            memberId = organizationId;
        } else {
            memberId = auth;
        }
        var workspaces = workspaceMapper.findByMemberId(type, memberId);
        return workspaces;
    }

    @RequestMapping(
            value = "/api/v1/workspaces/{workspaceId}/members", produces = "application/json", method = RequestMethod.GET
    )
    public List<WorkspaceMember> getWorkspaceMembers(@PathVariable long workspaceId) {
        var workspace = workspaceMapper.findById(workspaceId);
        if (workspace == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "workspace not found");
        }
        return workspaceMemberMapper.findByWorkspace(workspaceId);
    }

}


