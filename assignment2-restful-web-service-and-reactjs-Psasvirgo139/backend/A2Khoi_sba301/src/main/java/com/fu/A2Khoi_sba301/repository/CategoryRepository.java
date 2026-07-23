package com.fu.A2Khoi_sba301.repository;

import com.fu.A2Khoi_sba301.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * TODO-03: Repository Category
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Short> {

    // Search theo ten category
    List<Category> findByCategoryNameContainingIgnoreCase(String categoryName);
}
