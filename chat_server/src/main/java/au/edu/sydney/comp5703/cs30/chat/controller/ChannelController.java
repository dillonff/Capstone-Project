package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.Util;
import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.entity.ChannelMember;
import au.edu.sydney.comp5703.cs30.chat.mapper.*;
import au.edu.sydney.comp5703.cs30.chat.model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedList;
import java.util.Objects;

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


    @RequestMapping(
            value = "/api/v1/channels", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public CreateChannelResponse handleCreateChannel(@RequestBody CreateChannelRequest req, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) throws Exception {
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
        if (req.getPeerUserId() == null) {
            channel = Util.createChannel(workspace.getId(), req.getName());
        } else {
            var peerUser = userMapper.findById(req.getPeerUserId());
            if (peerUser == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "peer user " + req.getPeerUserId() + " not found");
            }
            channel = Util.createChannel(workspace.getId(), req.getName(), req.getPeerUserId());
        }
        if (user.getId() != req.getPeerUserId()) {
            addMemberToChannel(channel.getId(), user.getId());
        }

        // tell all the clients that the channel info has changed
        var p = makeServerPush("infoChanged", new InfoChangedPush("channel"));
        broadcastMessages(p);

        var result = new CreateChannelResponse(channel.getId());
        return result;
    }

    @RequestMapping(
            value = "/api/v1/channels/join", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public String handleJoinChannel(@RequestBody JoinChannelRequest req, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) throws Exception {
        // for existing client, first figure out the clientSession that was created in auth
        var user = userMapper.findById(req.getUserId());
        var channel = channelMapper.findById(req.getChannelId());
        var member = channelMemberMapper.findByUserAndChannelId(user.getId(), channel.getId());
        if (member != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Already a member");
        }
        addMemberToChannel(channel.getId(), user.getId());

        var p = makeServerPush("infoChanged", new InfoChangedPush("channel"));
        broadcastMessages(p);

        return "{}";
    }

    @RequestMapping(
            value = "/api/v1/channels", produces = "application/json", method = RequestMethod.GET
    )
    public GetChannelsResponse handleGetChannels(@RequestParam Long workspaceId, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = userMapper.findById(auth);
        var channelIds = new LinkedList<Long>();
        var channels = channelMapper.findByWorkspaceAndMember(workspaceId, user.getId());
        channels.forEach(channel -> {
            channelIds.add(channel.getId());
        });
        var result = new GetChannelsResponse(channelIds);
        return result;
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
        return  channel;
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


    @RequestMapping(
            value = "/api/v1/channels/{channelId}/{action}", method = RequestMethod.PUT
    )
    public void handleChannelAction(@PathVariable Long channelId, @PathVariable String action, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
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
        switch (action) {
            case "pin":
                channelMemberMapper.setPinned(member.getId(), true);
                break;
            case "unpin":
                channelMemberMapper.setPinned(member.getId(), false);
                break;
            default:
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid action: " + action);
        }
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



}


