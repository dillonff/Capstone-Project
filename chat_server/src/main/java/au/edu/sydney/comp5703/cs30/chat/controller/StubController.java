package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class StubController {
    @Autowired
    private ChannelMapper channelMapper;
    @Autowired
    private ChannelMemberMapper channelMemberMapper;
    @Autowired
    private MessageMapper messageMapper;
    @Autowired
    private UserMapper userMapper;
    @Autowired
    private WorkspaceMapper workspaceMapper;


    // controller for manual testing only
    @RequestMapping(value = "/stub1", method = RequestMethod.GET)
    public void handleStub() {
//        var user = new User("test" + System.currentTimeMillis());
//        var res = userMapper.insertUser(user);
//
//        System.err.println("user id: " + user.getId());
        var ids = Repo.workspaceMapper.getMemberIds(10);
        System.err.println(ids);

        var ms = Repo.channelMemberMapper.getChannelMembers(12);
        System.err.println(ms);
    }
}
