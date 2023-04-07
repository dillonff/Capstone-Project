package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.model.GetUserResponse;
import au.edu.sydney.comp5703.cs30.chat.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class UserController {

    private UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @RequestMapping(value = "/api/v1/users/{userId}", produces = "application/json", method = RequestMethod.GET)
    public GetUserResponse handleGetUser(@PathVariable long userId) {
        User user = userService.getUser(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }
        return new GetUserResponse(user.getId(), user.getName(), user.getName());
    }

}
