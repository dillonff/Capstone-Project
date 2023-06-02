package au.edu.sydney.comp5703.cs30.chat.controller;

import au.edu.sydney.comp5703.cs30.chat.Repo;
import au.edu.sydney.comp5703.cs30.chat.entity.Organization;
import au.edu.sydney.comp5703.cs30.chat.entity.OrganizationMember;
import au.edu.sydney.comp5703.cs30.chat.mapper.*;
import au.edu.sydney.comp5703.cs30.chat.model.InfoChangedPush;
import au.edu.sydney.comp5703.cs30.chat.model.JoinOrganizationRequest;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.Pbkdf2PasswordEncoder;
import org.springframework.security.crypto.scrypt.SCryptPasswordEncoder;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

import static au.edu.sydney.comp5703.cs30.chat.WsUtil.broadcastMessages;
import static au.edu.sydney.comp5703.cs30.chat.WsUtil.makeServerPush;

@RestController
public class OrganizationController {
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

    @Autowired
    private OrganizationMapper organizationMapper;

    @Autowired
    private OrganizationMemberMapper organizationMemberMapper;


    // controller for manual testing only
    @RequestMapping(value = "/api/v1/organizations", consumes = "application/json", produces = "application/json", method = RequestMethod.POST)
    public Organization handleCreateOrg(@RequestBody Map<String, String> req, @RequestHeader("Authorization") Long auth) throws Exception {
        var user = userMapper.findById(auth);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized");
        }

        var name = req.get("name");
        var fullName = req.get("fullName");
        if (!StringUtils.hasLength(name) || !StringUtils.hasLength(fullName)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Org name and full name must be specified");
        }
        var email = req.get("email");
        // TODO: check email existence
        if (!StringUtils.hasLength(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A unique org email must be specified");
        }
        var dupOrg = organizationMapper.findByEmail(email);
        if (dupOrg != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Organization email was already used");
        }
        var description = req.get("description");
        if (description == null) {
            description = "";
        }

        // create org
        // TODO: this should be done in one transaction
        var org = new Organization(name, fullName, description, email);
        organizationMapper.insertOrganization(org);
        var member = new OrganizationMember(user.getId(), org.getId());
        member.setDisplayName(user.getUsername());
        member.setAutoJoinChannel(true);
        organizationMapper.addMember(member);

        // tell all the clients that the channel info has changed
        var p = makeServerPush("infoChanged", new InfoChangedPush("organization"));
        broadcastMessages(p);

        return org;
    }


    @RequestMapping(value = "/api/v1/organizations", produces = "application/json", method = RequestMethod.GET)
    public Map<String, Object> handleGetOrg(@RequestHeader("Authorization") Long auth) throws Exception {
        var user = userMapper.findById(auth);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized");
        }

        var orgs = organizationMapper.findByUserId(user.getId());
        var result = new HashMap<String, Object>();
        result.put("data", orgs);
        return result;
    }

    @RequestMapping(value = "/api/v1/organizations/{id}", produces = "application/json", method = RequestMethod.GET)
    public Organization handleGetInfo(@PathVariable Long id, @RequestHeader("Authorization") Long auth) throws Exception {
        var user = userMapper.findById(auth);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized");
        }

        var org = organizationMapper.findById(id);
        return org;
    }

    @RequestMapping(value = "/api/v1/organizations/{id}/members", produces = "application/json", method = RequestMethod.GET)
    public Map<String, Object> handleGetMembers(@PathVariable Long id, @RequestHeader("Authorization") Long auth) throws Exception {
        var user = userMapper.findById(auth);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized");
        }

        var org = organizationMapper.findById(id);
        if (org == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization " + id + " not found");
        }
        var members = organizationMemberMapper.findByOrgId(id);
        var result = new HashMap<String, Object>();
        result.put("data", members);
        return result;
    }

    @RequestMapping(value = "/api/v1/organizations/{id}/members", consumes = "application/json", produces = "application/json", method = RequestMethod.POST)
    public String handleAddMembers(@RequestBody JoinOrganizationRequest req, @PathVariable Long id, @RequestHeader("Authorization") Long auth) throws Exception {
        var user = userMapper.findById(auth);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "User not authorized");
        }

        var org = organizationMapper.findById(id);
        if (org == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Organization " + id + " not found");
        }

        var userId = req.getUserId();
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "userId to join the org must be specified");
        }
        user = userMapper.findById(userId);
        var member = new OrganizationMember(user.getId(), org.getId());
        member.setDisplayName(user.getUsername());
        member.setAutoJoinChannel(true);
        organizationMapper.addMember(member);
        return "{}";
    }
}
