package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.entity.Channel;
import au.edu.sydney.comp5703.cs30.chat.entity.ClientSession;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.model.AuthRequest;
import au.edu.sydney.comp5703.cs30.chat.model.AuthResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.core.annotation.CurrentSecurityContext;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    @RequestMapping(
            value = "/api/v1/auth", consumes = "application/json", produces = "application/json", method = RequestMethod.POST
    )
    public AuthResponse handleAuth(@RequestBody AuthRequest req, @CurrentSecurityContext SecurityContext sc, HttpSession ses) {
        // construct a new user
        User user = null;
        // workaround for the temporary authentication
        for (var tmp : User.userMap.values()) {
            if (tmp.getName().equals(req.getUserName())) {
                user = tmp;
            }
        }
        if (user == null) {
            user = new User(req.getUserName());
        }
        User.userMap.put(user.getId(), user);
        // add the user to general channel
        Channel.general.getParticipants().add(user);
        System.err.println(sc.toString());

        // please note: this is a workaround to know who is using the chat by recording the user object in the session
        ses.setAttribute("user", user);

        // construct a result for auth type
        var result = new AuthResponse(user.getId(), ses.getId());

        var auth = sc.getAuthentication();
        System.out.println(ses.toString());
        System.err.println(auth.toString());
        System.out.println(auth.getName());
        return result;
    }
}
