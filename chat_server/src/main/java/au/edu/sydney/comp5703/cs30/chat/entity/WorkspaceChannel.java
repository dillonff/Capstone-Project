package au.edu.sydney.comp5703.cs30.chat.entity;

public class WorkspaceChannel {
    private long id;
    private long workspaceId;
    private long channelId;

    private static SeqIdGen idGen = new SeqIdGen();
    public long getNextId() {
        return idGen.getNextId();
    }

    public WorkspaceChannel(long workspaceId, long channelId) {
        this.workspaceId = workspaceId;
        this.channelId = channelId;
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

    public long getChannelId() {
        return channelId;
    }

    public void setChannelId(long channelId) {
        this.channelId = channelId;
    }
}
