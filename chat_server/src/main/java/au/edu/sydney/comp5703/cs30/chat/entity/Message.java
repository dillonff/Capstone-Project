package au.edu.sydney.comp5703.cs30.chat.entity;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;
import java.util.List;

public class Message {
    private Long id;
    private String content;
    private Long channelId;
    private Long senderId;
    private Long organizationId;

    private Instant timeCreated;

    public Message(String content, Long channelId, Long senderId) {
        this.content = content;
        this.channelId = channelId;
        this.senderId = senderId;
        this.organizationId = 0L;
    }

    @JsonProperty("files")
    public List<File> getFiles() {
        System.err.println("getting file for " + id);
        var res = Repo.fileMapper.filter(null, null, id, null);
        System.out.println(res);
        return res;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public long getSenderId(){
        return senderId;
    }
    public void setSenderId(long senderId){
        this.senderId = senderId;
    }

    public long getChannelId() {
        return channelId;
    }

    public void setChannelId(long channelId) {
        this.channelId = channelId;
    }

    public Instant getTimeCreated() {
        return timeCreated;
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }
}
