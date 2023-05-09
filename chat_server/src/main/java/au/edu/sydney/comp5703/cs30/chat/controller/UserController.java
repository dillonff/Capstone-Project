package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import au.edu.sydney.comp5703.cs30.chat.model.GetUserResponse;
import au.edu.sydney.comp5703.cs30.chat.model.SignupRequest;
import au.edu.sydney.comp5703.cs30.chat.model.UpdateUserInfoRequest;
import au.edu.sydney.comp5703.cs30.chat.service.IUserService;
import au.edu.sydney.comp5703.cs30.chat.util.JsonResult;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.servlet.http.HttpSession;

@RestController
public class UserController extends BaseController {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private IUserService iUserService;

    @RequestMapping(value = "/api/v1/users/{userId}", produces = "application/json", method = RequestMethod.GET)
    public User handleGetUser(@PathVariable long userId) {
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }
        return user;
        // return new GetUserResponse(user.getId(), user.getName(), user.getName());
    }

    @RequestMapping(value ="/api/v1/users", method = RequestMethod.POST)
    public JsonResult<Void> reg(@RequestBody SignupRequest req) {
        if (Strings.isEmpty(req.getUsername()) || Strings.isEmpty(req.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "missing username or password");
        }
        iUserService.reg(req.getUsername(), req.getPassword());

        return new JsonResult<Void>(OK);
    }

    @RequestMapping(value ="/api/v1/users/{userId}", consumes = "application/json", produces = "application/json", method = RequestMethod.PUT)
    public JsonResult<Void> updateInfo(@PathVariable String userId, @RequestBody UpdateUserInfoRequest req, @RequestHeader("authorization") Long auth) {
        if (!"current".equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Update info of user other than you is not allowed");
        }
        var user = userMapper.findById(auth);
        if (req.getNewPassword() != null) {
            iUserService.changePassword((int) user.getId(), user.getUsername(), req.getOldPassword(), req.getNewPassword());
        }
        if (req.getUsername() != null && req.getEmail() != null && req.getPhone() != null) {
            iUserService.updateInfoByUid(req.getUsername(), req.getPhone(), req.getEmail(), (int) user.getId());
        }
        return new JsonResult<>(OK);
    }

}
