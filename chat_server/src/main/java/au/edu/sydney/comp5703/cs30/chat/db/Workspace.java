package au.edu.sydney.comp5703.cs30.chat.db;

import au.edu.sydney.comp5703.cs30.chat.entity.User;

import java.util.List;

public class Workspace {
    private long id;
    private String name;
    private long timeCreated;
    private List<User> members;
}
