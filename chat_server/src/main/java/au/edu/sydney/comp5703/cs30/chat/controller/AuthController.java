package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.Util;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.entity.Workspace;
import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import au.edu.sydney.comp5703.cs30.chat.mapper.WorkspaceMapper;
import au.edu.sydney.comp5703.cs30.chat.model.AuthRequest;
import au.edu.sydney.comp5703.cs30.chat.model.AuthResponse;
import au.edu.sydney.comp5703.cs30.chat.model.InfoChangedPush;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;

import static au.edu.sydney.comp5703.cs30.chat.WsUtil.broadcastMessages;
import static au.edu.sydney.comp5703.cs30.chat.WsUtil.makeServerPush;

@RestController
public class AuthController {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private WorkspaceMapper workspaceMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @RequestMapping(
            value = "/api/v1/auth", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public AuthResponse handleAuth(@RequestBody AuthRequest req, @CurrentSecurityContext SecurityContext sc) throws Exception {
        if (req.getUserName() == null) {
            throw new ResponseStatusException(400, "No user name specified", null);
        }
        var defaultWorkspace = workspaceMapper.findByName("default");
        if (defaultWorkspace == null) {
            defaultWorkspace = Util.createWorkspace("default");
        }
        // construct a new user
        // workaround for the temporary authentication
        var user = userMapper.findByUsername(req.getUserName());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not found");
//            user = new User(req.getUserName());
//            userMapper.insertUser(user);
//            // add the user to default workspace and general channel
//            Repo.addMemberToWorkspace(defaultWorkspace.getId(), 0, user.getId());
//            var p = makeServerPush("infoChanged", new InfoChangedPush("channel"));
//            broadcastMessages(p);
//            p = makeServerPush("infoChanged", new InfoChangedPush("workspace"));
//            broadcastMessages(p);
        }

        try {
            var match = passwordEncoder.matches(req.getPassword(), user.getPassword());
            if (!match) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Incorrect password");
            }
        } catch (IllegalArgumentException e) {
            System.err.println("Please set a password (again) for " + user.getUsername());
            // throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Incorrect password");
        }

        System.err.println(sc.toString());
        var token = getNewToken(user);
        userMapper.setToken(user.getId(), token);

        // construct a result for auth type
        var result = new AuthResponse(user.getId(), "(none)");
        result.setToken(token);


        var auth = sc.getAuthentication();
        System.err.println(auth.toString());
        System.out.println(auth.getName());
        return result;
    }

    private String getNewToken(User user) {
        var random = new SecureRandom();
        var raw = random.generateSeed(32);
        StringBuilder saltString = new StringBuilder();
        saltString.append(user.getId());
        saltString.append("-");
        for (int i = 0; i < raw.length; i++){
            String hex = Integer.toHexString(0xff & raw[i]);
            if(hex.length() == 1)
            {
                saltString.append('0');
            }
            saltString.append(hex);
        }
        return saltString.toString();
    }
}
