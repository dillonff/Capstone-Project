package au.edu.sydney.comp5703.cs30.chat.model;

import java.util.List;

public class SendMessageRequest {
    private String content;
    private long channelId;

    private Long organizationId;

    private List<Long> fileIds;

    private List<Long> mentionedUserIds;

    public String getContent() {
        return content;
    }

    public long getChannelId() {
        return channelId;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public List<Long> getFileIds() {
        return fileIds;
    }

    public List<Long> getMentionedUserIds() {
        return mentionedUserIds;
    }
}
