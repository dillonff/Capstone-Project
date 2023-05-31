package au.edu.sydney.comp5703.cs30.chat.mapper;

import au.edu.sydney.comp5703.cs30.chat.entity.Organization;
import au.edu.sydney.comp5703.cs30.chat.entity.OrganizationMember;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface OrganizationMapper {
    Integer insertOrganization(Organization organization);
    Organization findById(Long id);
    Integer addMember(OrganizationMember member);
    List<Organization> findByUserId(Long userId);
    Organization findByEmail(String email);
    List<Long> findIdByChannelId(Long channelId);
}
