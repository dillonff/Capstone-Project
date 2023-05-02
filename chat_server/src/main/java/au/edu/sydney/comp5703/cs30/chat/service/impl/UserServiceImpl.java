package au.edu.sydney.comp5703.cs30.chat.service.impl;

import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import au.edu.sydney.comp5703.cs30.chat.service.IUserService;
import au.edu.sydney.comp5703.cs30.chat.service.exception.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Date;

public class UserServiceImpl implements IUserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public void reg(String username, String password) {

        User result = userMapper.findByUsername(username);

        if (result != null) {

            throw new DuplicateUsernameException("Trying to register username [" + username + "] is already been used");
        }

        User user = new User(username);
        user.setPassword(password);

        Integer rows = userMapper.insertUser(user);

        if (rows != 1) {

            throw new InsertException("There is an unknown error.");
        }
    }

    @Override
    public void changePassword(Integer id, String username, String oldPassword, String newPassword) {

        User result = userMapper.findById(id);

        if (result ==null || result.getIsDeleted() == 1) {
            throw new UsernameErrorException("This user dose not exist.");
        }


        if (!result.getPassword().equals(oldPassword)) {
            throw new PasswordErrorException("Wrong password.");
        }

        Integer rows = userMapper.updatePassById(id, newPassword);

        if (rows != 1) {
            throw new UpdateException("Unknown exception for information updating.");
        }
    }

    @Override
    public void updateInfoByUid(String username, String phone, String email, Integer id) {

        User result = userMapper.findById(id);
        if (result == null || result.getIsDeleted() == 1) {
            throw new UsernameErrorException("user not exists");
        }else
            userMapper.updateInfoById(username, phone, email, id);

    }
}
