package au.edu.sydney.comp5703.cs30.chat.entity;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class User {
    // Note: temporarily use this before integrating the database
    private long id;
    private String name;
    private long timeCreated;




    public static Map<Long, User> userMap = new ConcurrentHashMap<>();
    private static SeqIdGen idGen = new SeqIdGen();
    public long getNextId() {
        return idGen.getNextId();
    }

    public User(String name) {
        this.id = getNextId();
        this.name = name;
        timeCreated = System.currentTimeMillis();
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


}
