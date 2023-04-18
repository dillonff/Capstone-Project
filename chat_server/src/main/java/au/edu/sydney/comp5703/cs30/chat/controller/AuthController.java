package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.entity.Workspace;
import au.edu.sydney.comp5703.cs30.chat.model.AuthRequest;
import au.edu.sydney.comp5703.cs30.chat.model.AuthResponse;
import au.edu.sydney.comp5703.cs30.chat.model.InfoChangedPush;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import static au.edu.sydney.comp5703.cs30.chat.WsUtil.broadcastMessages;
import static au.edu.sydney.comp5703.cs30.chat.WsUtil.makeServerPush;

@RestController
public class AuthController {

    @RequestMapping(
            value = "/api/v1/auth", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public AuthResponse handleAuth(@RequestBody AuthRequest req, @CurrentSecurityContext SecurityContext sc) throws Exception {
        if (req.getUserName() == null) {
            throw new ResponseStatusException(400, "No user name specified", null);
        }
        // construct a new user
        User user = null;
        // workaround for the temporary authentication
        for (var tmp : Repo.userMap.values()) {
            if (tmp.getName().equals(req.getUserName())) {
                user = tmp;
            }
        }
        if (user == null) {
            user = new User(req.getUserName());
            Repo.userMap.put(user.getId(), user);
            // add the user to default workspace and general channel
            Repo.addMemberToWorkspace(Workspace.def.getId(), user.getId());


            var p = makeServerPush("infoChanged", new InfoChangedPush("channel"));
            broadcastMessages(p);
            p = makeServerPush("infoChanged", new InfoChangedPush("workspace"));
            broadcastMessages(p);
        }
        System.err.println(sc.toString());

        // construct a result for auth type
        var result = new AuthResponse(user.getId(), "(none)");

        var auth = sc.getAuthentication();
        System.err.println(auth.toString());
        System.out.println(auth.getName());
        return result;
    }
}
