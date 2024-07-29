package com.example.LCProjectAPI.Controllers;

import javax.validation.Valid;

import com.example.LCProjectAPI.Models.Event;
import com.example.LCProjectAPI.Repositories.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/admin/events")
public class AdminController {

    private final EventRepository eventRepository;

    @Autowired
    public AdminController(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    // Admin can Get all user submitted events
    @GetMapping
    public List<Event> getAllSubmittedEvents() {
        return eventRepository.findAll();
    }

    @PutMapping("{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable Long id,
                                             @RequestBody @Valid Event event) {

        Optional<Event> eventOptional = eventRepository.findById(id);
        if (eventOptional.isPresent( )) {
            Event existingEvent = eventOptional.get( );

            //Update event fields
            existingEvent.setEventName(event.getEventName( ));
            existingEvent.setEventDate(event.getEventDate( ));
            existingEvent.setEventTime(event.getEventTime( ));
            existingEvent.setEventLocation(event.getEventLocation( ));
            existingEvent.setDescription(event.getDescription( ));
            existingEvent.setEventCategory(event.getEventCategory());
            existingEvent.setEventPrice(event.getEventPrice());
            existingEvent.setApprovalStatus(event.getApprovalStatus());

            Event updatedEvent = eventRepository.save(existingEvent);
            return ResponseEntity.ok(updatedEvent);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    //Delete event
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        if (!eventRepository.existsById(id)) {
            // if event is not found indicates no deletion was performed.
            return ResponseEntity.notFound().build();
        }
        eventRepository.deleteById(id);
        //if the event exists it proceed to delete the event using eventRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }


}