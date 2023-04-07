package au.edu.sydney.comp5703.cs30.chat.model;

public class SendMessageRequest {
    private String content;
    private long channelId;

    public String getContent() {
        return content;
    }

    public long getChannelId() {
        return channelId;
    }
}
