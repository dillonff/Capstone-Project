package au.edu.sydney.comp5703.cs30.chat;

public class NewMessagePush extends ServerPush {
    private String message;
    private String senderId;

    public NewMessagePush(String message, String senderId) {
        this.message = message;
        this.senderId = senderId;
    }

    public String getMessage() {
        return message;
    }

    public String getSenderId() {
        return senderId;
    }
}
