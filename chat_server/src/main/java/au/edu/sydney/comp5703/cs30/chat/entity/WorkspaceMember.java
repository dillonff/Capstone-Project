package au.edu.sydney.comp5703.cs30.chat.entity;

public class WorkspaceMember {
    private long id;
    private long workspaceId;
    private long userId;

    private static SeqIdGen idGen = new SeqIdGen();
    public long getNextId() {
        return idGen.getNextId();
    }

    public WorkspaceMember(long workspaceId, long userId) {
        id = getNextId();
        this.workspaceId = workspaceId;
        this.userId = userId;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(long workspaceId) {
        this.workspaceId = workspaceId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }
}
