package com.lab56.orchid_management.services;

import com.lab56.orchid_management.entities.Orchid;
import com.lab56.orchid_management.repositories.IOrchidRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrchidService implements IOrchidService {

    private final IOrchidRepository orchidRepository;

    @Override
    public List<Orchid> getAllOrchids() {
        return orchidRepository.findAll();
    }

    @Override
    public Optional<Orchid> getOrchidById(Integer id) {
        return orchidRepository.findById(id);
    }

    @Override
    public Orchid createOrchid(Orchid orchid) {
        return orchidRepository.save(orchid);
    }

    @Override
    public boolean existsById(Integer id) {
        return orchidRepository.existsById(id);
    }

    @Override
    public void deleteOrchid(Integer id) {
        orchidRepository.deleteById(id);
    }

    @Override
    public Orchid updateOrchid(Integer id, Orchid orchid) {
        Orchid existing = orchidRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hoa lan với ID: " + id));
        existing.setOrchidName(orchid.getOrchidName());
        existing.setIsNatural(orchid.getIsNatural());
        existing.setOrchidDescription(orchid.getOrchidDescription());
        existing.setOrchidCategory(orchid.getOrchidCategory());
        existing.setIsAttractive(orchid.getIsAttractive());
        existing.setOrchidURL(orchid.getOrchidURL());
        return orchidRepository.save(existing);
    }
}
