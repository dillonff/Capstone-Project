package au.edu.sydney.comp5703.cs30.chat.model;

public class ServerPush {
    private String type;
    private Object data;

    public ServerPush(String type, Object data) {
        this.type = type;
        this.data = data;
    }

    public String getType() {
        return type;
    }

    public Object getData() {
        return data;
    }
}
