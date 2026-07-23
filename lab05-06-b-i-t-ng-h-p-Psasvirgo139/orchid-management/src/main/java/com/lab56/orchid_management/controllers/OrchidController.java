package com.lab56.orchid_management.controllers;

import com.lab56.orchid_management.entities.Orchid;
import com.lab56.orchid_management.services.IOrchidService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/orchids")
@RequiredArgsConstructor
public class OrchidController {

    private final IOrchidService orchidService;

    @GetMapping("/")
    public ResponseEntity<List<Orchid>> getAll() {
        return ResponseEntity.ok(orchidService.getAllOrchids());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Orchid> getById(@PathVariable Integer id) {
        return orchidService.getOrchidById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/")
    public ResponseEntity<Orchid> create(@RequestBody Orchid orchid) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orchidService.createOrchid(orchid));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Orchid> update(@PathVariable Integer id, @RequestBody Orchid orchid) {
        if (!orchidService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(orchidService.updateOrchid(id, orchid));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        if (!orchidService.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        orchidService.deleteOrchid(id);
        return ResponseEntity.noContent().build();
    }
}
