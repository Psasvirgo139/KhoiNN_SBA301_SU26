package fu.sba301.pe2026.service.impl;

import fu.sba301.pe2026.dto.PageResponse;
import fu.sba301.pe2026.dto.ShoesRequest;
import fu.sba301.pe2026.dto.ShoesResponse;
import fu.sba301.pe2026.entity.Shoes;
import fu.sba301.pe2026.entity.ShoesCategory;
import fu.sba301.pe2026.repository.ShoesCategoryRepository;
import fu.sba301.pe2026.repository.ShoesRepository;
import fu.sba301.pe2026.service.ShoesService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ShoesServiceImpl implements ShoesService {
    
    private final ShoesRepository shoesRepository;
    private final ShoesCategoryRepository shoesCategoryRepository;

    @Override
    public ShoesResponse createShoes(ShoesRequest request) {
        Shoes shoes = new Shoes();
        shoes.setShoesName(request.getShoesName());
        shoes.setPrice(request.getPrice());
        shoes.setQuantity(request.getQuantity());
        shoes.setManufacturer(request.getManufacturer());
        shoes.setProductionDate(request.getProductionDate());
        shoes.setImportDate(request.getImportDate());
        
        if (request.getCategoryId() != null) {
            ShoesCategory category = shoesCategoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));
            shoes.setShoesCategory(category);
        }
        
        Shoes savedShoes = shoesRepository.save(shoes);
        return convertToResponse(savedShoes);
    }

    @Override
    public Optional<ShoesResponse> getShoesById(Long id) {
        return shoesRepository.findById(id).map(this::convertToResponse);
    }

    @Override
    public PageResponse<ShoesResponse> searchShoes(String name, String categoryName, Pageable pageable) {
        Page<Shoes> shoesPage;
        if (name != null && categoryName != null) {
            shoesPage = shoesRepository.findByShoesNameContainingIgnoreCaseAndShoesCategoryCategoryNameContainingIgnoreCase(name, categoryName, pageable);
        } else if (name != null) {
            shoesPage = shoesRepository.findByShoesNameContainingIgnoreCase(name, pageable);
        } else if (categoryName != null) {
            shoesPage = shoesRepository.findByShoesCategoryCategoryNameContainingIgnoreCase(categoryName, pageable);
        } else {
            shoesPage = shoesRepository.findAll(pageable);
        }
        
        List<ShoesResponse> content = shoesPage.getContent().stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
        
        return new PageResponse<>(
                content,
                shoesPage.getNumber(),
                shoesPage.getSize(),
                shoesPage.getTotalElements(),
                shoesPage.getTotalPages(),
                shoesPage.isFirst(),
                shoesPage.isLast()
        );
    }

    @Override
    public void deleteShoes(Long id) {
        shoesRepository.deleteById(id);
    }
    
    private ShoesResponse convertToResponse(Shoes shoes) {
        ShoesResponse response = new ShoesResponse();
        response.setShoesId(shoes.getShoes_id());
        response.setShoesName(shoes.getShoesName());
        response.setPrice(shoes.getPrice());
        response.setQuantity(shoes.getQuantity());
        response.setManufacturer(shoes.getManufacturer());
        response.setProductionDate(shoes.getProductionDate());
        response.setImportDate(shoes.getImportDate());
        if (shoes.getShoesCategory() != null) {
            response.setCategoryName(shoes.getShoesCategory().getCategoryName());
        }
        return response;
    }
}
