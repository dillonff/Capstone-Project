package au.edu.sydney.comp5703.cs30.chat.mapper;

import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ChannelMapper {
    Integer insertChannel(Channel channel);

    Channel findById(@Param("id") long id);

    List<Channel> findByWorkspaceAndName(long workspaceId, String name);

    List<Channel> findPublicByWorkspaceId(long workspaceId);

    List<Channel> findPrivateByWorkspaceAndMember(long workspaceId, long userId);

    List<Channel> findDirectMessageChannels(long workspaceId, int type, long memberId);

    // only some props can be updated, see mapper file
    Integer updateChannel(Channel channel);
}
