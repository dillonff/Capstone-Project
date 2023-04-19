package au.edu.sydney.comp5703.cs30.chat;

import au.edu.sydney.comp5703.cs30.chat.entity.User;


import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.util.Date;

@SpringBootTest
//@RunWith(SpringRunner.class)
//@MapperScan("au.edu.sydney.comp5703.cs30.chat.mapper")
//@AutoConfigureMybatis
public class UserMapperTest {
    @Resource(name = "userMapper")
    private UserMapper userMapper;

    @Test
    public void insert() {
        User user = new User("Merritt");
        userMapper.insert(user);
    }

}
