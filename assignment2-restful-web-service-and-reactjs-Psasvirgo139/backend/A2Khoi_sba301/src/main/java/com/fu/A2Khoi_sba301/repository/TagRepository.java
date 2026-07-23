package com.fu.A2Khoi_sba301.repository;

import com.fu.A2Khoi_sba301.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * TODO-03: Repository Tag
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {
}
