package fu.sba301.pe2026.service;

import fu.sba301.pe2026.dto.PageResponse;
import fu.sba301.pe2026.dto.ShoesRequest;
import fu.sba301.pe2026.dto.ShoesResponse;
import org.springframework.data.domain.Pageable;

import java.util.Optional;

public interface ShoesService {
    ShoesResponse createShoes(ShoesRequest request);
    Optional<ShoesResponse> getShoesById(Long id);
    PageResponse<ShoesResponse> searchShoes(String name, String categoryName, Pageable pageable);
    void deleteShoes(Long id);
}
