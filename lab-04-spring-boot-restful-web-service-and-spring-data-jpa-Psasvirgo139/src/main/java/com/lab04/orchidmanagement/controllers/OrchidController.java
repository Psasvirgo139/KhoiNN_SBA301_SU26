package com.lab04.orchidmanagement.controllers;

import com.lab04.orchidmanagement.pojos.Orchid;
import com.lab04.orchidmanagement.services.IOrchidService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.data.domain.Page;
import com.lab04.orchidmanagement.exception.OrchidNotFoundException;
import com.lab04.orchidmanagement.dto.ApiResponse;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/orchids")
public class OrchidController {

    private final IOrchidService service;

    public OrchidController(IOrchidService service) {
        this.service = service;
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<List<Orchid>>> getAllOrchids() {
        List<Orchid> orchids = service.getAllOrchids();
        ApiResponse<List<Orchid>> response = new ApiResponse<>(true, "Orchids retrieved successfully", orchids);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/")
    public ResponseEntity<ApiResponse<Orchid>> createOrchid(@Valid @RequestBody Orchid orchid) {
        Orchid created = service.createOrchid(orchid);
        ApiResponse<Orchid> response = new ApiResponse<>(true, "Orchid created successfully", created);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Orchid>> getOrchidById(@PathVariable Integer id) {
        Orchid orchid = service.getOrchidById(id)
                .orElseThrow(() -> new OrchidNotFoundException("Orchid not found with id: " + id));
        ApiResponse<Orchid> response = new ApiResponse<>(true, "Orchid retrieved successfully", orchid);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Orchid>> updateOrchid(@PathVariable Integer id, @Valid @RequestBody Orchid orchid) {
        Orchid updated = service.updateOrchid(id, orchid);
        ApiResponse<Orchid> response = new ApiResponse<>(true, "Orchid updated successfully", updated);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteOrchid(@PathVariable Integer id) {
        service.deleteOrchid(id);
        ApiResponse<Void> response = new ApiResponse<>(true, "Orchid deleted successfully", null);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).body(response);
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<Orchid>>> searchOrchids(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean isNatural) {
        List<Orchid> orchids = service.searchOrchids(name, category, isNatural);
        ApiResponse<List<Orchid>> response = new ApiResponse<>(true, "Search results retrieved successfully", orchids);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/paged")
    public ResponseEntity<ApiResponse<Page<Orchid>>> getPagedOrchids(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "orchidId") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        Page<Orchid> pagedOrchids = service.getPagedOrchids(page, size, sortBy, direction);
        ApiResponse<Page<Orchid>> response = new ApiResponse<>(true, "Paged orchids retrieved successfully", pagedOrchids);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<List<String>>> getCategories() {
        List<String> categories = service.getUniqueCategories();
        ApiResponse<List<String>> response = new ApiResponse<>(true, "Categories retrieved successfully", categories);
        return ResponseEntity.ok(response);
    }
}
