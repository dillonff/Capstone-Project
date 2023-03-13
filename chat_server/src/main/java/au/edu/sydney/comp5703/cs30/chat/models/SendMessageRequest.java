package au.edu.sydney.comp5703.cs30.chat.models;

public class SendMessageRequest {
    public String cmd;
    public String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getCmd() {
        return cmd;
    }

    public void setCmd(String cmd) {
        this.cmd = cmd;
    }
}
