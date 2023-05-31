package au.edu.sydney.comp5703.cs30.chat.mapper;

import au.edu.sydney.comp5703.cs30.chat.entity.WorkspaceOrganization;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WorkspaceOrganizationMapper {
    Integer insert(WorkspaceOrganization workspaceOrganization);

    List<WorkspaceOrganization> filter(Long organizationId, Long workspaceId);

}
