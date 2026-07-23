package fu.sba301.pe2026.controller;

import fu.sba301.pe2026.dto.PageResponse;
import fu.sba301.pe2026.dto.ShoesRequest;
import fu.sba301.pe2026.dto.ShoesResponse;
import fu.sba301.pe2026.service.ShoesService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/shoes")
@RequiredArgsConstructor
@Tag(name = "Shoes", description = "Shoes Management API")
public class ShoesController {
    
    private final ShoesService shoesService;

    @PostMapping
    @Operation(summary = "Create new shoes")
    public ResponseEntity<ShoesResponse> createShoes(@RequestBody ShoesRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(shoesService.createShoes(request));
    }

    @GetMapping
    @Operation(summary = "Get all shoes with pagination")
    public ResponseEntity<PageResponse<ShoesResponse>> getAllShoes(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "shoesName") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "asc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        return ResponseEntity.ok(shoesService.searchShoes(null, null, pageable));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get shoes by ID")
    public ResponseEntity<ShoesResponse> getShoesById(@PathVariable Long id) {
        return shoesService.getShoesById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    @Operation(summary = "Search shoes by name and/or category with pagination")
    public ResponseEntity<PageResponse<ShoesResponse>> searchShoes(
            @Parameter(description = "Shoes name to search") @RequestParam(required = false) String name,
            @Parameter(description = "Category name to search") @RequestParam(required = false) String category,
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort by field") @RequestParam(defaultValue = "shoesName") String sortBy,
            @Parameter(description = "Sort direction (asc/desc)") @RequestParam(defaultValue = "asc") String direction) {
        
        Sort.Direction sortDirection = direction.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
        
        return ResponseEntity.ok(shoesService.searchShoes(name, category, pageable));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete shoes by ID")
    public ResponseEntity<Void> deleteShoes(@PathVariable Long id) {
        shoesService.deleteShoes(id);
        return ResponseEntity.noContent().build();
    }
}
