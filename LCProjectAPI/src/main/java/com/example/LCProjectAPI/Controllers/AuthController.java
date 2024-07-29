package com.example.LCProjectAPI.Controllers;
import com.example.LCProjectAPI.Models.DTO.LoginFormDTO;
import com.example.LCProjectAPI.Models.DTO.RegistrationFormDTO;
import com.example.LCProjectAPI.Models.User;
import com.example.LCProjectAPI.Repositories.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    @Autowired
    public AuthController(UserRepository userRepository, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/user")
    public ResponseEntity<User> getUserFromSession(HttpSession session) {
        User user = (User) session.getAttribute("user");
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegistrationFormDTO registrationForm, HttpSession session) {
        // Check if passwords match
        if (!registrationForm.getPassword().equals(registrationForm.getVerifyPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match.");
        }

        // Check if username already exists
        if (userRepository.findByUsername(registrationForm.getUsername()) != null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username already exists.");
        }

        // Create new user
        User user = new User();
        user.setUsername(registrationForm.getUsername());
        user.setPassword(passwordEncoder.encode(registrationForm.getPassword()));

        // Save user to database
        userRepository.save(user);

        // Set user in session
        session.setAttribute("user", user);

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@Valid @RequestBody LoginFormDTO loginForm, HttpSession session) {
        // Find user by username
        User user = userRepository.findByUsername(loginForm.getUsername());

        // Check if user exists and password matches
        if (user != null && passwordEncoder.matches(loginForm.getPassword(), user.getPassword())) {
            // Set user in session
            session.setAttribute("user", user);

            // Check if username is 'admin' and return appropriate message
            if ("admin".equals(user.getUsername())) {
                return ResponseEntity.ok("admin");
            } else {
                return ResponseEntity.ok("User logged in successfully.");
            }
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpSession session) {
        session.invalidate(); // Invalidate session
        return ResponseEntity.ok("Logged out successfully.");
    }
}

//User Endpoint (GET):
//
//URL: http://localhost:8080/user
//Method: GET
//Register Endpoint (POST):
//
//URL: http://localhost:8080/register
//Method: POST
//Login Endpoint (POST):
//
//URL: http://localhost:8080/login
//Method: POST