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
//        User user = new User("Yuzhe", "");
//        user.setId(6);
//        user.setPassword("wyz123456");
//        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(16);
//        String hashedPass = encoder.encode(user.getPassword());
//        System.out.println(hashedPass);
//        user.setPassword(hashedPass);
//        userMapper.insertUser(user);
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
            User user = new User("MWYZ", "nsmyibc", "1785880", "merritt@gmail.com", "MWYZ");
            iUserService.reg(user.getUsername(), user.getPassword(), user.getPhone(), user.getEmail(), "MWYZ");
            System.out.println("Successfully registered！");
        } catch (ServiceException e) {
            System.out.println("Register fail！" + e.getClass().getSimpleName());
            System.out.println(e.getMessage());
        }
    }

    @Test
    public void updateInfoByUid(){
        long id = 3;
        String username = "merr";
        String phone = "223311";
        String email = "1234@123.com";
        String displayName = "Merr";
        iUserService.updateInfoByUid(id, username, phone, email, displayName);
    }

    @Test
    public void changePassword(){
        Integer id = 8;
        String username = "MWYZ";
        String oldPassword = "nsmyibc";
        String newPassword = "654321";
        iUserService.changePassword(id, username, oldPassword, newPassword);
    }


}
