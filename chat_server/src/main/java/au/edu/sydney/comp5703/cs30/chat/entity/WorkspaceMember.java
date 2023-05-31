package au.edu.sydney.comp5703.cs30.chat.entity;

public class WorkspaceMember {
    private Long id;
    private Long workspaceId;
    private Long memberId;

    private Integer type;

    public WorkspaceMember(Long workspaceId, Integer type, Long memberId) {
        this.workspaceId = workspaceId;
        this.memberId = memberId;
        this.type = type;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getWorkspaceId() {
        return workspaceId;
    }

    public Long getMemberId() {
        return memberId;
    }

    public void setMemberId(Long memberId) {
        this.memberId = memberId;
    }

    public void setWorkspaceId(Long workspaceId) {
        this.workspaceId = workspaceId;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
}
