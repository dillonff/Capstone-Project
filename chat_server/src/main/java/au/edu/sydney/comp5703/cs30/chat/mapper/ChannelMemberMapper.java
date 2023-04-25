package au.edu.sydney.comp5703.cs30.chat.mapper;

import au.edu.sydney.comp5703.cs30.chat.entity.ChannelMember;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ChannelMemberMapper {
    @Results(id = "channelMemberMap", value = {
            @Result(property = "id", column = "id"),
            @Result(property = "channelId", column = "channel_id"),
            @Result(property = "userId", column = "user_id"),
            @Result(property = "lastReadMessageId", column = "last_read_message_id"),
            @Result(property = "mentioned", column = "is_mentioned"),
            @Result(property = "deleted", column = "is_deleted")
    })
    @ConstructorArgs(value = {
            @Arg(column = "channel_id"),
            @Arg(column = "user_id")
    })
    @Select("select id, channel_id, user_id, last_read_message_id, is_mentioned, is_deleted from chat_channel_member where channel_id = #{channelId} and not is_deleted")
    List<ChannelMember> getChannelMembers(@Param(" channelId") long channelId);

    @Insert("insert into chat_channel_member (channel_id, user_id, last_read_message_id, is_mentioned) values (#{channelId}, #{userId}, #{lastReadMessageId}, #{mentioned})")
    Integer insertChannelMember(ChannelMember member);
}
