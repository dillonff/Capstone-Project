package au.edu.sydney.comp5703.cs30.chat.dao;

import au.edu.sydney.comp5703.cs30.chat.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserDao {
    @Select("SELECT * FROM User WHERE id = #{userId}")
    User getUserById(@Param("userId") long userId);
}