package au.edu.sydney.comp5703.cs30.chat;

import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.mapper.ChanelMapper;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

@SpringBootTest
@RunWith(SpringRunner.class)

public class ChannelMapperTest {
    @Autowired
    private ChanelMapper chanelMapper;

    @Test
    private void insertChannel(){
        Channel chanel = new Channel("capstone");
        chanelMapper.insert(chanel);
    }
}
