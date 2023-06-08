package au.edu.sydney.comp5703.cs30.chat.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationFailureHandler;

import java.io.IOException;
import java.util.HashMap;

public class AuthFailureHandler implements AuthenticationFailureHandler {
    private static ObjectMapper om = new ObjectMapper();

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
        response.setStatus(401);
        response.setContentType("application/json");
        var data = new HashMap<String, Object>();
        data.put("ok", false);
        data.put("message", exception.getMessage());
        var s = om.writeValueAsString(data);
        response.getOutputStream().print(s);
    }
}
