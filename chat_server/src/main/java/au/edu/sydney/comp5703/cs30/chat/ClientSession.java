package au.edu.sydney.comp5703.cs30.chat;

import org.springframework.web.socket.WebSocketSession;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class ClientSession {
    public static Map<String, ClientSession> sessionMap = new ConcurrentHashMap<>();

    private String id;
    private WebSocketSession wssession;

    public ClientSession(WebSocketSession session) {
        id = UUID.randomUUID().toString();
        this.wssession = session;
    }

    public String getId() {
        return id;
    }

    public WebSocketSession getWssession() {
        return wssession;
    }
}
