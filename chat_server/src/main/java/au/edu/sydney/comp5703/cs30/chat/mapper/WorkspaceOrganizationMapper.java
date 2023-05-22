package au.edu.sydney.comp5703.cs30.chat.mapper;

import au.edu.sydney.comp5703.cs30.chat.entity.WorkspaceOrganization;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface WorkspaceOrganizationMapper {
    Integer insert(WorkspaceOrganization workspaceOrganization);

}
