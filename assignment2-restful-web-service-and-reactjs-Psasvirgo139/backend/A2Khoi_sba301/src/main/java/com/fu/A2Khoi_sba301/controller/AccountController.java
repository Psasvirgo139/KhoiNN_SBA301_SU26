package com.fu.A2Khoi_sba301.controller;

import com.fu.A2Khoi_sba301.dto.AccountRequest;
import com.fu.A2Khoi_sba301.dto.AccountResponse;
import com.fu.A2Khoi_sba301.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * TODO-06: REST Controller - Account management (Admin)
 * GET    /api/accounts            - danh sach
 * GET    /api/accounts/{id}       - chi tiet
 * GET    /api/accounts/search?q=  - tim kiem theo ten/email
 * POST   /api/accounts            - tao moi (201)
 * PUT    /api/accounts/{id}       - cap nhat
 * DELETE /api/accounts/{id}       - xoa (204; 409 neu da tao bai viet)
 */
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @GetMapping
    public List<AccountResponse> getAll() {
        return accountService.getAll();
    }

    @GetMapping("/{id}")
    public AccountResponse getById(@PathVariable Short id) {
        return accountService.getById(id);
    }

    @GetMapping("/search")
    public List<AccountResponse> search(@RequestParam("q") String keyword) {
        return accountService.search(keyword);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AccountResponse create(@Valid @RequestBody AccountRequest request) {
        return accountService.create(request);
    }

    @PutMapping("/{id}")
    public AccountResponse update(@PathVariable Short id, @Valid @RequestBody AccountRequest request) {
        return accountService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Short id) {
        accountService.delete(id);
    }
}
