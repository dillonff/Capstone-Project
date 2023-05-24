package au.edu.sydney.comp5703.cs30.chat.mapper;

import au.edu.sydney.comp5703.cs30.chat.entity.Workspace;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface WorkspaceMapper {
    Integer insertWorkspace(Workspace workspace);

    Workspace findById(long id);

    List<Workspace> findByMemberId(long memberId);

    Integer addMember(@Param("workspaceId") long workspaceId, @Param("userId") long userId);

    List<Long> getMemberIds(long workspaceId);

    Workspace findByName(String name);

    boolean isMember(long workspaceId, long userId);
}
