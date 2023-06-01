package au.edu.sydney.comp5703.cs30.chat.service;

import au.edu.sydney.comp5703.cs30.chat.entity.User;

public interface IUserService {
    void reg(String username, String password, String phone, String email, String displayName);

    void changePassword(Integer id,
                        String username,
                        String oldPassword,
                        String newPassword);

    void updateInfoByUid(Long id,
                         String username,
                         String phone,
                         String email,
                         String displayName);

}
