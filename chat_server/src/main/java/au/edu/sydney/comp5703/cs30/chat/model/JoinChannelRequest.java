package au.edu.sydney.comp5703.cs30.chat.model;

public class JoinChannelRequest {
    public long channelId;
    private long userId;

    public long getChannelId() {
        return channelId;
    }

    public long getUserId() {
        return userId;
    }
}
