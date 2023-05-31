package au.edu.sydney.comp5703.cs30.chat.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.Instant;

public class User {
    // Note: temporarily use this before integrating the database
    private long id;
    private String username;

    @JsonIgnore
    private String password;

    private String phone;
    private String email;

    private int isDeleted;


    public User(String username) {
        this.username = username;
        this.password = "";
        this.email = "";
        this.phone = "";
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getIsDeleted() {
        return isDeleted;
    }

    public void setIsDeleted(int is_deleted) {
        this.isDeleted = is_deleted;
    }
}
