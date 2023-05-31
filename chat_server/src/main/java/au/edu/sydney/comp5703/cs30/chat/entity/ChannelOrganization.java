package au.edu.sydney.comp5703.cs30.chat.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

public class ChannelOrganization implements ChannelMemberMixin {

    @JsonIgnore
    private Long id;
    private Long channelId;
    private Long organizationId;

    public ChannelOrganization(Long channelId, Long organizationId) {
        this.channelId = channelId;
        this.organizationId = organizationId;
    }

    @JsonProperty("type")
    // 0 for user, 1 for org
    public Integer getType() {
        return 1;
    }

    @JsonProperty("memberId")
    public Long getMemberId() {
        return organizationId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getChannelId() {
        return channelId;
    }

    public void setChannelId(Long channelId) {
        this.channelId = channelId;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
