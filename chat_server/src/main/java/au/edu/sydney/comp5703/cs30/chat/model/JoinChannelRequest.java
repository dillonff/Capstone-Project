package au.edu.sydney.comp5703.cs30.chat.model;

public class JoinChannelRequest {
    public long channel;
    private long user;

    public long getChannel() {
        return channel;
    }

    public long getUser() {
        return user;
    }
}
