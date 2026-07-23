package com.fu.A2Khoi_sba301.service;

import com.fu.A2Khoi_sba301.dto.NewsArticleRequest;
import com.fu.A2Khoi_sba301.dto.NewsArticleResponse;
import com.fu.A2Khoi_sba301.entity.Category;
import com.fu.A2Khoi_sba301.entity.NewsArticle;
import com.fu.A2Khoi_sba301.entity.SystemAccount;
import com.fu.A2Khoi_sba301.entity.Tag;
import com.fu.A2Khoi_sba301.exception.ConflictException;
import com.fu.A2Khoi_sba301.exception.ResourceNotFoundException;
import com.fu.A2Khoi_sba301.repository.CategoryRepository;
import com.fu.A2Khoi_sba301.repository.NewsArticleRepository;
import com.fu.A2Khoi_sba301.repository.SystemAccountRepository;
import com.fu.A2Khoi_sba301.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * TODO-05: Service quan ly NewsArticle (Staff) - CRUD + Search + tags.
 */
@Service
@RequiredArgsConstructor
public class NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagRepository tagRepository;

    /** Public: khong can dang nhap, chi tra ve tin active. */
    public List<NewsArticleResponse> getPublicNews() {
        return newsArticleRepository.findByNewsStatusTrueOrderByCreatedDateDesc()
                .stream().map(NewsArticleResponse::from).toList();
    }

    public List<NewsArticleResponse> getAll() {
        return newsArticleRepository.findAll().stream().map(NewsArticleResponse::from).toList();
    }

    public NewsArticleResponse getById(String id) {
        return NewsArticleResponse.from(findNews(id));
    }

    /** Lich su tin da tao boi 1 staff. */
    public List<NewsArticleResponse> getHistoryByAccount(Short accountId) {
        return newsArticleRepository.findByCreatedBy_AccountIdOrderByCreatedDateDesc(accountId)
                .stream().map(NewsArticleResponse::from).toList();
    }

    public List<NewsArticleResponse> search(String keyword) {
        return newsArticleRepository
                .findByNewsTitleContainingIgnoreCaseOrHeadlineContainingIgnoreCase(keyword, keyword)
                .stream().map(NewsArticleResponse::from).toList();
    }

    @Transactional
    public NewsArticleResponse create(NewsArticleRequest request) {
        if (newsArticleRepository.existsById(request.newsArticleId())) {
            throw new ConflictException("NewsArticleId " + request.newsArticleId() + " already exists");
        }
        NewsArticle news = NewsArticle.builder()
                .newsArticleId(request.newsArticleId())
                .newsTitle(request.newsTitle())
                .headline(request.headline())
                .newsContent(request.newsContent())
                .newsSource(request.newsSource())
                .category(findCategory(request.categoryId()))
                .newsStatus(request.newsStatus())
                .createdBy(findAccount(request.createdById()))
                .createdDate(LocalDateTime.now())
                .tags(resolveTags(request.tagIds()))
                .build();
        return NewsArticleResponse.from(newsArticleRepository.save(news));
    }

    @Transactional
    public NewsArticleResponse update(String id, NewsArticleRequest request) {
        NewsArticle news = findNews(id);
        news.setNewsTitle(request.newsTitle());
        news.setHeadline(request.headline());
        news.setNewsContent(request.newsContent());
        news.setNewsSource(request.newsSource());
        news.setCategory(findCategory(request.categoryId()));
        news.setNewsStatus(request.newsStatus());
        news.setUpdatedById(request.createdById()); // nguoi thuc hien update
        news.setModifiedDate(LocalDateTime.now());
        news.setTags(resolveTags(request.tagIds()));
        return NewsArticleResponse.from(newsArticleRepository.save(news));
    }

    @Transactional
    public void delete(String id) {
        NewsArticle news = findNews(id);
        news.getTags().clear(); // xoa cac dong NewsTag truoc
        newsArticleRepository.delete(news);
    }

    private Set<Tag> resolveTags(List<Integer> tagIds) {
        Set<Tag> tags = new HashSet<>();
        if (tagIds != null) {
            for (Integer tagId : tagIds) {
                tags.add(tagRepository.findById(tagId)
                        .orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId)));
            }
        }
        return tags;
    }

    private NewsArticle findNews(String id) {
        return newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with id " + id));
    }

    private Category findCategory(Short id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
    }

    private SystemAccount findAccount(Short id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + id));
    }
}
