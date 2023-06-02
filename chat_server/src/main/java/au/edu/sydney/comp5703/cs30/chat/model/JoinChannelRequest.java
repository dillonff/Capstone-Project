package au.edu.sydney.comp5703.cs30.chat.model;

public class JoinChannelRequest {
    private long channelId;
    private int type;
    private long memberId;

    public long getChannelId() {
        return channelId;
    }

    public int getType() {
        return type;
    }

    public long getMemberId() {
        return memberId;
    }
}
