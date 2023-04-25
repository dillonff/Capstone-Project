package au.edu.sydney.comp5703.cs30.chat;

import au.edu.sydney.comp5703.cs30.chat.entity.*;
import au.edu.sydney.comp5703.cs30.chat.mapper.ChannelMapper;
import au.edu.sydney.comp5703.cs30.chat.mapper.ChannelMemberMapper;
import au.edu.sydney.comp5703.cs30.chat.mapper.WorkspaceMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Repo {
    @Autowired
    public static WorkspaceMapper workspaceMapper;

    @Autowired
    public static ChannelMemberMapper channelMemberMapper;

    @Autowired
    public static ChannelMapper channelMapper;

    // This is the in-memory repositories
    // public static Map<Long, Channel> channelMap0 = new ConcurrentHashMap<>();

    public static Map<Long, Message> messageMap = new ConcurrentHashMap<>();

    public static Map<Long, User> userMap = new ConcurrentHashMap<>();

    // public static Map<Long, Workspace> workspaceMap = new ConcurrentHashMap<>();

    // public static Map<Long, WorkspaceMember> workspaceMemberMap = new ConcurrentHashMap<>();
    // public static Map<Long, ChannelMember> channelMemberMap = new ConcurrentHashMap<>();


    public static void addMemberToChannel(long channelId, long userId) {
        var m = new ChannelMember(channelId, userId);
        channelMemberMapper.insertChannelMember(m);
    }

    public static void addMemberToWorkspace(long workspaceId, long userId) {
        workspaceMapper.addMember(workspaceId, userId);
        var general = Util.getChannelForName(workspaceId, "general");
        addMemberToChannel(general.getId(), userId);
    }

}
