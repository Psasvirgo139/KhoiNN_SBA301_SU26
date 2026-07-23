package fu.sba301.pe2026.service.impl;

import fu.sba301.pe2026.dto.ShoesCategoryResponse;
import fu.sba301.pe2026.entity.ShoesCategory;
import fu.sba301.pe2026.repository.ShoesCategoryRepository;
import fu.sba301.pe2026.service.ShoesCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShoesCategoryServiceImpl implements ShoesCategoryService {
    
    private final ShoesCategoryRepository shoesCategoryRepository;

    @Override
    public List<ShoesCategoryResponse> getAllCategories() {
        return shoesCategoryRepository.findAll().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private ShoesCategoryResponse convertToResponse(ShoesCategory category) {
        return new ShoesCategoryResponse(
                category.getId(),
                category.getCategoryName(),
                category.getDescription()
        );
    }
}
