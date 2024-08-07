package com.example.LCProjectAPI.Controllers;

import com.example.LCProjectAPI.Models.Event;
import com.example.LCProjectAPI.Repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventRepository eventRepository;

    @Autowired
    public EventController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Get all events
    @GetMapping
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    // Search events by name containing case-insensitive
    @GetMapping("/search")
    public List<Event> searchEventsByName(@RequestParam(name = "name") String name) {
        return eventRepository.findByEventNameContainingIgnoreCase(name);
    }

    // Get event by id
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        Optional<Event> eventOptional = eventRepository.findById(id);
        if (eventOptional.isPresent()) {
            return ResponseEntity.ok(eventOptional.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Create a new event
    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<?> createEvent(@RequestPart("event") Event event, @RequestPart("file") MultipartFile file) {
        try {
            // Validate event fields here if needed

            // Save the file locally to a static directory
            if (!file.isEmpty()) {
                String uploadsDir = "src/main/resources/static/uploads/";
                Path path = Paths.get(uploadsDir + file.getOriginalFilename());
                Files.createDirectories(path.getParent());
                Files.write(path, file.getBytes());
                event.setImagePath("/uploads/" + file.getOriginalFilename()); // Set relative path for serving
            }

            // Save the event in the repository
            Event savedEvent = eventRepository.save(event);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEvent);
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving file: " + e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating event: " + e.getMessage());
        }
    }
}


// /api/events/search?name=YourEventName
// /api/events
// /api/events/{eventId}
