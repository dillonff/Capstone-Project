package au.edu.sydney.comp5703.cs30.chat.service;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.dao.UserDao;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import org.springframework.stereotype.Service;

@Service
public class UserService {


    private final UserDao userDao;

    public UserService(UserDao userDao) {
        this.userDao = userDao;
    }

    public User getUser(long userId) {
        return Repo.userMap.get(userId);
        // return userDao.getUserById(userId);
    }

}