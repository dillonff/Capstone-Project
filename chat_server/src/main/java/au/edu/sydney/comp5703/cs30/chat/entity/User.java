package au.edu.sydney.comp5703.cs30.chat.entity;

import java.io.Serializable;
import java.util.Date;

public class User extends BaseEntity implements Serializable {
    // Note: temporarily use this before integrating the database
    private long id;
    private String name;
    private Date timeCreated;

    private String password;


    private static SeqIdGen idGen = new SeqIdGen();
    public long getNextId() {
        return idGen.getNextId();
    }

    public Date getTimeCreated() {
        return timeCreated;
    }

    public void setTimeCreated(Date timeCreated) {
        this.timeCreated = timeCreated;
    }

    public User(String name) {
        this.id = getNextId();
        this.name = name;
        timeCreated = new Date();
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
