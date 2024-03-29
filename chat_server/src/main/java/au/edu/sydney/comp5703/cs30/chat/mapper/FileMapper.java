package au.edu.sydney.comp5703.cs30.chat.mapper;

import au.edu.sydney.comp5703.cs30.chat.entity.ChannelMember;
import au.edu.sydney.comp5703.cs30.chat.entity.File;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Mapper
@Repository
public interface FileMapper {
    File findById(long id);
    @MapKey("id")
    List<Map<String,Object>> findByIdList(File file);
    Integer insertFile(File file);

    Integer updateFile(File file);

    List<File> filter(Long workspaceId, Long channelId, Long messageId, Long userId);

    Integer addUsage(Integer usageType, Long usageId, Long fileId);
}
