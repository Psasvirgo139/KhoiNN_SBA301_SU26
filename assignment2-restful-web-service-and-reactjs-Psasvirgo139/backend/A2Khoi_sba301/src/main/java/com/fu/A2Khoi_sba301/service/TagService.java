package com.fu.A2Khoi_sba301.service;

import com.fu.A2Khoi_sba301.entity.Tag;
import com.fu.A2Khoi_sba301.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * TODO-05: Service Tag (doc danh sach tag de gan vao news article).
 */
@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    public List<Tag> getAll() {
        return tagRepository.findAll();
    }
}
