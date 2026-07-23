package com.lab05.orchidmanagement.controllers;

import com.lab05.orchidmanagement.pojos.Orchid;
import com.lab05.orchidmanagement.services.IOrchidService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/orchids")
@CrossOrigin(origins = "http://localhost:5173")
public class OrchidController {

    @Autowired
    private IOrchidService service;

    @GetMapping("/")
    public ResponseEntity<List<Orchid>> getAllOrchids() {
        List<Orchid> list = service.getAllOrchids();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orchid> getOrchidById(@PathVariable Integer id) {
        Optional<Orchid> orchidOpt = service.getOrchidById(id);
        if (orchidOpt.isPresent()) {
            return ResponseEntity.ok(orchidOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/")
    public ResponseEntity<Orchid> createOrchid(@RequestBody Orchid orchid) {
        Orchid created = service.createOrchid(orchid);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Orchid> updateOrchid(@PathVariable Integer id, @RequestBody Orchid orchid) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Orchid updated = service.updateOrchid(id, orchid);
        if (updated == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrchid(@PathVariable Integer id) {
        if (!service.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        service.deleteOrchid(id);
        return ResponseEntity.noContent().build();
    }
}
