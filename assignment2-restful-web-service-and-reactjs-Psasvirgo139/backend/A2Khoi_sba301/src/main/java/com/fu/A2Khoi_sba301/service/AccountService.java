package com.fu.A2Khoi_sba301.service;

import com.fu.A2Khoi_sba301.dto.AccountRequest;
import com.fu.A2Khoi_sba301.dto.AccountResponse;
import com.fu.A2Khoi_sba301.entity.SystemAccount;
import com.fu.A2Khoi_sba301.exception.ConflictException;
import com.fu.A2Khoi_sba301.exception.ResourceNotFoundException;
import com.fu.A2Khoi_sba301.repository.NewsArticleRepository;
import com.fu.A2Khoi_sba301.repository.SystemAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * TODO-05: Service quan ly Account (Admin).
 * Rang buoc: account da tao news article thi KHONG duoc xoa.
 */
@Service
@RequiredArgsConstructor
public class AccountService {

    private final SystemAccountRepository accountRepository;
    private final NewsArticleRepository newsArticleRepository;

    public List<AccountResponse> getAll() {
        return accountRepository.findAll().stream().map(AccountResponse::from).toList();
    }

    public AccountResponse getById(Short id) {
        return AccountResponse.from(findAccount(id));
    }

    public List<AccountResponse> search(String keyword) {
        return accountRepository
                .findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(keyword, keyword)
                .stream().map(AccountResponse::from).toList();
    }

    public AccountResponse create(AccountRequest request) {
        if (accountRepository.existsById(request.accountId())) {
            throw new ConflictException("AccountId " + request.accountId() + " already exists");
        }
        if (accountRepository.existsByAccountEmail(request.accountEmail())) {
            throw new ConflictException("Email " + request.accountEmail() + " already exists");
        }
        SystemAccount account = SystemAccount.builder()
                .accountId(request.accountId())
                .accountName(request.accountName())
                .accountEmail(request.accountEmail())
                .accountRole(request.accountRole())
                .accountPassword(request.accountPassword())
                .build();
        return AccountResponse.from(accountRepository.save(account));
    }

    public AccountResponse update(Short id, AccountRequest request) {
        SystemAccount account = findAccount(id);
        accountRepository.findByAccountEmail(request.accountEmail())
                .filter(other -> !other.getAccountId().equals(id))
                .ifPresent(other -> {
                    throw new ConflictException("Email " + request.accountEmail() + " already exists");
                });
        account.setAccountName(request.accountName());
        account.setAccountEmail(request.accountEmail());
        account.setAccountRole(request.accountRole());
        account.setAccountPassword(request.accountPassword());
        return AccountResponse.from(accountRepository.save(account));
    }

    public void delete(Short id) {
        SystemAccount account = findAccount(id);
        // Rang buoc nghiep vu: da tao bai viet -> khong duoc xoa
        if (newsArticleRepository.existsByCreatedBy_AccountId(id)) {
            throw new ConflictException("Cannot delete: this account has created news articles");
        }
        accountRepository.delete(account);
    }

    private SystemAccount findAccount(Short id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + id));
    }
}
