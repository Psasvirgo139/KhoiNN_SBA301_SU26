package com.fu.A2Khoi_sba301.service;

import com.fu.A2Khoi_sba301.dto.AccountResponse;
import com.fu.A2Khoi_sba301.dto.LoginRequest;
import com.fu.A2Khoi_sba301.exception.UnauthorizedException;
import com.fu.A2Khoi_sba301.repository.SystemAccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * TODO-05: Dang nhap bang Email + Password.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final SystemAccountRepository accountRepository;

    public AccountResponse login(LoginRequest request) {
        return accountRepository
                .findByAccountEmailAndAccountPassword(request.email(), request.password())
                .map(AccountResponse::from)
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));
    }
}
