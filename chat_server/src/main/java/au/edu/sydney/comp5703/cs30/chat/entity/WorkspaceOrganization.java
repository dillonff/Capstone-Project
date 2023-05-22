package au.edu.sydney.comp5703.cs30.chat.entity;

public class WorkspaceOrganization {
    private Long id;
    private Long workspaceId;
    private Long organizationId;

    public WorkspaceOrganization(Long workspaceId, Long organizationId) {
        this.workspaceId = workspaceId;
        this.organizationId = organizationId;
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

    public void setWorkspaceId(Long workspaceId) {
        this.workspaceId = workspaceId;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
