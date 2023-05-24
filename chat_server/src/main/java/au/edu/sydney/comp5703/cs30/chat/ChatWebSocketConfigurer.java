package au.edu.sydney.comp5703.cs30.chat;

import au.edu.sydney.comp5703.cs30.chat.mapper.ChannelMapper;
import au.edu.sydney.comp5703.cs30.chat.mapper.ChannelMemberMapper;
import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class ChatWebSocketConfigurer implements WebSocketConfigurer {
    @Autowired
    private ChannelMemberMapper channelMemberMapper;

    @Autowired
    UserMapper userMapper;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        System.err.println("value: " + channelMemberMapper + userMapper);
        registry.addHandler(new WebSocketHandler(channelMemberMapper, userMapper), "/chat-ws").setAllowedOrigins("*");
    }
}
