package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import au.edu.sydney.comp5703.cs30.chat.model.SignupRequest;
import au.edu.sydney.comp5703.cs30.chat.model.UpdateUserInfoRequest;
import au.edu.sydney.comp5703.cs30.chat.service.IUserService;
import au.edu.sydney.comp5703.cs30.chat.util.JsonResult;
import org.apache.logging.log4j.util.Strings;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@RestController
public class UserController extends BaseController {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private IUserService userService;

    @RequestMapping(value = "/api/v1/users/{userId}", produces = "application/json", method = RequestMethod.GET)
    public User handleGetUser(@PathVariable long userId) {
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found.");
        }
        return user;
        // return new GetUserResponse(user.getId(), user.getName(), user.getName());
    }

    @RequestMapping(value = "/api/v1/users", method = RequestMethod.POST)
    public JsonResult<Void> reg(@RequestBody SignupRequest req) {
        if (Strings.isEmpty(req.getUsername()) || Strings.isEmpty(req.getPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "missing username or password");
        }
        if (!req.getUsername().matches("^[A-Za-z0-9_\\-]+$")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "username can only contain letters, digits, _, -");
        }
        if (!StringUtils.hasLength(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "missing email");
        } else {
            var u = userMapper.findByEmail(req.getEmail());
            if (u.size() > 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email was already used");
            }
        }
        if (!StringUtils.hasLength(req.getDisplayName()))  {
            req.setDisplayName(req.getUsername());
        }
        if (req.getPhone() == null) {
            req.setPhone("");
        }
        userService.reg(req.getUsername(), req.getPassword(), req.getPhone(), req.getEmail(), req.getDisplayName());

        return new JsonResult<Void>(OK);
    }

    @PostMapping("/api/v1/userUpdate")
    public JsonResult<Void> updateInfo(@RequestBody UpdateUserInfoRequest req) {
        var user = userMapper.findById(req.getId());
        if (req.getNewPassword() != null) {
            userService.changePassword((int) user.getId(), user.getUsername(), req.getOldPassword(), req.getNewPassword());
        }
        var username = user.getUsername();
        var email = user.getEmail();
        var phone = user.getPhone();
        var displayName = user.getDisplayName();
        if (StringUtils.hasLength(req.getUsername())) {
            username = req.getUsername();
        }
        if (StringUtils.hasLength(req.getEmail())) {
            email = req.getEmail();
        }
        if (StringUtils.hasLength(req.getPhone())) {
            phone = req.getPhone();
        }
        if (StringUtils.hasLength(req.getDisplayName())) {
            displayName = req.getDisplayName();
        }
        userService.updateInfoByUid(user.getId(), username, phone, email, displayName);
        return new JsonResult<>(OK);
    }

    @RequestMapping(value = "/api/v1/users", produces = "application/json", method = RequestMethod.GET)
    public List<User> handleGetUsers(
            @RequestParam(value = "workspaceId", required = false) Long workspaceId,
            @RequestParam(value = "channelId", required = false) Long channelId,
            @RequestParam(value = "organizationId", required = false) Long organizationId
    ) {
        if (Arrays.stream(new Long[]{workspaceId, channelId, organizationId}).allMatch(v -> v == null)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "At least one filter must be specified.");
        }
        // TODO: check access
        return userMapper.filter(workspaceId, channelId, organizationId);
    }

}
