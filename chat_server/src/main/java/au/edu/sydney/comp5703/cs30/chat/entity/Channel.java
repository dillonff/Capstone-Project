package au.edu.sydney.comp5703.cs30.chat.entity;

import au.edu.sydney.comp5703.cs30.chat.entity.User;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class Channel {
    // Note: temporarily use this before integrating the database

    private static SeqIdGen idGen = new SeqIdGen();
    // This is the general channel that automatically adds anyone
    public static Channel general;
    public static Map<Long, Channel> channelMap = new ConcurrentHashMap<>();
    static {
        general = new Channel("general");
        channelMap.put(general.getId(), general);
    }

    public long getNextId() {
        return idGen.getNextId();
    }

    public Channel(String name) {
        this.id = getNextId();
        this.name = name;
        timeCreated = System.currentTimeMillis();
        participants = new ArrayList<>();
    }

    private long id;
    private String name;
    private long timeCreated;
    private List<User> participants;

    public List<Long> getParticipantIds() {
        var ids = new LinkedList<Long>();
        for (var user : participants) {
            ids.add(user.getId());
        }
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

    public long getTimeCreated() {
        return timeCreated;
    }

    public void setTimeCreated(long timeCreated) {
        this.timeCreated = timeCreated;
    }

    public List<User> getParticipants() {
        return participants;
    }

    public void setParticipants(List<User> participants) {
        this.participants = participants;
    }
}
