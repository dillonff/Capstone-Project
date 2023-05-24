package au.edu.sydney.comp5703.cs30.chat.entity;

public class OrganizationMember {
    private Long id;
    private Long userId;
    private Long organizationId;
    private String displayName;
    private Boolean autoJoinChannel;

    public OrganizationMember(Long userId, Long organizationId) {
        this.userId = userId;
        this.organizationId = organizationId;
        this.autoJoinChannel = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public Boolean isAutoJoinChannel() {
        return autoJoinChannel;
    }

    public void setAutoJoinChannel(Boolean autoJoinChannel) {
        this.autoJoinChannel = autoJoinChannel;
    }
}
