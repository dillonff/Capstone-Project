package au.edu.sydney.comp5703.cs30.chat.mapper;

import au.edu.sydney.comp5703.cs30.chat.entity.WorkspaceMember;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface WorkspaceMemberMapper {
    Integer insert(WorkspaceMember wm);

    WorkspaceMember findById(Long id);

    List<WorkspaceMember> findByType(int type, Long memberId);

    List<WorkspaceMember> findByWorkspace(Long workspaceId);

    boolean isMember(Long workspaceId, int type, Long memberId);
}
