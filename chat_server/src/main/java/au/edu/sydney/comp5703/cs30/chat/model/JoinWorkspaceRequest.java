package au.edu.sydney.comp5703.cs30.chat.model;

public class JoinWorkspaceRequest {
    private Long workspaceId;
    private Long memberId;
    private int type;
    private String email;

    public Long getWorkspaceId() {
        return workspaceId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public int getType() {
        return type;
    }

    public String getEmail() {
        return email;
    }
}
