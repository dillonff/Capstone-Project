package au.edu.sydney.comp5703.cs30.chat.entity;

import java.util.Date;

public class Message {
    private long id;
    private String content;
    private Date time;
    private Channel channel;

    private long channelId;
    private User sender;
    private long senderId;

    private static SeqIdGen idGen = new SeqIdGen();
    public long getNextId() {
        return idGen.getNextId();
    }

    public Message(String content, Channel channel, User sender) {
        this.id = getNextId();
        this.content = content;
        this.channel = channel;
        this.channelId = channel.getId();
        this.sender = sender;
        this.senderId = sender.getId();
        this.time = new Date();
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

    public Date getTime() {
        return time;
    }

    public void setTime(Date time) {
        this.time = time;
    }

    public Channel getChannel() {
        return channel;
    }

    public void setChannel(Channel channel) {
        this.channel = channel;
    }

    public User getSender() {
        return sender;
    }

    public void setSender(User sender) {
        this.sender = sender;
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
}
