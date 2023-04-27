package au.edu.sydney.comp5703.cs30.chat.entity;

import java.time.Instant;

public class Message {
    private Long id;
    private String content;
    private Long channelId;
    private Long senderId;

    private Instant timeCreated;

    public Message(String content, Long channelId, Long senderId) {
        this.content = content;
        this.channelId = channelId;
        this.senderId = senderId;
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
}
