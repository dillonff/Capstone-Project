package au.edu.sydney.comp5703.cs30.chat.entity;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.Util;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.LinkedList;
import java.util.List;

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
        def = Util.createWorkspace("default");
    }

    public Workspace(String name) {
        this.id = getNextId();
        this.name = name;
    }

    @JsonProperty("memberIds")
    public List<Long> getMemberIds() {
        var ids = new LinkedList<Long>();
        for (var wm : Repo.workspaceMemberMap.values()) {
            if (wm.getWorkspaceId() == id) {
                ids.add(wm.getUserId());
            }
        }
        return ids;
    }

    @JsonProperty("channelIds")
    public List<Long> getChannelIds() {
        var ids = new LinkedList<Long>();
        for (var wc : Repo.workspaceChannelMap.values()) {
            if (wc.getWorkspaceId() == id) {
                ids.add(wc.getChannelId());
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
}
