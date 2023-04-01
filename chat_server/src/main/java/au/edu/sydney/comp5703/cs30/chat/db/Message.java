package au.edu.sydney.comp5703.cs30.chat.db;

import au.edu.sydney.comp5703.cs30.chat.entity.User;

public class Message {
    private long id;
    private String content;
    private long time;
    private long channelId;
    private long senderId;
}
