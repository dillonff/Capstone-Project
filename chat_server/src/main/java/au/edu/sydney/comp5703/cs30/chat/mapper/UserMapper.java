package au.edu.sydney.comp5703.cs30.chat.mapper;

import au.edu.sydney.comp5703.cs30.chat.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface UserMapper {
    Integer insertUser(User user);
    User findById(long id);
    User findByUsername(String username);

    Integer updatePassById(Integer id,
                           String password);

    Integer updateInfoById(String username, String phone, String email, Integer id);

    // There was no unique index on the email field
    // check if there are duplicate emails
    List<User> findByEmail(String email);

    List<User> filter(Long workspaceId, Long channelId, Long organizationId);

    Integer setToken(Long userId, String token);

    User findByToken(String token);

}
