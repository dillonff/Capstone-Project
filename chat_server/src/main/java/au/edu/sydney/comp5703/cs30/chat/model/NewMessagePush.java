package au.edu.sydney.comp5703.cs30.chat.model;

public class NewMessagePush {
    private long messageId;
    private String preview;
    private long senderId;
    private long channelId;

    public NewMessagePush(long messageId, String preview, long senderId, long channelId) {
        this.messageId = messageId;
        this.preview = preview;
        this.senderId = senderId;
        this.channelId = channelId;
    }

    public long getMessageId() {
        return messageId;
    }

    public String getPreview() {
        return preview;
    }

    public long getSenderId() {
        return senderId;
    }

    public long getChannelId() {
        return channelId;
    }
}
