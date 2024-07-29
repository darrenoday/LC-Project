package com.example.LCProjectAPI.Repositories;


import com.example.LCProjectAPI.Models.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByUsername(String username);
//    <S extends User> S save(S user);
}