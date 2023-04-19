package au.edu.sydney.comp5703.cs30.chat;

import au.edu.sydney.comp5703.cs30.chat.entity.Workspace;
import au.edu.sydney.comp5703.cs30.chat.mapper.WorkspaceMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class WorkspaceMapperTest {
    @Autowired
    private WorkspaceMapper workspaceMapper;

    @Test
    public void insertWorkspace(){
        Workspace workspace = new Workspace("#123");
        workspaceMapper.insertWorkspace(workspace);
    }

}
