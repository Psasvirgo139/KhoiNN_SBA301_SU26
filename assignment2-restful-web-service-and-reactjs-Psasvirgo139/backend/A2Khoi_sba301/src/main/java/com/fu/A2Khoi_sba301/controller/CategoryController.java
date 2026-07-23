package com.fu.A2Khoi_sba301.controller;

import com.fu.A2Khoi_sba301.dto.CategoryRequest;
import com.fu.A2Khoi_sba301.dto.CategoryResponse;
import com.fu.A2Khoi_sba301.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * TODO-06: REST Controller - Category management (Staff)
 * GET    /api/categories            - danh sach
 * GET    /api/categories/{id}       - chi tiet
 * GET    /api/categories/search?q=  - tim kiem theo ten
 * POST   /api/categories            - tao moi (201)
 * PUT    /api/categories/{id}       - cap nhat
 * DELETE /api/categories/{id}       - xoa (204; 409 neu dang duoc dung)
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryResponse> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public CategoryResponse getById(@PathVariable Short id) {
        return categoryService.getById(id);
    }

    @GetMapping("/search")
    public List<CategoryResponse> search(@RequestParam("q") String keyword) {
        return categoryService.search(keyword);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(@Valid @RequestBody CategoryRequest request) {
        return categoryService.create(request);
    }

    @PutMapping("/{id}")
    public CategoryResponse update(@PathVariable Short id, @Valid @RequestBody CategoryRequest request) {
        return categoryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Short id) {
        categoryService.delete(id);
    }
}
