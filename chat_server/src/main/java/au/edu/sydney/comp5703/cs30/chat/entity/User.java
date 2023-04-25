package au.edu.sydney.comp5703.cs30.chat.entity;

public class User {
    // Note: temporarily use this before integrating the database
    private long id;
    private String username;
    private String password;

    public User(String username) {
        this.username = username;
        this.password = "";
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
}
