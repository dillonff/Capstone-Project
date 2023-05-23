package au.edu.sydney.comp5703.cs30.chat.model;

public class JoinOrganizationRequest {
    private Long userId;
    private String email;

    public Long getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }
}
