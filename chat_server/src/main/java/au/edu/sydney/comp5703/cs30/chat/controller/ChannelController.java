package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.model.*;
import au.edu.sydney.comp5703.cs30.chat.service.ChannelService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedList;
import java.util.Objects;

import static au.edu.sydney.comp5703.cs30.chat.Repo.addMemberToChannel;
import static au.edu.sydney.comp5703.cs30.chat.Repo.channelMemberMap;
import static au.edu.sydney.comp5703.cs30.chat.WsUtil.broadcastMessages;
import static au.edu.sydney.comp5703.cs30.chat.WsUtil.makeServerPush;

@RestController
public class ChannelController {

    private ChannelService channelService;

    @RequestMapping(
            value = "/api/v1/channels", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public CreateChannelResponse handleCreateChannel(@RequestBody CreateChannelRequest req, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) throws Exception {
        // this is a simple workaround to know the calling user
        var user = Repo.userMap.get(auth);
        // create an in-memory channel
        var channel = new Channel(req.getName());
        if (channel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "user not found");
        }
        var workspace = Repo.workspaceMap.get(req.getWorkspace());
        if (workspace == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "workspace not found");
        }
        Repo.channelMap.put(channel.getId(), channel);
        Repo.addChannelToWorkspace(workspace.getId(), channel.getId());
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
        var channel = Repo.channelMap.get(req.getChannelId());
        for (var m : channelMemberMap.values()) {
            if (m.getUserId() == req.getUserId() && m.getChannelId() == channel.getId()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "already joined");
            }
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
        var user = Repo.userMap.get(auth);
        var channelIds = new LinkedList<Long>();
        for (var wc : Repo.workspaceChannelMap.values()) {
            if (!Objects.equals(wc.getWorkspaceId(), workspaceId)) {
                continue;
            }
            var channel = Repo.channelMap.get(wc.getChannelId());
            var isParticipant = false;
            for (var m : channelMemberMap.values()) {
                if (m.getChannelId() != channel.getId())
                    continue;
                if (m.getUserId() == user.getId()) {
                    isParticipant = true;
                    break;
                }
            }
            if (isParticipant) {
                channelIds.add(channel.getId());
            }
        }
        var result = new GetChannelsResponse(channelIds);
        return result;
    }

    @RequestMapping(
            value = "/api/v1/channel/{channelId}", produces = "application/json", method = RequestMethod.GET

    )
        public Channel handleGetChannelInfo(@PathVariable long channelId,
                                        @CurrentSecurityContext SecurityContext sc,
                                        @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        Channel channel = channelService.getChannel(channelId);
        var user = Repo.userMap.get(auth);
//        System.out.println(user.getName());
//        var channel = Repo.channelMap.get(channelId);
        if (channel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "");
        }
        return  channel;
    }



    @RequestMapping(
            value = "/api/v1/channels/pin", produces = "application/json", method = RequestMethod.POST
    )
    public PinChannelResponse handlePinChannel(@RequestParam Long channelId, @RequestParam boolean pinned, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = Repo.userMap.get(auth);
        var channel = Repo.channelMap.get(channelId);
        if (channel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Channel not found");
        }
        var isParticipant = false;
        for (var m : channelMemberMap.values()) {
            if (m.getChannelId() != channelId) {
                continue;
            }
            if (m.getUserId() == user.getId()) {
                isParticipant = true;
                break;
            }
        }
        if (!isParticipant) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User is not a participant of the channel");
        }
        boolean isPinned = channel.getPinned();
        channel.setPinned(!isPinned);
        var result = new PinChannelResponse(channelId, isPinned);
        return result;
    }





}


