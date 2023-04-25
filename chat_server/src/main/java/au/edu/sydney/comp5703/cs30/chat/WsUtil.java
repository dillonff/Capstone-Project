package au.edu.sydney.comp5703.cs30.chat;

import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.entity.ClientSession;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;


public class WsUtil {
    private static final ObjectMapper om = new ObjectMapper();

    public static String makeServerPush(String type, Object data) throws JsonProcessingException {
        var objNode = om.createObjectNode();
        objNode.put("type", type);
        var dataNode = om.valueToTree((data));
        objNode.set("data", dataNode);
        return om.writeValueAsString(objNode);
    }

    public static void sendOneMessage(WebSocketSession wssession, String payload) throws Exception {
        wssession.sendMessage(new TextMessage(payload));
    }

    public static void broadcastMessagesToChannel(String payload, Channel channel) throws Exception {
        var members = Repo.channelMemberMapper.getChannelMembers(channel.getId());
        for (var m : members) {
            if (m.getChannelId() != channel.getId())
                continue;
            var sessions = ClientSession.getByUserId(m.getUserId());
            for(var session : sessions) {
                try {
                    sendOneMessage(session.getWssession(), payload);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public static void broadcastMessages(String payload) throws Exception {
        var sessions = ClientSession.getAll();
        for(var session : sessions) {
            try {
                sendOneMessage(session.getWssession(), payload);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
