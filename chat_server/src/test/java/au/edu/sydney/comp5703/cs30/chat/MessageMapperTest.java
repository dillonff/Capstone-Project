package au.edu.sydney.comp5703.cs30.chat;

import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.entity.Message;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.mapper.MessageMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class MessageMapperTest {
    @Autowired
    MessageMapper messageMapper;
/***
    @Test
    public void insertMessage(){
        Message message = new Message("how about that.", new Channel("capstone 1"), new User("bob"));
        message.setId(1);
        messageMapper.insertMessage(message);

    }
    ***/
}
