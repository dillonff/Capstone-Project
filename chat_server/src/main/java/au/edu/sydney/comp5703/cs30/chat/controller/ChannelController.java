package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.Util;
import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.entity.ChannelMember;
import au.edu.sydney.comp5703.cs30.chat.entity.ChannelOrganization;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.mapper.*;
import au.edu.sydney.comp5703.cs30.chat.model.*;
import au.edu.sydney.comp5703.cs30.chat.service.ChannelService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.*;

import static au.edu.sydney.comp5703.cs30.chat.Repo.*;
import static au.edu.sydney.comp5703.cs30.chat.WsUtil.broadcastMessages;
import static au.edu.sydney.comp5703.cs30.chat.WsUtil.makeServerPush;

@RestController
public class ChannelController {
    @Autowired
    private ChannelMapper channelMapper;
    @Autowired
    private WorkspaceMapper workspaceMapper;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private ChannelService channelService;

    @RequestMapping(
            value = "/api/v1/channels", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public Channel handleCreateChannel(@RequestBody CreateChannelRequest req, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) throws Exception {
        // this is a simple workaround to know the calling user
        var user = userMapper.findById(auth);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
        var workspace = workspaceMapper.findById(req.getWorkspace());
        if (workspace == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "workspace not found");
        }
        Channel channel;
        if (req.getPeerMemberId() == null) {
            if (!StringUtils.hasLength(req.getName())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "channel name required");
            }
            channel = channelService.createChannel(workspace.getId(), req.getName(), req.isPublicChannel(), req.shouldAutoJoin());
            channelService.addMemberToChannel(channel.getId(), user.getId());
        } else {
            if (req.getPeerMemberType() != 0 && req.getPeerMemberType() != 1) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "peerMemberType must be 0 (user) or 1 (org)");
            }
            try {
                channel = channelService.createDirectMessageChannel(workspace.getId(), user, req.getName(), req.getPeerMemberType(), req.getPeerMemberId());
            } catch (ChannelService.ChannelServiceException e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
            }
        }

        // tell all the clients that the channel info has changed
        var p = makeServerPush("infoChanged", new InfoChangedPush("channel"));
        broadcastMessages(p);

        channel = channelMapper.findById(channel.getId());
        return channel;
    }

    @RequestMapping(
            value = "/api/v1/channels/join", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public String handleJoinChannel(@RequestBody JoinChannelRequest req, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) throws Exception {
        var channel = channelMapper.findById(req.getChannelId());
        if (channel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "channel not found");
        }
        switch (req.getType()) {
            case 0:
                var user = userMapper.findById(req.getMemberId());
                if (user == null) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
                }
                var member = channelMemberMapper.findByUserAndChannelId(user.getId(), channel.getId());
                if (member != null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already a member");
                }
                channelService.addMemberToChannel(channel.getId(), user.getId());
                break;
            case 1:
                var org = organizationMapper.findById(req.getMemberId());
                if (org == null) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "organization not found");
                }
                if (channelOrganizationMapper.isMember(channel.getId(), org.getId())) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already a member");
                }
                channelOrganizationMapper.insert(new ChannelOrganization(channel.getId(), org.getId()));
                break;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid member type");
        }


        var p = makeServerPush("infoChanged", new InfoChangedPush("channel"));
        broadcastMessages(p);

        return "{}";
    }

    @RequestMapping(
            value = "/api/v1/channels", produces = "application/json", method = RequestMethod.GET
    )
    public List<Channel> handleGetChannels(@RequestParam Long workspaceId, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = userMapper.findById(auth);
        var privateChannels = channelMapper.findPrivateByWorkspaceAndMember(workspaceId, user.getId());
        var publicChannels = channelMapper.findPublicByWorkspaceId(workspaceId);
        // TODO: include channels that the user's org is a member of
        var channels = new LinkedList<Channel>();
        var idSet = new HashSet<Long>();
        addChannelUnique(channels, idSet, privateChannels);
        addChannelUnique(channels, idSet, publicChannels);
        channels.forEach(channel -> {
            channelPostProcess(channel, user);
        });
        return channels;
    }

    @RequestMapping(
            value = "/api/v1/channels/{channelId}", produces = "application/json", method = RequestMethod.GET

    )
        public Channel handleGetChannelInfo(@PathVariable long channelId,
                                        @CurrentSecurityContext SecurityContext sc,
                                        @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = userMapper.findById(auth);
        System.out.println(user.getUsername());
        var channel = channelMapper.findById(channelId);
        if (channel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "");
        }
        channelPostProcess(channel, user);
        return  channel;
    }

    @RequestMapping(value = "/api/v1/channels/{channelId}", produces = "application/json", consumes = "application/json", method = RequestMethod.PUT)
    public String handleUpdateChannel(@PathVariable long channelId,
                                      @RequestBody Channel req,
                                      @CurrentSecurityContext SecurityContext sc,
                                      @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = userMapper.findById(auth);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "user not authenticated");
        }
        var infoValid = false;
        var c = new Channel();
        if (req.shouldAutoJoin() != null) {
            infoValid = true;
            c.setAutoJoin(req.shouldAutoJoin());
        }
        if (StringUtils.hasLength(req.getName())) {
            infoValid = true;
            c.setName(req.getName());
        }
        if (!infoValid) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "no information can be updated");
        }
        var res = channelMapper.updateChannel(c);
        if (res != 1) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "unexpected channel update error");
        }
        return "{}";
    }


    @RequestMapping(
            value = "/api/v1/channels/{channelId}/memberInfo", produces = "application/json", method = RequestMethod.GET

    )
    public ChannelMember handleGetChannelMember(@PathVariable long channelId,
                                                @CurrentSecurityContext SecurityContext sc,
                                                @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = userMapper.findById(auth);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "user not authenticated");
        }
        var channelMember = channelMemberMapper.findByUserAndChannelId(user.getId(), channelId);
        if (channelMember == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "channel member not found");
        }
        return  channelMember;
    }

    // This returns both ChannelMember and ChannelOrganization
    @RequestMapping(
            value = "/api/v1/channels/{channelId}/members", produces = "application/json", method = RequestMethod.GET
    )
    public List<Object> handleGetChannelMembers(@PathVariable long channelId,
                                                       @CurrentSecurityContext SecurityContext sc,
                                                       @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = userMapper.findById(auth);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "user not authenticated");
        }
        var channel = channelMapper.findById(channelId);
        if (channel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "channel not found");
        }
        var members = new LinkedList<>();
        var channelMembers = channelMemberMapper.getChannelMembers(channelId, null);
        members.addAll(channelMembers);
        var channelOrganizations = channelOrganizationMapper.findByChannelId(channelId);
        members.addAll(channelOrganizations);
        return members;
    }


    @RequestMapping(
            value = "/api/v1/channels/{channelId}/{action}", method = RequestMethod.PUT, produces = "application/json"
    )
    public String handleChannelAction(@PathVariable Long channelId, @PathVariable String action, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) throws Exception {
        var user = userMapper.findById(auth);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authenticated");
        }
        var channel = channelMapper.findById(channelId);
        if (channel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found");
        }
        var member = channelMemberMapper.findByUserAndChannelId(user.getId(), channelId);
        if (member == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not a channel member");
        }
        var shouldPush = false;
        switch (action) {
            case "pin":
                channelMemberMapper.setPinned(member.getId(), true);
                shouldPush = true;
                break;
            case "unpin":
                channelMemberMapper.setPinned(member.getId(), false);
                shouldPush = true;
                break;
            case "read":
                var latest = channelService.getLatestMessage(channel.getId());
                if (latest != null) {
                    channelMemberMapper.setLastReadMessageId(latest.getId(), member.getId());
                }
                break;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid action: " + action);
        }
        if (shouldPush) {
            var p = makeServerPush("infoChanged", new InfoChangedPush("channel"));
            broadcastMessages(p);
        }
        return "{}";
    }

    @RequestMapping(value = "/api/v1/channels/{channelId}/messages/{messageId}/read",
            method = RequestMethod.PUT)
    public void markMessageAsRead(@PathVariable Long channelId, @PathVariable Long messageId,
                                  @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = userMapper.findById(auth);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authenticated");
        }
        var channel = channelMapper.findById(channelId);
        if (channel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found");
        }
        var member = channelMemberMapper.findByUserAndChannelId(user.getId(), channelId);
        if (member == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Not a channel member");
        }


        long lastMessageId = channelMemberMapper.getLastMessageIdByChannelId(channelId, user.getId());

        if (lastMessageId >= messageId) {
            return;
        }

        if(lastMessageId < messageId){
            channelMemberMapper.setLastReadMessageId(messageId, member.getId());
        }

    }

    // set some derived attrs of channels, such as callerIsMember and dmPeerMembers
    private void channelPostProcess(Channel channel, User callingUser) {
        if (callingUser != null) {
            var isMember = channelService.userIsMember(channel, callingUser.getId());;
            channel.setCallerIsMember(isMember);
        }
        if (channel.isDirectMessage()) {
            channel.setDmPeerMembers(channelService.getDirectMessagePeerMembers(channel, callingUser));
        }
        var latest = channelService.getLatestMessage(channel.getId());
        if (latest != null) {
            channel.setLatestMessageId(latest.getId());
        }
        var cm = channelMemberMapper.findByUserAndChannelId(callingUser.getId(), channel.getId());
        channel.setCallerMember(cm);
    }

    private void addChannelUnique(List<Channel> channels, Set<Long> idSet, List<Channel> target) {
        for (var c : target) {
            if (!idSet.contains(c.getId())) {
                idSet.add(c.getId());
                channels.add(c);
            }
        }
    }
}


