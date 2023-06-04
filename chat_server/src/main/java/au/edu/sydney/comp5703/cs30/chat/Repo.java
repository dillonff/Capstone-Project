package au.edu.sydney.comp5703.cs30.chat;

import au.edu.sydney.comp5703.cs30.chat.entity.*;
import au.edu.sydney.comp5703.cs30.chat.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.apache.ibatis.binding.MapperProxy;

@Component
public class Repo {

    // these are really workaround for injecting beans to static fields
    // the code here should be put into corresponding service classes
    public static WorkspaceMapper workspaceMapper;

    public static ChannelMemberMapper channelMemberMapper;

    public static ChannelMapper channelMapper;

    @Autowired
    public ChannelMapper auChannelMapper;

    @Autowired
    public WorkspaceMapper auWorkspaceMapper;

    @Autowired
    public ChannelMemberMapper auChannelMemberMapper;

    @Autowired
    public FileMapper aufileMapper;

    public static FileMapper fileMapper;

    @Autowired
    public OrganizationMemberMapper auOrganizationMemberMapper;

    public static OrganizationMemberMapper organizationMemberMapper;

    @Autowired
    public WorkspaceOrganizationMapper auWorkspaceOrganizationMapper;

    public static WorkspaceOrganizationMapper workspaceOrganizationMapper;

    @Autowired
    public WorkspaceMemberMapper auWorkspaceMemberMapper;

    public static WorkspaceMemberMapper workspaceMemberMapper;

    @Autowired
    public ChannelOrganizationMapper auChannelOrganizationMapper;

    public static ChannelOrganizationMapper channelOrganizationMapper;

    @Autowired
    public OrganizationMapper auOrganizationMapper;

    public static OrganizationMapper organizationMapper;

    @PostConstruct
    private void init() {
        channelMapper = auChannelMapper;
        workspaceMapper = auWorkspaceMapper;
        channelMemberMapper = auChannelMemberMapper;
        fileMapper = aufileMapper;
        organizationMemberMapper = auOrganizationMemberMapper;
        workspaceOrganizationMapper = auWorkspaceOrganizationMapper;
        workspaceMemberMapper = auWorkspaceMemberMapper;
        channelOrganizationMapper = auChannelOrganizationMapper;
        organizationMapper = auOrganizationMapper;
        System.err.println("mappers: " + channelMapper + workspaceMapper + channelMemberMapper);
    }

    // This is the in-memory repositories
    // public static Map<Long, Channel> channelMap0 = new ConcurrentHashMap<>();

    public static Map<Long, Message> messageMap = new ConcurrentHashMap<>();

    // public static Map<Long, User> userMap = new ConcurrentHashMap<>();

    // public static Map<Long, Workspace> workspaceMap = new ConcurrentHashMap<>();

    // public static Map<Long, WorkspaceMember> workspaceMemberMap = new ConcurrentHashMap<>();
    // public static Map<Long, ChannelMember> channelMemberMap = new ConcurrentHashMap<>();




    public static void addMemberToWorkspace(long workspaceId, int type, long memberId) {
        workspaceMemberMapper.insert(new WorkspaceMember(workspaceId, type, memberId));
        for (var c : channelMapper.findPublicByWorkspaceId(workspaceId)) {
            if (!c.shouldAutoJoin())
                continue;
            switch (type) {
                case 0:
                    channelMemberMapper.insertChannelMember(new ChannelMember(c.getId(), memberId));
                    break;
                case 1:
                    channelOrganizationMapper.insert(new ChannelOrganization(c.getId(), memberId));
                    break;
                default:
                    throw new RuntimeException("Invalid type: " + type);
            }
        }
    }

}
