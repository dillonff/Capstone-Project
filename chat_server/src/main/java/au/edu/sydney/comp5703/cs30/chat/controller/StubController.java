package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.entity.File;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.mapper.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
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

import java.time.Instant;

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

    private static final ObjectMapper om;
    static {
        om = Jackson2ObjectMapperBuilder.json().featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS).build();
    }


    // controller for manual testing only
    @RequestMapping(value = "/stub1", method = RequestMethod.GET)
    public void handleStub() throws JsonProcessingException {
//        var user = new User("test" + System.currentTimeMillis());
//        var res = userMapper.insertUser(user);
//
//        System.err.println("user id: " + user.getId());


        var ms = Repo.channelMemberMapper.getChannelMembers(12, null);
        System.err.println(ms);

        var encoder =  Pbkdf2PasswordEncoder.defaultsForSpringSecurity_v5_8();// Argon2PasswordEncoder.defaultsForSpringSecurity_v5_2(); // PasswordEncoderFactories.createDelegatingPasswordEncoder();
        // encoder = new Argon2PasswordEncoder(16, 32, 1, 65536, 2);
        var enc  = SCryptPasswordEncoder.defaultsForSpringSecurity_v5_8();
        var start = System.currentTimeMillis();
        var res = passwordEncoder.encode("test1");
        var mid = System.currentTimeMillis();
        passwordEncoder.matches("test1", res);
        var end = System.currentTimeMillis();
        System.err.println(res);
        System.err.println("" + (mid - start) + " " + (end - mid));

        // fileMapper.insertFile(new File("name", "path", 12345L, 0L));
        fileMapper.findById(1);
        System.err.println(om.writeValueAsString(Instant.now()));
    }
}
