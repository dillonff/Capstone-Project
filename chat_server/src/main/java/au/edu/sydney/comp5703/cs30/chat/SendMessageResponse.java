package au.edu.sydney.comp5703.cs30.chat;

public class SendMessageResponse extends ServerResponse {
    private String cmd = "sendMessage";

    public String getCmd() {
        return cmd;
    }
}
