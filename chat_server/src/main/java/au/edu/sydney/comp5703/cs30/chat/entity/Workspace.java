package au.edu.sydney.comp5703.cs30.chat.entity;

import static au.edu.sydney.comp5703.cs30.chat.Repo.workspaceMap;

public class Workspace {
    public long id;
    public String name;

    private static SeqIdGen idGen = new SeqIdGen();
    public long getNextId() {
        return idGen.getNextId();
    }

    // default workspace where everyone will be joined automatically
    public static Workspace def;
    static {
        def = new Workspace("default workspace");
        workspaceMap.put(def.getId(), def);
    }

    public Workspace(String name) {
        this.id = getNextId();
        this.name = name;
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
}
