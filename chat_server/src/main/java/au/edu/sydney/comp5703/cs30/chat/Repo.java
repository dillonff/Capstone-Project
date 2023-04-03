package au.edu.sydney.comp5703.cs30.chat;

import au.edu.sydney.comp5703.cs30.chat.entity.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class Repo {
    // This is the in-memory repositories
    public static Map<Long, Channel> channelMap = new ConcurrentHashMap<>();

    public static Map<Long, Message> messageMap = new ConcurrentHashMap<>();

    public static Map<Long, User> userMap = new ConcurrentHashMap<>();

    public static Map<Long, Workspace> workspaceMap = new ConcurrentHashMap<>();

    public static Map<Long, WorkspaceMember> workspaceMemberMap = new ConcurrentHashMap<>();
    public static Map<Long, ChannelMember> channelMemberMap = new ConcurrentHashMap<>();

    public static void addMemberToChannel(long channelId, long userId) {
        var m = new ChannelMember(channelId, userId);
        channelMemberMap.put(m.getId(), m);
    }

}
