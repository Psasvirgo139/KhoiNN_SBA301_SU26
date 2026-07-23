package com.fu.A2Khoi_sba301.controller;

import com.fu.A2Khoi_sba301.entity.Tag;
import com.fu.A2Khoi_sba301.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * TODO-06: REST Controller - Tag
 * GET /api/tags - danh sach tag (de gan vao news article)
 */
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public List<Tag> getAll() {
        return tagService.getAll();
    }
}
