package au.edu.sydney.comp5703.cs30.chat.entity;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.*;


public class Channel {
    private long id;
    private String name;
    private long workspaceId;
    private boolean publicChannel;
    private boolean deleted;
    private Instant timeCreated;
    private Instant timeModified;

    private Boolean directMessage;

    private Boolean autoJoin;

    // members of the direct message (excluding calling user and organization users)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private List<ChannelMemberMixin> dmPeerMembers;

    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Boolean callerIsMember;

    public Channel(String name, long workspaceId, boolean isPublic) {
        this.name = name;
        this.workspaceId = workspaceId;
        this.publicChannel = isPublic;
        this.directMessage = false;
        this.autoJoin = false;
    }

    public Channel() {}

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

    public boolean isPublicChannel() {
        return publicChannel;
    }

    public void setPublicChannel(boolean isPublic) {
        this.publicChannel = isPublic;
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

    public Boolean isDirectMessage() {
        return directMessage;
    }

    public void setDirectMessage(Boolean directMessage) {
        this.directMessage = directMessage;
    }

    public List<ChannelMemberMixin> getDmPeerMembers() {
        return dmPeerMembers;
    }

    public void setDmPeerMembers(List<ChannelMemberMixin> dmPeerMembers) {
        this.dmPeerMembers = dmPeerMembers;
    }

    public Boolean getCallerIsMember() {
        return callerIsMember;
    }

    public void setCallerIsMember(Boolean callerIsMember) {
        this.callerIsMember = callerIsMember;
    }


    public Boolean shouldAutoJoin() {
        return autoJoin;
    }

    public void setAutoJoin(Boolean autoJoin) {
        this.autoJoin = autoJoin;
    }
}
