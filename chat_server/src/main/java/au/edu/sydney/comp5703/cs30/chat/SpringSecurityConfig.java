package au.edu.sydney.comp5703.cs30.chat;


import au.edu.sydney.comp5703.cs30.chat.entity.User;
import au.edu.sydney.comp5703.cs30.chat.security.CustomAuthFilter;
import au.edu.sydney.comp5703.cs30.chat.security.CustomAuthProvider;
import jakarta.servlet.Filter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.argon2.Argon2PasswordEncoder;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.DelegatingPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AnonymousAuthenticationFilter;
import org.springframework.security.web.authentication.AuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.*;

import java.util.HashMap;

@Configuration
@EnableWebSecurity
public class SpringSecurityConfig {

    private CustomAuthProvider customAuthProvider;

    @Autowired
    public SpringSecurityConfig(CustomAuthProvider customAuthProvider) {
        this.customAuthProvider = customAuthProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        var builder = http.getSharedObject(AuthenticationManagerBuilder.class);
        builder.authenticationProvider(customAuthProvider);
        return builder.build();
    }

    @Bean
    Filter authenticationFilter(HttpSecurity http) throws Exception {
        var rm = new AndRequestMatcher(
                new AntPathRequestMatcher("/api/v1/**"),
                new NegatedRequestMatcher(
                        new OrRequestMatcher(
                                new RegexRequestMatcher("/api/v1/users", "POST"),
                                new RegexRequestMatcher("/api/v1/auth", "POST")
                        )
                )
        );
        var filter = new CustomAuthFilter(rm);
        filter.setAuthenticationManager(authenticationManager(http));

        return filter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors().and()
                .csrf()
                .disable()
                .authenticationProvider(customAuthProvider)
                .authorizeHttpRequests()
                .requestMatchers("/api/v1/auth", "/chat-ws", "/stub", "/")
                .permitAll()
                .requestMatchers(new RegexRequestMatcher("/api/v1/users", "POST"))
                .permitAll()
                .requestMatchers("/api/v1/**")
                .authenticated()
                .and()
                .addFilterBefore(authenticationFilter(http), AnonymousAuthenticationFilter.class)
                .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                .and()
                .exceptionHandling()
                .and()
                .formLogin().disable()
                .httpBasic().disable()
                .logout().disable();
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
