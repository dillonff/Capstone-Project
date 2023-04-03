package au.edu.sydney.comp5703.cs30.chat;

import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.entity.Workspace;

import static au.edu.sydney.comp5703.cs30.chat.Repo.*;

public class Util {
    public static Workspace createWorkspace(String name) {
        var workspace = new Workspace(name);
        var defaultChannel = createChannel("general");
        addChannelToWorkspace(workspace.getId(), defaultChannel.getId());
        workspaceMap.put(workspace.getId(), workspace);
        return workspace;
    }

    public static Channel createChannel(String name) {
        var channel = new Channel(name);
        channelMap.put(channel.getId(), channel);
        return channel;
    }

    public static Channel getChannelForName(long workspaceId, String channelName) {
        for (var c : workspaceChannelMap.values()) {
            if (c.getWorkspaceId() == workspaceId) {
                var channel = channelMap.get(c.getChannelId());
                if (channel != null && channel.getName().equals(channelName))
                    return channel;
            }
        }
        throw new RuntimeException("channel " + channelName + "not found");
    }
}
