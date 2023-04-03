package au.edu.sydney.comp5703.cs30.chat.entity;

public class ChannelMember {
    private long id;
    private long channelId;
    private long userId;

    private static SeqIdGen idGen = new SeqIdGen();
    public long getNextId() {
        return idGen.getNextId();
    }

    public ChannelMember(long channelId, long userId) {
        id = getNextId();
        this.channelId = channelId;
        this.userId = userId;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getChannelId() {
        return channelId;
    }

    public void setChannelId(long channelId) {
        this.channelId = channelId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }
}
