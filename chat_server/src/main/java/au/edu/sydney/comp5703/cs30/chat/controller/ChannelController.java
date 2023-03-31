package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.entity.ClientSession;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.model.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.LinkedList;

@RestController
public class ChannelController {
    @RequestMapping(
            value = "/api/v1/channel", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public CreateChannelResponse handleCreateChannel(@RequestBody CreateChannelRequest req, @CurrentSecurityContext SecurityContext sc, HttpSession ses) {
        // for existing client, first figure out the clientSession that was created in auth
        var user = (User) ses.getAttribute("user");
        // create an in-memory channel
        var channel = new Channel(req.getName());
        Channel.channelMap.put(channel.getId(), channel);
        channel.getParticipants().add(user);
        var result = new CreateChannelResponse(channel.getId());
        return result;
    }

    @RequestMapping(
            value = "/api/v1/channel/join", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public String handleJoinChannel(@RequestBody JoinChannelRequest req, @CurrentSecurityContext SecurityContext sc, HttpSession ses) {
        // for existing client, first figure out the clientSession that was created in auth
        var user = (User) ses.getAttribute("user");
        var channel = Channel.channelMap.get(req.getChannel());
        channel.getParticipants().add(user);
        return "{}";
    }

    @RequestMapping(
            value = "/api/v1/channels", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public GetChannelsResponse handleGetChannels(@RequestBody JoinChannelRequest req, @CurrentSecurityContext SecurityContext sc, HttpSession ses) {
        var channelIds = new LinkedList<Long>();
        for (var channel : Channel.channelMap.values()) {
            channelIds.add(channel.getId());
        }
        var result = new GetChannelsResponse(channelIds);
        return result;
    }

    @RequestMapping(
            value = "/api/v1/channel", produces = "application/json", method = RequestMethod.GET
    )
    public Channel handleGetChannelInfo(@RequestParam long channelId, @CurrentSecurityContext SecurityContext sc, HttpSession ses) {
        var channel = Channel.channelMap.get(channelId);
        if (channel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "");
        }
        return channel;
    }

}
