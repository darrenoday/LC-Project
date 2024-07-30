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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(@Valid @RequestBody RegistrationFormDTO registrationForm, HttpSession session) {
        if (!registrationForm.getPassword().equals(registrationForm.getVerifyPassword())) {
            return ResponseEntity.badRequest().body("Passwords do not match.");
        }

        if (userRepository.findByUsername(registrationForm.getUsername()) != null) {
            return ResponseEntity.badRequest().body("Username already exists.");
        }

        User user = new User();
        user.setUsername(registrationForm.getUsername());
        user.setPassword(passwordEncoder.encode(registrationForm.getPassword()));

        userRepository.save(user);
        session.setAttribute("user", user);

        return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<String> loginUser(@Valid @RequestBody LoginFormDTO loginForm, HttpSession session) {
        User user = userRepository.findByUsername(loginForm.getUsername());

        if (user != null && passwordEncoder.matches(loginForm.getPassword(), user.getPassword())) {
            session.setAttribute("user", user);
            return "admin".equals(user.getUsername()) ? ResponseEntity.ok("admin") : ResponseEntity.ok("User logged in successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password.");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutUser(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok("Logged out successfully.");
    }
}
