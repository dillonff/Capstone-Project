package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.entity.User;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

public class ControllerHelper {
    public static User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            var p = auth.getPrincipal();
            if (p instanceof User) {
                return (User) p;
            }
        }
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authorized");
    }
}
