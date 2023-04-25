package au.edu.sydney.comp5703.cs30.chat.entity;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.Util;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;


@Component
public class Workspace {
    public long id;
    public String name;

    // default workspace where everyone will be joined automatically
    public static Workspace def;
    @PostConstruct
    private void init() {

    }

    public Workspace() {
        name = "";
    }

    public Workspace(String name) {
        this.name = name;
    }

    @JsonProperty("memberIds")
    public List<Long> getMemberIds() {
        return Repo.workspaceMapper.getMemberIds(id);
    }

    @JsonProperty("channelIds")
    public List<Long> getChannelIds() {
        return Repo.channelMapper.findIdByWorkspaceId(id);
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
