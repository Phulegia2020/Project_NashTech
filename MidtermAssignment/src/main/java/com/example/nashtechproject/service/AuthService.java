package com.example.nashtechproject.service;

import com.example.nashtechproject.payload.request.ChangPasswordRequest;
import com.example.nashtechproject.payload.request.LoginRequest;
import com.example.nashtechproject.payload.request.SignupRequest;
import com.example.nashtechproject.payload.response.JwtResponse;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    public JwtResponse getJwtResponse(LoginRequest loginRequest);

    public ResponseEntity<?> getUserSignUp(SignupRequest signUpRequest);

    public ResponseEntity<?> getUserChangePassword(ChangPasswordRequest changPasswordRequest);
}
