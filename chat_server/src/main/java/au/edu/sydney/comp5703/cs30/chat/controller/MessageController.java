package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.entity.Message;
import au.edu.sydney.comp5703.cs30.chat.mapper.*;
import au.edu.sydney.comp5703.cs30.chat.model.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.DateTimeException;
import java.time.Instant;
import java.time.format.DateTimeParseException;

import static au.edu.sydney.comp5703.cs30.chat.WsUtil.broadcastMessagesToChannel;
import static au.edu.sydney.comp5703.cs30.chat.WsUtil.makeServerPush;

@RestController
public class MessageController {
    @Autowired
    public ChannelMapper channelMapper;

    @Autowired
    public UserMapper userMapper;

    @Autowired
    private MessageMapper messageMapper;

    @Autowired
    private FileMapper fileMapper;

    @Autowired
    private WorkspaceMapper workspaceMapper;

    private static final ObjectMapper om = new ObjectMapper();
    @RequestMapping(
            value = "/api/v1/messages/send", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public SendMessageResponse handleSendMessage(@RequestBody SendMessageRequest req, @CurrentSecurityContext SecurityContext sc, @RequestHeader(HttpHeaders.AUTHORIZATION) Long auth) throws Exception {
        // for existing client, first figure out the clientSession that was created in auth
        var user = userMapper.findById(auth);
        // then figure out the channel by id
        var channelId = req.getChannelId();
        var channel = channelMapper.findById(channelId);
        var workspace = workspaceMapper.findById(channel.getWorkspaceId());
        // save the message to the memory
        var message = new Message(req.getContent(), channel.getId(), user.getId());
        if (req.getOrganizationId() != null && req.getOrganizationId() > 0) {
            message.setOrganizationId(req.getOrganizationId());
        }

        var fileIds = req.getFileIds();
        if (fileIds != null) {
            for (var id : fileIds) {
                var file = fileMapper.findById(id);
                if (file == null) {
                    throw new ResponseStatusException(HttpStatus.NOT_FOUND, "File of id " + id + " not found");
                }
                // TODO: check file access
            }
        }

        messageMapper.insertMessage(message);
        // TODO: this should be done in one transaction
        if (fileIds != null) {
            for (var id : fileIds) {
                fileMapper.addUsage(3, message.getId(), id);
                fileMapper.addUsage(2, channel.getId(), id);
                fileMapper.addUsage(1, workspace.getId(), id);
            }
        }



        // send a new message push to all members in the channel
        var msg = new NewMessagePush(message.getId(), message.getContent(), message.getSenderId(), message.getChannelId());
        var bcastPayload = makeServerPush("newMessage", msg);
        broadcastMessagesToChannel(bcastPayload, channel);

        // build and send the response
        var result = new SendMessageResponse(message.getId());
        return result;
    }

    @RequestMapping(
            value = "/api/v1/messages/{messageId}", produces = "application/json", method = RequestMethod.GET
    )
    public Message handleGetMessage(@PathVariable Long messageId) {
        var message = messageMapper.findById(messageId);
        if (message == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "message of id " + messageId + " not found");
        }
        return message;
    }

    @RequestMapping(
            value = "/api/v1/messages", produces = "application/json", method = RequestMethod.GET
    )
    public GetMessageResponse handleGetMessages(
            @RequestParam(required = false) Long id,
            @RequestParam(required = false) Long channelId,
            @RequestParam(required = false) Long page,
            @RequestParam(required = false) Long pageSize,
            @RequestParam(required = false) Boolean isDesc,
            @RequestParam(required = false) String afterTime,
            @RequestParam(required = false) String beforeTime,
            @RequestParam(required = false) String notAfterTime,
            @RequestParam(required = false) String notBeforeTime
    ) {
        Long offset = 0L;
        Instant after = null;
        Instant before = null;
        Instant notAfter = null;
        Instant notBefore = null;
        if (isDesc == null) {
            isDesc = true;
        }
        if (pageSize == null) {
            pageSize = 20L;
        }
        if (pageSize <= 0 || pageSize > 100) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "page size must > 0 and <= 100");
        }
        if (page == null) {
            page = 0L;
        }
        if (page < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "page must > 0");
        }
        offset = page * pageSize;
        if (id != null) {
            channelId = null;
        } else {
            if (channelId == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Either message id or channel id must be specified");
            }
            if (channelId != null) {
                var channel = channelMapper.findById(channelId);
                if (channel == null) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "invalid channel id: " + channelId);
                }
            }
            after = parseTime(afterTime, "afterTime");
            before = parseTime(beforeTime, "beforeTime");
            notAfter = parseTime(notAfterTime, "notAfterTime");
            notBefore = parseTime(notBeforeTime, "notBeforeTime");
        }
        var messages = messageMapper.filterMessages(
                id,
                channelId,
                after,
                before,
                notAfter,
                notBefore,
                isDesc,
                offset,
                pageSize
        );
        return new GetMessageResponse(messages);
    }

    private Instant parseTime(String timeText, String name) {
        if (timeText == null) {
            return null;
        }
        var desc = "It must be unix timestamp in milliseconds or ISO format such as 2007-12-03T10:15:30.00Z";
        try {
            var timestampMilli = Long.parseLong(timeText);
            return Instant.ofEpochMilli(timestampMilli);
        } catch (NumberFormatException e) {}
        catch (DateTimeException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, name + " value is out of range. " + desc, e);
        }

        try {
            return Instant.parse(timeText);
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, name + " format is incorrect (" + timeText + "). " + desc, e);
        }
    }


}
