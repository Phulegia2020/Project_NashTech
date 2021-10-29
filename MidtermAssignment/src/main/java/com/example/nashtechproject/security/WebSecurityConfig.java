package com.example.nashtechproject.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.nashtechproject.security.jwt.JwtAuthEntryPoint;
import com.example.nashtechproject.security.jwt.JwtAuthTokenFilter;
import com.example.nashtechproject.security.jwt.JwtUtils;
import com.example.nashtechproject.security.services.UserDetailsServiceImpl;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
    // securedEnabled = true,
    // jsr250Enabled = true,
    prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

    private final UserDetailsServiceImpl userDetailsService;

    final private JwtAuthEntryPoint unauthorizedHandler;

    private final JwtUtils jwtUtils;

    public WebSecurityConfig (UserDetailsServiceImpl userDetailsService, JwtAuthEntryPoint unauthorizedHandler, JwtUtils jwtUtils) {
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtUtils = jwtUtils;
    }

    @Bean
    public JwtAuthTokenFilter authenticationJwtTokenFilter() {
        return new JwtAuthTokenFilter(jwtUtils, userDetailsService);
    }

    @Override
    public void configure(AuthenticationManagerBuilder authenticationManagerBuilder) throws Exception {
        // TODO
        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.cors().and().csrf().disable()
            .exceptionHandling().authenticationEntryPoint(unauthorizedHandler).and()
            .sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS).and()
            .authorizeRequests().antMatchers("/api/auth/logout").authenticated().and()
            .authorizeRequests().antMatchers("/api/auth/**").permitAll()
            .antMatchers(HttpMethod.GET,"/api/products/**").permitAll()
            .antMatchers(HttpMethod.GET,"/api/categories/**").permitAll()
            .antMatchers(HttpMethod.GET,"/api/ratings/**").permitAll()
            .antMatchers(HttpMethod.GET,"/api/suppliers/**").permitAll()
            .antMatchers(HttpMethod.GET, "/api/roles/**").permitAll().and()
//            .authorizeRequests().antMatchers("/api/suppliers/**").hasAnyAuthority("ADMIN", "STAFF").and()
            .authorizeRequests().antMatchers("/api/imports/**").hasAnyAuthority("ADMIN", "STAFF").and()
            .authorizeRequests().antMatchers("/api/importDetails/**").hasAnyAuthority("ADMIN", "STAFF").and()
            .authorizeRequests().antMatchers("/api/placeorders/**").hasAnyAuthority("ADMIN", "STAFF").and()
            .authorizeRequests().antMatchers("/api/placeorderDetails/**").hasAnyAuthority("ADMIN", "STAFF")
//            .authorizeRequests().antMatchers("/api/roles/**").hasAuthority("ADMIN")
            .antMatchers(HttpMethod.GET, "/api/users/**").permitAll()
            .antMatchers(HttpMethod.GET, "/api/comments/**").permitAll()
            .antMatchers(HttpMethod.GET, "/api/payment/**").permitAll()
            .antMatchers(HttpMethod.GET, "/api/productImages/**").permitAll()
            .antMatchers( "/dialogflow-webhook").permitAll()
            .antMatchers("/swagger-ui.html").permitAll()
            .anyRequest().authenticated();

        http.logout().logoutUrl("api/auth/logout").invalidateHttpSession(true);
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/v2/api-docs",
                "/configuration/ui",
                "/swagger-resources/**",
                "/configuration/security",
                "/swagger-ui.html",
                "/webjars/**");
    }
}
