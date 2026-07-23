package com.fu.A2Khoi_sba301.service;

import com.fu.A2Khoi_sba301.dto.CategoryRequest;
import com.fu.A2Khoi_sba301.dto.CategoryResponse;
import com.fu.A2Khoi_sba301.entity.Category;
import com.fu.A2Khoi_sba301.exception.ConflictException;
import com.fu.A2Khoi_sba301.exception.ResourceNotFoundException;
import com.fu.A2Khoi_sba301.repository.CategoryRepository;
import com.fu.A2Khoi_sba301.repository.NewsArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * TODO-05: Service quan ly Category (Staff).
 * Rang buoc: category dang duoc dung boi news article thi KHONG duoc xoa.
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream().map(CategoryResponse::from).toList();
    }

    public CategoryResponse getById(Short id) {
        return CategoryResponse.from(findCategory(id));
    }

    public List<CategoryResponse> search(String keyword) {
        return categoryRepository.findByCategoryNameContainingIgnoreCase(keyword)
                .stream().map(CategoryResponse::from).toList();
    }

    public CategoryResponse create(CategoryRequest request) {
        Category category = Category.builder()
                .categoryName(request.categoryName())
                .categoryDescription(request.categoryDescription())
                .parentCategory(resolveParent(request.parentCategoryId()))
                .isActive(request.isActive())
                .build();
        return CategoryResponse.from(categoryRepository.save(category));
    }

    public CategoryResponse update(Short id, CategoryRequest request) {
        Category category = findCategory(id);
        if (request.parentCategoryId() != null && request.parentCategoryId().equals(id)) {
            throw new ConflictException("A category cannot be its own parent");
        }
        category.setCategoryName(request.categoryName());
        category.setCategoryDescription(request.categoryDescription());
        category.setParentCategory(resolveParent(request.parentCategoryId()));
        category.setIsActive(request.isActive());
        return CategoryResponse.from(categoryRepository.save(category));
    }

    public void delete(Short id) {
        Category category = findCategory(id);
        // Rang buoc nghiep vu: category da duoc dung trong bai viet -> khong duoc xoa
        if (newsArticleRepository.existsByCategory_CategoryId(id)) {
            throw new ConflictException("Cannot delete: this category is used by news articles");
        }
        categoryRepository.delete(category);
    }

    private Category resolveParent(Short parentId) {
        if (parentId == null) return null;
        return categoryRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent category not found with id " + parentId));
    }

    private Category findCategory(Short id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
    }
}
