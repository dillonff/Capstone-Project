package au.edu.sydney.comp5703.cs30.chat.model;

public class JoinWorkspaceRequest {
    private long workspaceId = -1;
    private long userId = -1;

    public long getWorkspaceId() {
        return workspaceId;
    }

    public long getUserId() {
        return userId;
    }
}
