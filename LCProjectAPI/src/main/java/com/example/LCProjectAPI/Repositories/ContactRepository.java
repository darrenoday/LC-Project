package com.example.LCProjectAPI.Repositories;


import com.example.LCProjectAPI.Models.Contact;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ContactRepository extends JpaRepository<Contact, Long> {
}
