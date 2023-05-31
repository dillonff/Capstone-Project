package au.edu.sydney.comp5703.cs30.chat;

import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.entity.ChannelOrganization;
import au.edu.sydney.comp5703.cs30.chat.entity.Workspace;
import au.edu.sydney.comp5703.cs30.chat.mapper.ChannelMapper;
import au.edu.sydney.comp5703.cs30.chat.mapper.WorkspaceMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import static au.edu.sydney.comp5703.cs30.chat.Repo.*;

@Component
public class Util {
    @Autowired
    public static ChannelMapper channelMapper;

    @Autowired
    public static WorkspaceMapper workspaceMapper;

    @Autowired
    public ChannelMapper auChannelMapper;

    @Autowired
    public WorkspaceMapper auWorkspaceMapper;

    @PostConstruct
    private void init() throws Exception {
        channelMapper = auChannelMapper;
        workspaceMapper = auWorkspaceMapper;
    }

    public static Workspace createWorkspace(String name) {
        var workspace = new Workspace(name);
        workspaceMapper.insertWorkspace(workspace);
        var general = new Channel("general", workspace.getId(), true);
        channelMapper.insertChannel(general);
        return workspace;
    }


    public static Channel getChannelForName(long workspaceId, String channelName) {
        var channels = channelMapper.findByWorkspaceAndName(workspaceId, channelName);
        if (channels.size() == 0) {
            throw new RuntimeException("channel " + channelName + "not found");
        }
        return channels.get(0);
    }
}
