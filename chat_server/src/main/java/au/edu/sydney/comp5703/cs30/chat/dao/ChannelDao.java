package au.edu.sydney.comp5703.cs30.chat.dao;

import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface ChannelDao {
    @Select("SELECT * FROM Channel WHERE id = #{channelId}")
    Channel getChannelById(@Param("channelId") long channelId);
}
