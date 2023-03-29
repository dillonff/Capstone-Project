package au.edu.sydney.comp5703.cs30.chat.model;

public class SendMessageResponse {
    private long messageId;

    public SendMessageResponse(long messageId) {
        this.messageId = messageId;
    }

    public long getMessageId() {
        return messageId;
    }
}
