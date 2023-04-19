package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.model.GetUserResponse;
import au.edu.sydney.comp5703.cs30.chat.service.IUserService;
import au.edu.sydney.comp5703.cs30.chat.service.UserService;
import au.edu.sydney.comp5703.cs30.chat.util.JsonResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
public class UserController extends BaseController {

    private UserService userService;
    @Autowired
    private IUserService iUserService;

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

    @RequestMapping("reg")
    public JsonResult<Void> reg(User user) {

        iUserService.reg(user);

        return new JsonResult<Void>(OK);
    }

}
