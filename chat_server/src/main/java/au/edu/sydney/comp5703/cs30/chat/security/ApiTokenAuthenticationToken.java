package au.edu.sydney.comp5703.cs30.chat.security;

import au.edu.sydney.comp5703.cs30.chat.entity.User;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import javax.security.auth.Subject;
import java.util.ArrayList;
import java.util.Collection;

public class ApiTokenAuthenticationToken extends AbstractAuthenticationToken {

    private String token;
    private User user;

    public ApiTokenAuthenticationToken(String token) {
        super(new ArrayList<>());
        this.token = token;
    }

    public ApiTokenAuthenticationToken(User user, String token) {
        super(new ArrayList<>());
        this.user = user;
        this.token = token;
        setAuthenticated(true);
    }

    @Override
    public Object getCredentials() {
        return token;
    }

    @Override
    public User getPrincipal() {
        return user;
    }

    @Override
    public boolean implies(Subject subject) {
        return super.implies(subject);
    }
}
