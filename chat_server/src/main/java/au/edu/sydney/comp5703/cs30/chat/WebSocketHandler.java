package au.edu.sydney.comp5703.cs30.chat;


import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.entity.ClientSession;
import au.edu.sydney.comp5703.cs30.chat.entity.Message;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.model.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.HashMap;


public class WebSocketHandler extends TextWebSocketHandler {

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
            case "sendMessage":
                var sendMessageRequest = om.treeToValue(argsNode, SendMessageRequest.class);
                handleSendMessageRequest(wssession, sendMessageRequest);
                break;
            case "getMessages":
                // TODO
                break;
            case "createChannel":
                break;
            case "joinChannel":
                break;
            case "getChannels":
                // TODO
                break;
            case "getUserInfo":
                // TODO
                break;
            case "getChannelInfo":
                // TODO
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

    private String makeSuccessfulServerResponse(String request, Object result) throws JsonProcessingException {
        var data = om.createObjectNode();
        data.put("type", "res");
        data.put("request", request);
        data.put("success", true);
        var resNode = om.valueToTree(result);
        data.set("result", resNode);
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
        for (var user : channel.getParticipants()) {
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
        // construct a new user
        var user = new User(ar.getUserName());
        User.userMap.put(user.getId(), user);
        // add the user to general channel
        Channel.general.getParticipants().add(user);
        // create a client session for newly connected client
        var clientSession = new ClientSession(wssession, user);
        ClientSession.put(wssession.getId(), clientSession);
        // construct a result for auth type
        var result = new AuthResponse(clientSession.getUser().getId(), wssession.getId());
        // build and send the json string as response
        var resp = makeSuccessfulServerResponse("auth", result);
        sendOneMessage(wssession, resp);
    }

    private void handleSendMessageRequest(WebSocketSession wssession, SendMessageRequest smr) throws Exception {
        // for existing client, first figure out the clientSession that was created in auth
        var clientSession = ClientSession.getByWsId(wssession.getId());
        // then figure out the channel by id
        var channelId = smr.getChannel();
        var channel = Channel.channelMap.get(channelId);
        // save the message to the memory
        var message = new Message(smr.getContent(), channel, clientSession.getUser());
        Message.messageMap.put(message.getId(), message);

        // build and send the response
        var result = new SendMessageResponse(message.getId());
        var respPayload = makeSuccessfulServerResponse("sendMessage", result);
        sendOneMessage(wssession, respPayload);

        // send a new message push to all members in the channel
        var msg = new NewMessagePush(message.getId(), message.getContent(), message.getSender().getId());
        var bcastPayload = makeServerPush("newMessage", msg);
        broadcastMessagesToChannel(bcastPayload, channel);
    }
}
