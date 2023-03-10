package au.edu.sydney.comp5703.cs30.chat;


import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.BinaryMessage;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.BinaryWebSocketHandler;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import static au.edu.sydney.comp5703.cs30.chat.ClientSession.sessionMap;

public class WebSocketHandler extends TextWebSocketHandler {
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("new ws message");
        var payload = message.getPayload();
        var om = new ObjectMapper();
        var treeNode = om.readTree(payload);
        var cmdNode = treeNode.get("cmd");
        var cmd = cmdNode.asText();
        System.err.println("cmd arrived: " + cmd);
        switch (cmd) {
            case "auth":
                handleAuthRequest(session);
                break;
            case "sendMessage":
                var sendMessageRequest = om.treeToValue(treeNode, SendMessageRequest.class);
                handleSendMessageRequest(session, sendMessageRequest);
                break;
            default:
                System.err.println("Unknown cmd: " + cmd);
                break;
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        super.afterConnectionClosed(session, status);
        sessionMap.remove(session.getId());
    }

    private void sendOneMessage(WebSocketSession wssession, String payload) throws Exception {
        wssession.sendMessage(new TextMessage(payload));
    }

    private void broadcastMessages(String payload) throws Exception {
        for (var clientSession : sessionMap.values()) {
            try {
                sendOneMessage(clientSession.getWssession(), payload);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void handleAuthRequest(WebSocketSession wssession) throws Exception {
        var clientSession = new ClientSession(wssession);
        sessionMap.put(wssession.getId(), clientSession);
        var resp = new AuthResponse();
        var om = new ObjectMapper();
        var payload = om.writeValueAsString(resp);
        sendOneMessage(wssession, payload);
    }

    private void handleSendMessageRequest(WebSocketSession wssession, SendMessageRequest smr) throws Exception {
        var clientSession = sessionMap.get(wssession.getId());
        var om = new ObjectMapper();
        var msg = new NewMessagePush(smr.getMessage(), clientSession.getId());
        var respPayload = om.writeValueAsString(new SendMessageResponse());
        sendOneMessage(wssession, respPayload);
        var bcastPayload = om.writeValueAsString(msg);
        broadcastMessages(bcastPayload);
    }
}
