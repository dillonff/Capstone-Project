package au.edu.sydney.comp5703.cs30.chat.mapper;

import au.edu.sydney.comp5703.cs30.chat.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface UserMapper {
    Integer insertUser(User user);
    User findByUid(long id);
    User findByName(String username);
}
