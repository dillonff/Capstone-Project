package au.edu.sydney.comp5703.cs30.chat.models;

public class CreateChannelRequest {
    public String name;
    public long users[];

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long[] getUsers() {
        return users;
    }

    public void setUsers(long[] users) {
        this.users = users;
    }
}
