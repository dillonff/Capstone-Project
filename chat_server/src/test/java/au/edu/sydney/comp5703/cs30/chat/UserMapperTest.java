package au.edu.sydney.comp5703.cs30.chat;

import au.edu.sydney.comp5703.cs30.chat.entity.User;


import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import au.edu.sydney.comp5703.cs30.chat.service.IUserService;
import au.edu.sydney.comp5703.cs30.chat.service.ServiceException;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.test.context.junit4.SpringRunner;

import javax.annotation.Resource;
import java.util.Date;

@SpringBootTest
//@RunWith(SpringRunner.class)
//@MapperScan("au.edu.sydney.comp5703.cs30.chat.mapper")
//@AutoConfigureMybatis
public class UserMapperTest {
    //@Resource(name = "userMapper")
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private IUserService iUserService;

    @Test
    public void insert() {
        User user = new User("merritt");
        user.setId(4);
        user.setPassword("wyz123456");
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
        String hashedPass = encoder.encode(user.getPassword());
        System.out.println(hashedPass);
        user.setPassword(hashedPass);
        userMapper.insertUser(user);
    }
    @Test
    public void findByUsername(){
        User user = userMapper.findByUsername("merritt");
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
        System.out.println(encoder.matches("wyz123456", user.getPassword()));
    }

    @Test
    public void reg(){
        try {
            User user = new User("wyz");
            user.setPassword("123456");
            user.setPhone("1785880");
            user.setEmail("merritt@gmail.com");
            iUserService.reg(user.getUsername(), user.getPassword());
            System.out.println("Successfully registered！");
        } catch (ServiceException e) {
            System.out.println("Register fail！" + e.getClass().getSimpleName());
            System.out.println(e.getMessage());
        }
    }

    @Test
    public void updateInofByUid(){
        int id = 4;
        String username = "abc";
        String phone = "223311";
        String email = "1234@123.com";
        iUserService.updateInfoByUid(username, phone, email, id);
    }


}
