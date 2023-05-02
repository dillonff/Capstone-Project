package au.edu.sydney.comp5703.cs30.chat.service;

import au.edu.sydney.comp5703.cs30.chat.entity.User;

public interface IUserService {
    void reg(String username,
             String password);

    void changePassword(Integer uid,
                        String username,
                        String oldPassword,
                        String newPassword);

    void updateInfoByUid(String username,
                         String phone,
                         String email,
                         Integer id);

}
