package fu.sba301.pe2026.repository;

import fu.sba301.pe2026.entity.Shoes;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShoesRepository extends JpaRepository<Shoes, Long> {
    Page<Shoes> findByShoesNameContainingIgnoreCase(String name, Pageable pageable);
    Page<Shoes> findByShoesCategoryCategoryNameContainingIgnoreCase(String categoryName, Pageable pageable);
    Page<Shoes> findByShoesNameContainingIgnoreCaseAndShoesCategoryCategoryNameContainingIgnoreCase(String name, String categoryName, Pageable pageable);
}
