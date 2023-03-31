package au.edu.sydney.comp5703.cs30.chat.model;

public class CreateChannelResponse {
    private long channelId;

    public CreateChannelResponse(long channelId) {
        this.channelId = channelId;
    }

    public long getChannelId() {
        return channelId;
    }
}
