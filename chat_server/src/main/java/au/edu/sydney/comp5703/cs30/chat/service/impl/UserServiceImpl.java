package au.edu.sydney.comp5703.cs30.chat.service.impl;

import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import au.edu.sydney.comp5703.cs30.chat.service.IUserService;
import au.edu.sydney.comp5703.cs30.chat.service.exception.DuplicateUsernameException;
import au.edu.sydney.comp5703.cs30.chat.service.exception.InsertException;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;

public class UserServiceImpl implements IUserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public void reg(User user) {
        String username = user.getUsername();

        User result = userMapper.findByUsername(username);

        if (result != null) {

            throw new DuplicateUsernameException("尝试注册的用户名[" + username + "]已经被占用");
        }

        Integer rows = userMapper.insertUser(user);

        if (rows != 1) {

            throw new InsertException("添加用户数据出现未知错误，请联系系统管理员");
        }
    }
}
