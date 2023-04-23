package au.edu.sydney.comp5703.cs30.chat;

import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.mapper.ChannelMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@SpringBootTest
@RunWith(SpringRunner.class)

public class ChannelMapperTest {
    @Autowired
    private ChannelMapper channelMapper;

    @Test
    public void insertChannel(){
        Channel channel = new Channel("capstone 2");
        channel.setId(3);
        channelMapper.insertChannel(channel);
    }
}
