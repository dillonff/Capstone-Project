package au.edu.sydney.comp5703.cs30.chat.entity;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.*;

import static au.edu.sydney.comp5703.cs30.chat.Repo.channelMemberMap;

public class Channel {
    // Note: temporarily use this before integrating the database

    private static SeqIdGen idGen = new SeqIdGen();
    // This is the general channel that automatically adds anyone
    public static Channel general;

    static {
        general = new Channel("general");
        Repo.channelMap.put(general.getId(), general);
    }

    public long getNextId() {
        return idGen.getNextId();
    }

    public Channel(String name) {
        this.id = getNextId();
        this.name = name;
        timeCreated = System.currentTimeMillis();
    }

    private long id;
    private String name;
    private long timeCreated;

    private long workspaceId;

    @JsonProperty("participantIds")
    public List<Long> getParticipantIds() {
        var ids = new LinkedList<Long>();
        for (var m : channelMemberMap.values()) {
            if (m.getChannelId() == id) {
                ids.add(m.getUserId());
            }
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

//    public List<User> getParticipants() {
//        return participants;
//    }

//    public void setParticipants(List<User> participants) {
//        this.participants = participants;
//    }
}
