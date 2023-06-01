package au.edu.sydney.comp5703.cs30.chat.service;

import au.edu.sydney.comp5703.cs30.chat.entity.*;
import au.edu.sydney.comp5703.cs30.chat.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.LinkedList;
import java.util.List;
import java.util.Objects;


@Service
public class ChannelService {

    public static class ChannelServiceException extends Exception {
        public ChannelServiceException(String message) {
            super(message);
        }
    }

    private ChannelMapper channelMapper;

    private ChannelMemberMapper channelMemberMapper;

    private ChannelOrganizationMapper channelOrganizationMapper;

    private OrganizationMemberMapper organizationMemberMapper;

    private OrganizationMapper organizationMapper;

    private UserMapper userMapper;

    @Autowired
    public ChannelService(ChannelMapper channelMapper, ChannelMemberMapper channelMemberMapper, ChannelOrganizationMapper channelOrganizationMapper, OrganizationMemberMapper organizationMemberMapper, OrganizationMapper organizationMapper, UserMapper userMapper) {
        this.channelMapper = channelMapper;
        this.channelMemberMapper = channelMemberMapper;
        this.channelOrganizationMapper = channelOrganizationMapper;
        this.organizationMemberMapper = organizationMemberMapper;
        this.organizationMapper = organizationMapper;
        this.userMapper = userMapper;
    }

    public Channel createChannel(long workspaceId, String name, boolean isPublic, boolean autoJoin) {
        var channel = new Channel(name, workspaceId, isPublic);
        channel.setAutoJoin(autoJoin);
        channelMapper.insertChannel(channel);
        return channelMapper.findById(channel.getId());
    }

    public Channel createDirectMessageChannel(long workspaceId, User callingUser, String name, int memberType, long peerMemberId) throws ChannelServiceException {
        assert memberType == 0 || memberType == 1;
        if (isDirectMessageExists(workspaceId, callingUser, memberType, peerMemberId)) {
            throw new ChannelServiceException("Direct message channel already exists");
        }
        var channel = new Channel(name, workspaceId, false);
        channel.setDirectMessage(true);
        channelMapper.insertChannel(channel);
        if (memberType == 0) {
            var u = userMapper.findById(peerMemberId);
            if (u == null) {
                throw new ChannelServiceException("type 0 member (user) does not exist");
            }
            addMemberToChannel(channel.getId(), peerMemberId);
        } else if (memberType == 1) {
            var organization = organizationMapper.findById(peerMemberId);
            if (organization == null) {
                throw new ChannelServiceException("type 1 member (organization) does not exist");
            }
            var members = organizationMemberMapper.findByOrgId(organization.getId());
            for (var m : members) {
                // TODO: check if org user exists
                if (m.isAutoJoinChannel()) {
                    addMemberToChannel(channel.getId(), m.getUserId());
                }
            }
            var co = new ChannelOrganization(channel.getId(), organization.getId());
            channelOrganizationMapper.insert(co);
        }
        if (memberType != 0 || callingUser.getId() != peerMemberId) {
            addMemberToChannel(channel.getId(), callingUser.getId());
        }
        return channelMapper.findById(channel.getId());
    }

    public boolean isDirectMessageExists(Long workspaceId, User callingUser, int memberType, long memberId) {
        var dms = channelMapper.findDirectMessageChannels(workspaceId, 0, callingUser.getId());
        for (var dm : dms) {
            var peerMembers = getDirectMessagePeerMembers(dm, callingUser);
            for (var m : peerMembers) {
                if (m.getType() == memberType && m.getMemberId() == memberId) {
                    return true;
                }
            }
        }
        return false;
    }

    public void addMemberToChannel(long channelId, long userId) {
        var m = new ChannelMember(channelId, userId);
        channelMemberMapper.insertChannelMember(m);
    }

    public List<ChannelMemberMixin> getDirectMessagePeerMembers(Channel channel, User callingUser) {
        if (!channel.isDirectMessage()) {
            throw new RuntimeException("not a direct message channel");
        }
        var dmPeerMembers = new LinkedList<ChannelMemberMixin>();
        var orgMembers = channelOrganizationMapper.findByChannelId(channel.getId());
        dmPeerMembers.addAll(orgMembers);
        var orgUserIdSet = new HashSet<Long>();
        orgMembers.forEach(co -> {
            var members = organizationMemberMapper.findByOrgId(co.getOrganizationId());
            members.forEach(m -> {
                orgUserIdSet.add(m.getUserId());
            });
        });
        var userMembers = channelMemberMapper.getChannelMembers(channel.getId(), null);
        for (var m : userMembers) {
            if (!Objects.equals(m.getUserId(), callingUser.getId()) && !orgUserIdSet.contains(m.getUserId())) {
                dmPeerMembers.add(m);
            }
        }
        if (orgMembers.size() == 0 && userMembers.size() == 1) {
            var cm = userMembers.get(0);
            if (Objects.equals(cm.getUserId(), callingUser.getId())) {
                // this is the self dm channel
                dmPeerMembers.add(cm);
            }
        }
        return dmPeerMembers;
    }

    public boolean userIsMember(Channel channel, Long userId) {
        return channelMemberMapper.isMember(channel.getId(), 0, userId);
    }

}
