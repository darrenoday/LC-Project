package com.example.LCProjectAPI.Repositories;


import com.example.LCProjectAPI.Models.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EventRepository extends JpaRepository<Event , Long> {
    List<Event> findByEventNameContainingIgnoreCase(String name);
}