package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.entity.File;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.mapper.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
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
    @Autowired
    private FileMapper fileMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;


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

        var encoder =  Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8();// Argon2PasswordEncoder.defaultsForSpringSecurity_v5_2(); // PasswordEncoderFactories.createDelegatingPasswordEncoder();
        // encoder = new Argon2PasswordEncoder(16, 32, 1, 65536, 2);
        var enc  = SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8();
        var start = System.currentTimeMillis();
        var res = passwordEncoder.encode("123456789");
        var mid = System.currentTimeMillis();
        passwordEncoder.matches("123456789", res);
        var end = System.currentTimeMillis();
        System.err.println(res);
        System.err.println("" + (mid - start) + " " + (end - mid));

        // fileMapper.insertFile(new File("name", "path", 12345L, 0L));
        fileMapper.findById(1);
    }
}
