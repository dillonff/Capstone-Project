package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.model.GetUserResponse;
import au.edu.sydney.comp5703.cs30.chat.service.IUserService;
import au.edu.sydney.comp5703.cs30.chat.util.JsonResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpSession;

@RestController
public class UserController extends BaseController {

    // @Autowired
    private IUserService iUserService = null;

    @RequestMapping(value = "/api/v1/users/{userId}", produces = "application/json", method = RequestMethod.GET)
    public User handleGetUser(@PathVariable long userId) {
        User user = Repo.userMap.get(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }
        return user;
        // return new GetUserResponse(user.getId(), user.getName(), user.getName());
    }

    @RequestMapping("reg")
    public JsonResult<Void> reg(String username, String password) {

        iUserService.reg(username, password);

        return new JsonResult<Void>(OK);
    }

    @RequestMapping("change_password")
    public JsonResult<Void> changePassword(String oldPassword,
                                           String newPassword,
                                           HttpSession session) {
        Integer uid = getUidFromSession(session);
        String username = getUsernameFromSession(session);
        iUserService.changePassword(uid,username,oldPassword,newPassword);
        return new JsonResult<>(OK);
    }

    @RequestMapping("change_info")
    public JsonResult<User> updateInfo(String username, String phone, String email, HttpSession session) {
        iUserService.updateInfoByUid(username, phone, email, getUidFromSession(session));
        return new JsonResult<User>(OK);
    }

}
