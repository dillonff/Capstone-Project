package au.edu.sydney.comp5703.cs30.chat.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.AbstractAuthenticationProcessingFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.util.StringUtils;

import java.io.IOException;

public class CustomAuthFilter extends AbstractAuthenticationProcessingFilter {

    public CustomAuthFilter(RequestMatcher m) {
        super(m);
        setAuthenticationFailureHandler(new AuthFailureHandler());

    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException, IOException, ServletException {
        var token = request.getHeader("Authorization");
        if (!StringUtils.hasLength(token)) {
            token = request.getParameter("token");
        }
        var authToken = new ApiTokenAuthenticationToken(token);
        System.err.println("token: " + token);
        System.err.println(request.getRequestURI());
        return getAuthenticationManager().authenticate(authToken);
    }

    @Override
    protected void successfulAuthentication(final HttpServletRequest request, final HttpServletResponse response, final FilterChain chain, final Authentication authResult) throws IOException, ServletException {
        SecurityContextHolder.getContext().setAuthentication(authResult);
        chain.doFilter(request, response);
    }
}
