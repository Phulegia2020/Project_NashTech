package com.example.nashtechproject.restcontroller;

import java.util.List;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import com.example.nashtechproject.entity.User;
import com.example.nashtechproject.exception.UserException;
import com.example.nashtechproject.payload.request.ChangPasswordRequest;
import com.example.nashtechproject.security.jwt.JwtAuthTokenFilter;
import com.example.nashtechproject.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

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

    @GetMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String jwt = JwtAuthTokenFilter.parseJwt(request);
        if (jwt != null && jwtUtils.addToBlackList(jwt)){
            return ResponseEntity.ok(new MessageResponse("User logged out successfully!"));
        }
        return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Cannot add jwt token to blacklist!"));
    }
}