package au.edu.sydney.comp5703.cs30.chat.model;

public class JoinOrganizationRequest {
    private Long userId;
    private String userEmail;

    public Long getUserId() {
        return userId;
    }

    public String getUserEmail() {
        return userEmail;
    }
}
