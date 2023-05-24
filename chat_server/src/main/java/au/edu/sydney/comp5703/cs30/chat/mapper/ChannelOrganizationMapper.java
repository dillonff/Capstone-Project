package au.edu.sydney.comp5703.cs30.chat.mapper;

import au.edu.sydney.comp5703.cs30.chat.entity.ChannelOrganization;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ChannelOrganizationMapper {
    Integer insert(ChannelOrganization channelOrganization);
}
