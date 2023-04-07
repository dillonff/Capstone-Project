package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.model.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedList;

import static au.edu.sydney.comp5703.cs30.chat.Repo.addMemberToChannel;
import static au.edu.sydney.comp5703.cs30.chat.Repo.channelMemberMap;
import static au.edu.sydney.comp5703.cs30.chat.WsUtil.broadcastMessages;
import static au.edu.sydney.comp5703.cs30.chat.WsUtil.makeServerPush;

@RestController
public class ChannelController {
    @RequestMapping(
            value = "/api/v1/channels", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public CreateChannelResponse handleCreateChannel(@RequestBody CreateChannelRequest req, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) throws Exception {
        // this is a simple workaround to know the calling user
        var user = Repo.userMap.get(auth);
        // create an in-memory channel
        var channel = new Channel(req.getName());
        Repo.channelMap.put(channel.getId(), channel);
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
    public GetChannelsResponse handleGetChannels(@CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = Repo.userMap.get(auth);
        var channelIds = new LinkedList<Long>();
        for (var channel : Repo.channelMap.values()) {
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
            value = "/api/v1/channels/{channelId}", produces = "application/json", method = RequestMethod.GET
    )
    public Channel handleGetChannelInfo(@PathVariable long channelId, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = Repo.userMap.get(auth);
        System.out.println(user.getName());
        var channel = Repo.channelMap.get(channelId);
        if (channel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "");
        }
        return channel;
    }

}
