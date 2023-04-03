package au.edu.sydney.comp5703.cs30.chat.model;

import java.util.List;

public class GetWorkspacesResponse {
    private List<Long> workspaceIds;

    public GetWorkspacesResponse(List<Long> workspaceIds) {
        this.workspaceIds = workspaceIds;
    }

    public List<Long> getWorkspaceIds() {
        return workspaceIds;
    }
}
