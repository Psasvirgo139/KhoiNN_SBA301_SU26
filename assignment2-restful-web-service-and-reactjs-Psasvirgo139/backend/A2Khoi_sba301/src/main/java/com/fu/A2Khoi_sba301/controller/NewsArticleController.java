package com.fu.A2Khoi_sba301.controller;

import com.fu.A2Khoi_sba301.dto.NewsArticleRequest;
import com.fu.A2Khoi_sba301.dto.NewsArticleResponse;
import com.fu.A2Khoi_sba301.service.NewsArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * TODO-06: REST Controller - News article management
 * GET    /api/news/public               - PUBLIC, tin active, khong can dang nhap
 * GET    /api/news                      - danh sach (Staff)
 * GET    /api/news/{id}                 - chi tiet
 * GET    /api/news/search?q=            - tim kiem theo title/headline
 * GET    /api/news/history/{accountId}  - lich su tin cua 1 staff
 * POST   /api/news                      - tao moi (201)
 * PUT    /api/news/{id}                 - cap nhat
 * DELETE /api/news/{id}                 - xoa (204)
 */
@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    @GetMapping("/public")
    public List<NewsArticleResponse> getPublicNews() {
        return newsArticleService.getPublicNews();
    }

    @GetMapping
    public List<NewsArticleResponse> getAll() {
        return newsArticleService.getAll();
    }

    @GetMapping("/{id}")
    public NewsArticleResponse getById(@PathVariable String id) {
        return newsArticleService.getById(id);
    }

    @GetMapping("/search")
    public List<NewsArticleResponse> search(@RequestParam("q") String keyword) {
        return newsArticleService.search(keyword);
    }

    @GetMapping("/history/{accountId}")
    public List<NewsArticleResponse> getHistory(@PathVariable Short accountId) {
        return newsArticleService.getHistoryByAccount(accountId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NewsArticleResponse create(@Valid @RequestBody NewsArticleRequest request) {
        return newsArticleService.create(request);
    }

    @PutMapping("/{id}")
    public NewsArticleResponse update(@PathVariable String id, @Valid @RequestBody NewsArticleRequest request) {
        return newsArticleService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        newsArticleService.delete(id);
    }
}
