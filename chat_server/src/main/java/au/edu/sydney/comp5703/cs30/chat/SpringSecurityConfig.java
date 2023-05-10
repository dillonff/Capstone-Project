package au.edu.sydney.comp5703.cs30.chat;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import java.util.HashMap;

@Configuration
@EnableWebSecurity
public class SpringSecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf()
                .disable()
                .formLogin()
                .and()
                .logout()
                .logoutSuccessUrl("/");

        System.err.println("filterChain");
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        var defaultId = "argon2";
        var encoders = new HashMap<String, PasswordEncoder>();
        // var defaultEncoder = new Argon2PasswordEncoder(16, 64, 1, 16384, 6);
        var defaultEncoder = Argon2PasswordEncoder.defaultsForSpringSecurity_v5_8();
        encoders.put(defaultId, defaultEncoder);
        // PasswordEncoderFactories.createDelegatingPasswordEncoder();
        var encoder = new DelegatingPasswordEncoder(defaultId, encoders);
        return encoder;
    }
}
