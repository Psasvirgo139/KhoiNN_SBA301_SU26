package com.fu.A2Khoi_sba301.repository;

import com.fu.A2Khoi_sba301.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * TODO-03: Repository NewsArticle
 */
@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {

    // Public: chi lay tin dang active
    List<NewsArticle> findByNewsStatusTrueOrderByCreatedDateDesc();

    // Lich su tin cua 1 staff
    List<NewsArticle> findByCreatedBy_AccountIdOrderByCreatedDateDesc(Short accountId);

    // Rang buoc delete: account da tao bai viet thi khong duoc xoa
    boolean existsByCreatedBy_AccountId(Short accountId);

    // Rang buoc delete: category dang duoc dung boi bai viet thi khong duoc xoa
    boolean existsByCategory_CategoryId(Short categoryId);

    // Search theo tieu de hoac headline
    List<NewsArticle> findByNewsTitleContainingIgnoreCaseOrHeadlineContainingIgnoreCase(String title, String headline);
}
