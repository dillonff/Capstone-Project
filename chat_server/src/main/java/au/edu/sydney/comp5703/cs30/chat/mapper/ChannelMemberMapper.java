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
            @Result(property = "pinned", column = "is_pinned"),
            @Result(property = "deleted", column = "is_deleted")
    })
    @ConstructorArgs(value = {
            @Arg(column = "channel_id", javaType = long.class),
            @Arg(column = "user_id", javaType = long.class)
    })
    @Select("select id, channel_id, user_id, last_read_message_id, is_mentioned, is_pinned, is_deleted from chat_channel_member where channel_id = #{channelId} and not is_deleted")
    List<ChannelMember> getChannelMembers(@Param("channelId") long channelId);

    @Insert("insert into chat_channel_member (channel_id, user_id, last_read_message_id, is_mentioned) values (#{channelId}, #{userId}, #{lastReadMessageId}, #{mentioned})")
    Integer insertChannelMember(ChannelMember member);

    @Select("select id, 'aaaa' as avoid_bad_constructor, channel_id, user_id, last_read_message_id, is_mentioned, is_pinned, is_deleted from chat_channel_member where channel_id = #{channelId} and user_id = #{userId} and not is_deleted limit 1")
    @ResultMap("channelMemberMap")
    ChannelMember findByUserAndChannelId(Long userId, Long channelId);

    @Update("update chat_channel_member set is_pinned = #{pinned} where id = #{channelMemberId}")
    Integer setPinned(long channelMemberId, boolean pinned);

    @Select("SELECT id FROM chat_message WHERE channelId = #{channelId} AND senderId != #{userId} AND timeCreated = (SELECT MAX(timeCreated) FROM chat_message WHERE channelId = #{channelId} AND senderId != #{userId})")
    Long getLastMessageIdByChannelId(@Param("channelId") Long channelId, @Param("userId") Long userId);

    @Update("update chat_channel_member set last_read_message_id = #{messageId} where id = #{channelMemberId}")
    Long setLastReadMessageId(long messageId, long channelMemberId);

}
