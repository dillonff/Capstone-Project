package au.edu.sydney.comp5703.cs30.chat.model;

public class SendMessageRequest {
    private String content;
    private long channelId;

    private Long organizationId;

    public String getContent() {
        return content;
    }

    public long getChannelId() {
        return channelId;
    }

    public Long getOrganizationId() {
        return organizationId;
    }
}
