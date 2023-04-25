package au.edu.sydney.comp5703.cs30.chat.entity;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.*;


public class Channel {
    private long id;
    private String name;
    private long workspaceId;
    private boolean public_;
    private boolean pinned;
    private boolean deleted;
    private Instant timeCreated;
    private Instant timeModified;

    public Channel(String name, long workspaceId, boolean isPublic) {
        this.name = name;
        this.workspaceId = workspaceId;
        this.public_ = isPublic;
    }

    @JsonProperty("memberIds")
    public List<Long> getMemberIds() {
        var ids = new LinkedList<Long>();
        var ms = Repo.channelMemberMapper.getChannelMembers(id);
        ms.forEach(m -> {
            ids.add(m.getUserId());
        });
        return ids;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getTimeCreated() {
        return timeCreated;
    }

    public void setTimeCreated(Instant timeCreated) {
        this.timeCreated = timeCreated;
    }

    public long getWorkspaceId() {
        return workspaceId;
    }

    public void setWorkspaceId(long workspaceId) {
        this.workspaceId = workspaceId;
    }

    public boolean isPublic() {
        return public_;
    }

    public void setPublic(boolean isPublic) {
        this.public_ = isPublic;
    }

    public boolean isPinned() {
        return pinned;
    }

    public void setPinned(boolean pinned) {
        this.pinned = pinned;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public Instant getTimeModified() {
        return timeModified;
    }

    public void setTimeModified(Instant timeModified) {
        this.timeModified = timeModified;
    }
}
