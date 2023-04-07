package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.entity.Message;
import au.edu.sydney.comp5703.cs30.chat.model.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpHeaders;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.*;

import static au.edu.sydney.comp5703.cs30.chat.WsUtil.broadcastMessagesToChannel;
import static au.edu.sydney.comp5703.cs30.chat.WsUtil.makeServerPush;

@RestController
public class MessageController {

    private static final ObjectMapper om = new ObjectMapper();
    @RequestMapping(
            value = "/api/v1/messages/send", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public SendMessageResponse handleSendMessage(@RequestBody SendMessageRequest req, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) throws Exception {
        // for existing client, first figure out the clientSession that was created in auth
        var user = Repo.userMap.get(auth);
        // then figure out the channel by id
        var channelId = req.getChannelId();
        var channel = Repo.channelMap.get(channelId);
        // save the message to the memory
        var message = new Message(req.getContent(), channel, user);
        Repo.messageMap.put(message.getId(), message);

        // send a new message push to all members in the channel
        var msg = new NewMessagePush(message.getId(), message.getContent(), message.getSender().getId(), message.getChannel().getId());
        var bcastPayload = makeServerPush("newMessage", msg);
        broadcastMessagesToChannel(bcastPayload, channel);

        // build and send the response
        var result = new SendMessageResponse(message.getId());
        return result;
    }




}
