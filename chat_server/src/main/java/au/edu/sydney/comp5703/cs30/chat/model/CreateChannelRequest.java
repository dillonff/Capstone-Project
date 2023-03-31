package au.edu.sydney.comp5703.cs30.chat.model;

public class CreateChannelRequest {
    private String name;
    private long workspace = 0;  // this is currently a stub

    public String getName() {
        return name;
    }

    public long getWorkspace() {
        return workspace;
    }
}
