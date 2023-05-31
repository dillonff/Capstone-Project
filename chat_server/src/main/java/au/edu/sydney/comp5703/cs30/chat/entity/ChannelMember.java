package au.edu.sydney.comp5703.cs30.chat.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

// channel's members (user only, excluding orgs)
public class ChannelMember implements ChannelMemberMixin {
    @JsonIgnore
    private long id;
    private long channelId;
    private long userId;
    private long lastReadMessageId;
    private boolean mentioned;
    private boolean deleted;

    private Boolean pinned;

    public ChannelMember(long channelId, long userId) {
        this.channelId = channelId;
        this.userId = userId;
    }

    @JsonProperty("type")
    // 0 for user, 1 for org
    public Integer getType() {
        return 0;
    }

    @JsonProperty("memberId")
    public Long getMemberId() {
        return userId;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getChannelId() {
        return channelId;
    }

    public void setChannelId(long channelId) {
        this.channelId = channelId;
    }

    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    public long getLastReadMessageId() {
        return lastReadMessageId;
    }

    public void setLastReadMessageId(long lastReadMessageId) {
        this.lastReadMessageId = lastReadMessageId;
    }

    public boolean isMentioned() {
        return mentioned;
    }

    public void setMentioned(boolean mentioned) {
        this.mentioned = mentioned;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public Boolean getPinned() {
        return pinned;
    }

    public void setPinned(Boolean pinned) {
        this.pinned = pinned;
    }
}
