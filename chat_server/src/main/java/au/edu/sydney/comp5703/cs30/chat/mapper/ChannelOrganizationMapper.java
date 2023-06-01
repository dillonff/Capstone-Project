package au.edu.sydney.comp5703.cs30.chat.mapper;

import au.edu.sydney.comp5703.cs30.chat.entity.ChannelOrganization;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface ChannelOrganizationMapper {
    Integer insert(ChannelOrganization channelOrganization);

    List<ChannelOrganization> findByChannelId(Long channelId);

    boolean isMember(Long channelId, Long organizationId);
}
