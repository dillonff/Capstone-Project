package au.edu.sydney.comp5703.cs30.chat.models;

public class AuthResponse extends ServerResponse {
    private String cmd = "auth";

    public String getCmd() {
        return cmd;
    }
}
