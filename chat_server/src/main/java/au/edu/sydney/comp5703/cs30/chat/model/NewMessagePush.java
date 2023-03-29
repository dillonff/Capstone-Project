package au.edu.sydney.comp5703.cs30.chat.model;

public class NewMessagePush {
    private long messageId;
    private String preview;
    private long senderId;

    public NewMessagePush(long messageId, String preview, long senderId) {
        this.messageId = messageId;
        this.preview = preview;
        this.senderId = senderId;
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
}
