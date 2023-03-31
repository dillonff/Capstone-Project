package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.entity.Message;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.model.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MessageController {
    @RequestMapping(
            value = "/api/v1/sendMessage", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public SendMessageResponse handleSendMessage(@RequestBody SendMessageRequest req, @CurrentSecurityContext SecurityContext sc, HttpSession ses) {
        // for existing client, first figure out the clientSession that was created in auth
        var user = (User) ses.getAttribute("user");
        // then figure out the channel by id
        var channelId = req.getChannel();
        var channel = Channel.channelMap.get(channelId);
        // save the message to the memory
        var message = new Message(req.getContent(), channel, user);
        Message.messageMap.put(message.getId(), message);

        // build and send the response
        var result = new SendMessageResponse(message.getId());
        return result;
    }
}
