package au.edu.sydney.comp5703.cs30.chat.entity;

import org.springframework.web.socket.WebSocketSession;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class ClientSession {
    private static Map<String, ClientSession> sessionMap = new ConcurrentHashMap<>();
    private static Map<Long, List<ClientSession>> userMap = new ConcurrentHashMap<>();

    public static void put(String wsid, ClientSession session) {
        sessionMap.put(wsid, session);
        var id = session.getUser().getId();
        var sessions = userMap.getOrDefault(id, null);
        if (sessions == null) {
            sessions = new ArrayList<>();
            userMap.put(id, sessions);
        }
        sessions.add(session);
    }

    public static ClientSession getByWsId(String wsid) {
        return sessionMap.get(wsid);
    }

    public static List<ClientSession> getByUserId(Long id) {
        return userMap.get(id);
    }

    public static Collection<ClientSession> getAll() {
        return sessionMap.values();
    }

    public static void remove(String wsid) {
        var session = sessionMap.remove(wsid);
        if (session == null)
            return;
        var uid = session.getUser().getId();
        var sessions = userMap.get(uid);
        sessions.removeIf(s -> s.getWssession().equals(session.getWssession()));
    }

    private User user;
    private WebSocketSession wssession;

    public ClientSession(WebSocketSession session, User user) {
        this.wssession = session;
        this.user = user;
    }

    public WebSocketSession getWssession() {
        return wssession;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public void setWssession(WebSocketSession wssession) {
        this.wssession = wssession;
    }
}
