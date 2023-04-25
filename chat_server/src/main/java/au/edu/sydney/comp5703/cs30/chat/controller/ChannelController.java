package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.Util;
import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.mapper.ChannelMapper;
import au.edu.sydney.comp5703.cs30.chat.mapper.WorkspaceMapper;
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
    private static ChannelMapper channelMapper;
    @Autowired
    private static WorkspaceMapper workspaceMapper;


    @RequestMapping(
            value = "/api/v1/channels", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public CreateChannelResponse handleCreateChannel(@RequestBody CreateChannelRequest req, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) throws Exception {
        // this is a simple workaround to know the calling user
        var user = Repo.userMap.get(auth);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
        var workspace = workspaceMapper.findById(req.getWorkspace());
        if (workspace == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "workspace not found");
        }
        // create an in-memory channel
        var channel = Util.createChannel(workspace.getId(), req.getName());
        addMemberToChannel(channel.getId(), user.getId());

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
        var user = Repo.userMap.get(req.getUserId());
        var channel = channelMapper.findById(req.getChannelId());
        // TODO: avoid duplicate member entry
        addMemberToChannel(channel.getId(), user.getId());

        var p = makeServerPush("infoChanged", new InfoChangedPush("channel"));
        broadcastMessages(p);

        return "{}";
    }

    @RequestMapping(
            value = "/api/v1/channels", produces = "application/json", method = RequestMethod.GET
    )
    public GetChannelsResponse handleGetChannels(@RequestParam Long workspaceId, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = Repo.userMap.get(auth);
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
    public Channel handleGetChannelInfo(@PathVariable long channelId, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = Repo.userMap.get(auth);
        System.out.println(user.getUsername());
        var channel = channelMapper.findById(channelId);
        if (channel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "");
        }
        return channel;
    }

}
