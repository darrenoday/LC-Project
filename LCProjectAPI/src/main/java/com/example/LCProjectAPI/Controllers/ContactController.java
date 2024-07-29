package com.example.LCProjectAPI.Controllers;

import com.example.LCProjectAPI.Models.Contact;
import com.example.LCProjectAPI.Repositories.ContactRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/contact")
public class ContactController {

    @Autowired
    private ContactRepository contactRepository;

    @PostMapping
    public ResponseEntity<String> handleContactForm(@RequestBody Contact contact) {
        System.out.println("Received contact form submission: " + contact);
        contactRepository.save(contact);
        return ResponseEntity.ok("Thank you for reaching out! We will get back to you soon.");
    }

    @GetMapping
    public ResponseEntity<String> getContactInfo() {
        return ResponseEntity.ok("This is the contact endpoint. Use POST to submit data.");
    }
}
