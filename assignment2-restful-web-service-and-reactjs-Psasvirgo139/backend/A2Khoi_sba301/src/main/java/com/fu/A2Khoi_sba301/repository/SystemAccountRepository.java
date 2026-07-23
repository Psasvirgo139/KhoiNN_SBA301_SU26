package com.fu.A2Khoi_sba301.repository;

import com.fu.A2Khoi_sba301.entity.SystemAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * TODO-03: Repository SystemAccount
 */
@Repository
public interface SystemAccountRepository extends JpaRepository<SystemAccount, Short> {

    Optional<SystemAccount> findByAccountEmail(String accountEmail);

    Optional<SystemAccount> findByAccountEmailAndAccountPassword(String accountEmail, String accountPassword);

    boolean existsByAccountEmail(String accountEmail);

    // Search theo ten hoac email
    List<SystemAccount> findByAccountNameContainingIgnoreCaseOrAccountEmailContainingIgnoreCase(String name, String email);
}
