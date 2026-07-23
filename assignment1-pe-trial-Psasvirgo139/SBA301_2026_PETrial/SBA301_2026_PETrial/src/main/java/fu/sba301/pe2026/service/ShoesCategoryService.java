package fu.sba301.pe2026.service;

import fu.sba301.pe2026.dto.ShoesCategoryResponse;

import java.util.List;

public interface ShoesCategoryService {
    List<ShoesCategoryResponse> getAllCategories();
}
