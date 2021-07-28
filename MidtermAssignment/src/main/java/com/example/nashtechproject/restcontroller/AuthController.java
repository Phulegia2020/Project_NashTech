package com.example.nashtechproject.restcontroller;

import java.util.List;
import java.util.stream.Collectors;

import javax.validation.Valid;

import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.payload.request.ChangPasswordRequest;
import com.example.nashtechproject.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.nashtechproject.entity.Role;
import com.example.nashtechproject.entity.RoleName;
import com.example.nashtechproject.payload.request.LoginRequest;
import com.example.nashtechproject.payload.request.SignupRequest;
import com.example.nashtechproject.payload.response.JwtResponse;
import com.example.nashtechproject.payload.response.MessageResponse;
import com.example.nashtechproject.repository.RoleRepository;
import com.example.nashtechproject.repository.UserRepository;
import com.example.nashtechproject.security.jwt.JwtUtils;
import com.example.nashtechproject.security.services.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private AuthService authService;

    final private AuthenticationManager authenticationManager;

    final private UserRepository userRepository;

    final private RoleRepository roleRepository;

    final private PasswordEncoder encoder;

    final private JwtUtils jwtUtils;

    public AuthController (AuthenticationManager authenticationManager, UserRepository userRepository,
                           RoleRepository roleRepository, PasswordEncoder encoder, JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.encoder = encoder;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        // TODO, authenticate when login
        // Username, pass from client
        // com.nashtech.rookies.security.WebSecurityConfig.configure(org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder)
//        authenticationManagerBuilder.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder());
        // on this step, we tell to authenticationManager how we load data from database
        // and the password encoder

        JwtResponse jp = authService.getJwtResponse(loginRequest);

        return ResponseEntity.ok(jp);
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return authService.getUserSignUp(signUpRequest);
    }

    @PostMapping("/profile")
    public ResponseEntity<?> changePasswordUser(@Valid @RequestBody ChangPasswordRequest changPasswordRequest)
    {
        return authService.getUserChangePassword(changPasswordRequest);
    }
}