package au.edu.sydney.comp5703.cs30.chat.db;

import java.util.List;

public class Channel {
    private long id;
    private String Name;
    private long timeCreated;
    private List<User> participants;
}
