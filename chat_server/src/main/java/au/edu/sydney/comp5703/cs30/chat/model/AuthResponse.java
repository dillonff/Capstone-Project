package au.edu.sydney.comp5703.cs30.chat.model;

public class AuthResponse {
    private long userId;
    private String clientId;
    private String token;


    public AuthResponse(long userId, String clientId) {
        this.userId = userId;
        this.clientId = clientId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
