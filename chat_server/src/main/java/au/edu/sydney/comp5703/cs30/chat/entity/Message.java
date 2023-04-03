package au.edu.sydney.comp5703.cs30.chat.entity;

public class Message {
    private long id;
    private String content;
    private long time;
    private Channel channel;
    private User sender;

    private static SeqIdGen idGen = new SeqIdGen();
    public long getNextId() {
        return idGen.getNextId();
    }

    public Message(String content, Channel channel, User sender) {
        this.id = getNextId();
        this.content = content;
        this.channel = channel;
        this.sender = sender;
        this.time = System.currentTimeMillis();
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

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
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
}
