package com.lab04.orchidmanagement.services;

import com.lab04.orchidmanagement.pojos.Orchid;
import com.lab04.orchidmanagement.repositories.IOrchidRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import com.lab04.orchidmanagement.exception.OrchidNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrchidService implements IOrchidService {

    private final IOrchidRepository repository;

    public OrchidService(IOrchidRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Orchid> getAllOrchids() {
        return repository.findAll();
    }

    @Override
    public Optional<Orchid> getOrchidById(Integer id) {
        return repository.findById(id);
    }

    @Override
    public Orchid createOrchid(Orchid orchid) {
        orchid.setOrchidId(null);
        return repository.save(orchid);
    }

    @Override
    public Orchid updateOrchid(Integer id, Orchid orchid) {
        Optional<Orchid> existingOrchidOpt = repository.findById(id);
        if (existingOrchidOpt.isPresent()) {
            Orchid existingOrchid = existingOrchidOpt.get();
            existingOrchid.setOrchidName(orchid.getOrchidName());
            existingOrchid.setIsNatural(orchid.getIsNatural());
            existingOrchid.setOrchidDescription(orchid.getOrchidDescription());
            existingOrchid.setOrchidCategory(orchid.getOrchidCategory());
            existingOrchid.setIsAttractive(orchid.getIsAttractive());
            existingOrchid.setOrchidURL(orchid.getOrchidURL());
            return repository.save(existingOrchid);
        } else {
            throw new OrchidNotFoundException("Orchid not found with id: " + id);
        }
    }

    @Override
    public void deleteOrchid(Integer id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
        } else {
            throw new OrchidNotFoundException("Orchid not found with id: " + id);
        }
    }

    @Override
    public List<Orchid> searchOrchids(String name, String category, Boolean isNatural) {
        return repository.searchOrchids(name, category, isNatural);
    }

    @Override
    public Page<Orchid> getPagedOrchids(int page, int size, String sortBy, String direction) {
        Sort sort = direction.equalsIgnoreCase("desc") ?
                Sort.by(sortBy).descending() :
                Sort.by(sortBy).ascending();
        Pageable pageable = PageRequest.of(page, size, sort);
        return repository.findAll(pageable);
    }

    @Override
    public List<String> getUniqueCategories() {
        return repository.findDistinctCategories();
    }
}
