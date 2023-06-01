package au.edu.sydney.comp5703.cs30.chat.service.impl;

import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import au.edu.sydney.comp5703.cs30.chat.service.IUserService;
import au.edu.sydney.comp5703.cs30.chat.service.exception.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.Objects;

@Service
public class UserServiceImpl implements IUserService {
    private UserMapper userMapper;

    private PasswordEncoder encoder;

    @Autowired
    public UserServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.encoder = passwordEncoder;
    }

    @Override
    public void reg(String username, String password, String phone, String email, String displayName) {

        User result = userMapper.findByUsername(username);
        String hashedPass;

        if (result != null) {

            throw new DuplicateUsernameException("Trying to register username [" + username + "] is already been used");
        }

        User user = new User(username, "", phone, email, displayName);
        hashedPass = encoder.encode(password);
        user.setPassword(hashedPass);

        Integer rows = userMapper.insertUser(user);

        if (rows != 1) {

            throw new InsertException("There is an unknown error.");
        }
    }

    @Override
    public void changePassword(Integer id, String username, String oldPassword, String newPassword) {

        User result = userMapper.findById(id);
        String newHashedPass;

        if (result ==null || result.getIsDeleted() == 1) {
            throw new UsernameErrorException("This user dose not exist.");
        }


        if (!Objects.equals(oldPassword, result.getPassword())) {
            throw new PasswordErrorException("Wrong password.");
        }
//        newHashedPass = encoder.encode(newPassword);
        Integer rows = userMapper.updatePassById(id, newPassword);

        if (rows != 1) {
            throw new UpdateException("Unknown exception for information updating.");
        }
    }

    @Override
    public void updateInfoByUid(Long id, String username, String phone, String email, String displayName) {

        User result = userMapper.findById(id);
        if (result == null || result.getIsDeleted() == 1) {
            throw new UsernameErrorException("user not exists");
        }else
            userMapper.updateInfoById(id, username, phone, email, displayName);

    }
}
