package fu.sba301.pe2026.controller;

import fu.sba301.pe2026.dto.ShoesCategoryResponse;
import fu.sba301.pe2026.service.ShoesCategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
@Tag(name = "Shoes Category", description = "Shoes Category API")
public class ShoesCategoryController {
    
    private final ShoesCategoryService shoesCategoryService;

    @GetMapping
    @Operation(summary = "Get all shoes categories")
    public ResponseEntity<List<ShoesCategoryResponse>> getAllCategories() {
        return ResponseEntity.ok(shoesCategoryService.getAllCategories());
    }
}
