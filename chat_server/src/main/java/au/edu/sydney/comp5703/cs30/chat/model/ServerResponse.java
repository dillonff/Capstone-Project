package au.edu.sydney.comp5703.cs30.chat.model;

public class ServerResponse {
    private String type = "res";
    private String request;
    private boolean success;
    private String message = "";
    private Object result;

    // successful response
    public ServerResponse(boolean success, String request, Object result) {
        this.success = success;
        this.request = request;
        this.result = result;
    }

    // failed response
    public ServerResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.result = new Object();
    }

    public String getType() {
        return type;
    }
}
