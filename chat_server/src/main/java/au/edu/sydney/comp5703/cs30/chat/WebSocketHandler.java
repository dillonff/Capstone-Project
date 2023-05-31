package au.edu.sydney.comp5703.cs30.chat;


import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.entity.ClientSession;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.mapper.ChannelMemberMapper;
import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import au.edu.sydney.comp5703.cs30.chat.model.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

@Component
public class WebSocketHandler extends TextWebSocketHandler {

    public WebSocketHandler(ChannelMemberMapper channelMemberMapper, UserMapper userMapper) {
        this.channelMemberMapper = channelMemberMapper;
        this.userMapper = userMapper;
    }

    private ChannelMemberMapper channelMemberMapper;

    private UserMapper userMapper;

    private static ObjectMapper om = new ObjectMapper();
    @Override
    protected void handleTextMessage(WebSocketSession wssession, TextMessage message) throws Exception {
        System.out.println("new ws message");
        var payload = message.getPayload();
        // construct a json tree of the request payload
        var treeNode = om.readTree(payload);
        // get the request type
        var typeNode = treeNode.get("type");
        var type = typeNode.asText();
        // get the args node
        var argsNode = treeNode.get("args");
        System.err.println("request type arrived: " + type);
        switch (type) {
            case "auth":
                var authRequest = om.treeToValue(argsNode, AuthRequest.class);
                handleAuthRequest(wssession, authRequest);
                break;
            default:
                System.err.println("Unknown type: " + type);
                break;
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
        ClientSession.remove(session.getId());
    }

    private ObjectNode makeSuccessfulServerResponseCommon(String request) throws JsonProcessingException {
        var data = om.createObjectNode();
        data.put("type", "res");
        data.put("request", request);
        data.put("success", true);
        return data;
    }

    private String makeSuccessfulServerResponse(String request, ObjectNode result) throws JsonProcessingException {
        var data = makeSuccessfulServerResponseCommon(request);
        if (result != null) {
            data.set("result", result);
        }
        return om.writeValueAsString(data);
    }

    private String makeSuccessfulServerResponse(String request, Object result) throws JsonProcessingException {
        var data = makeSuccessfulServerResponseCommon(request);
        if (result != null) {
            var resNode = om.valueToTree(result);
            data.set("result", resNode);
        }
        return om.writeValueAsString(data);
    }

    private String makeFailureServerResponse(String request, String message) throws JsonProcessingException {
        var data = om.createObjectNode();
        data.put("type", "res");
        data.put("request", request);
        data.put("success", false);
        data.put("message", message);
        return om.writeValueAsString(data);
    }

    private String makeServerPush(String type, Object data) throws JsonProcessingException {
        var objNode = om.createObjectNode();
        objNode.put("type", type);
        var dataNode = om.valueToTree((data));
        objNode.set("data", dataNode);
        return om.writeValueAsString(objNode);
    }

    private void sendOneMessage(WebSocketSession wssession, String payload) throws Exception {
        wssession.sendMessage(new TextMessage(payload));
    }

    private void broadcastMessagesToChannel(String payload, Channel channel) throws Exception {
        var members = channelMemberMapper.getChannelMembers(channel.getId(), null);
        for (var m : members) {
            var user = userMapper.findById(m.getUserId());
            var sessions = ClientSession.getByUserId(user.getId());
            for(var session : sessions) {
                try {
                    sendOneMessage(session.getWssession(), payload);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }


    private void handleAuthRequest(WebSocketSession wssession, AuthRequest ar) throws Exception {
        // workaround for the temporary authentication
        var user = userMapper.findByUsername(ar.getUserName());
        if (user == null) {
            user = new User(ar.getUserName());
            userMapper.insertUser(user);
            wssession.close();
            throw new RuntimeException("user not authenticated");
        }
        // add the user to general channel
        // Channel.general.getParticipants().add(user);
        // create a client session for newly connected client
        var clientSession = new ClientSession(wssession, user);
        ClientSession.put(wssession.getId(), clientSession);
        // construct a result for auth type
        var result = new AuthResponse(clientSession.getUser().getId(), wssession.getId());
        // build and send the json string as response
        var resp = makeSuccessfulServerResponse("auth", result);
        sendOneMessage(wssession, resp);
    }

}
