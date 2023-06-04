package au.edu.sydney.comp5703.cs30.chat.security;

import au.edu.sydney.comp5703.cs30.chat.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.ArrayList;

@Component
public class CustomAuthProvider implements AuthenticationProvider {

    @Autowired
    private UserMapper userMapper;


    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        var token = String.valueOf(authentication.getCredentials());
        System.err.println("do auth: " + token);
        if (!StringUtils.hasLength(token)) {
            throw new BadCredentialsException("Missing api token");
        }
        var user = userMapper.findByToken(token);
        if (user == null) {
            throw new BadCredentialsException("Invalid api token");
        }
        System.err.println("auth ok: " + user.getUsername());
        return new UsernamePasswordAuthenticationToken(user, token, new ArrayList<>());
        //return new ApiTokenAuthenticationToken(user, token);
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return authentication.equals(ApiTokenAuthenticationToken.class);
    }
}
