package fu.sba301.pe2026.repository;

import fu.sba301.pe2026.entity.ShoesCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ShoesCategoryRepository extends JpaRepository<ShoesCategory, Long> {
    ShoesCategory findByCategoryName(String categoryName);
}
