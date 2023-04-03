package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.entity.ClientSession;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.model.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedList;

import static au.edu.sydney.comp5703.cs30.chat.WsUtil.broadcastMessages;
import static au.edu.sydney.comp5703.cs30.chat.WsUtil.makeServerPush;

@RestController
public class ChannelController {
    @RequestMapping(
            value = "/api/v1/channel", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public CreateChannelResponse handleCreateChannel(@RequestBody CreateChannelRequest req, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) throws Exception {
        // this is a simple workaround to know the calling user
        var user = User.userMap.get(auth);
        // create an in-memory channel
        var channel = new Channel(req.getName());
        Channel.channelMap.put(channel.getId(), channel);
        channel.getParticipants().add(user);

        // tell all the clients that the channel info has changed
        var p = makeServerPush("infoChanged", new InfoChangedPush("channel"));
        broadcastMessages(p);

        var result = new CreateChannelResponse(channel.getId());
        return result;
    }

    @RequestMapping(
            value = "/api/v1/channel/join", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public String handleJoinChannel(@RequestBody JoinChannelRequest req, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) throws Exception {
        // for existing client, first figure out the clientSession that was created in auth
        var user = User.userMap.get(req.getUser());
        var channel = Channel.channelMap.get(req.getChannel());
        for (var p : channel.getParticipants()) {
            if (p.getId() == req.getUser()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "already joined");
            }
        }
        channel.getParticipants().add(user);

        var p = makeServerPush("infoChanged", new InfoChangedPush("channel"));
        broadcastMessages(p);

        return "{}";
    }

    @RequestMapping(
            value = "/api/v1/channels", produces = "application/json", method = RequestMethod.GET
    )
    public GetChannelsResponse handleGetChannels(@CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = User.userMap.get(auth);
        var channelIds = new LinkedList<Long>();
        for (var channel : Channel.channelMap.values()) {
            var isParticipant = false;
            for (var u : channel.getParticipants()) {
                if (u.getId() == user.getId()) {
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
    public Channel handleGetChannelInfo(@PathVariable long channelId, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) {
        var user = User.userMap.get(auth);
        System.out.println(user.getName());
        var channel = Channel.channelMap.get(channelId);
        if (channel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "");
        }
        return channel;
    }

}
