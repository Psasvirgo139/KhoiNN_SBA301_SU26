-- Seed data for SystemAccount table in SQL Server
-- This script checks if the account IDs already exist before inserting to avoid constraint violations.

IF NOT EXISTS (SELECT 1 FROM SystemAccount WHERE AccountID = 1)
BEGIN
    INSERT INTO SystemAccount (AccountID, AccountName, AccountEmail, AccountRole, AccountPassword)
    VALUES (1, N'Steve Paris', 'SteveParis@FUNewsManagement.org', 1, '@1');
END;

IF NOT EXISTS (SELECT 1 FROM SystemAccount WHERE AccountID = 2)
BEGIN
    INSERT INTO SystemAccount (AccountID, AccountName, AccountEmail, AccountRole, AccountPassword)
    VALUES (2, N'Emma William', 'EmmaWilliam@FUNewsManagement.org', 2, '@1');
END;

IF NOT EXISTS (SELECT 1 FROM SystemAccount WHERE AccountID = 3)
BEGIN
    INSERT INTO SystemAccount (AccountID, AccountName, AccountEmail, AccountRole, AccountPassword)
    VALUES (3, N'Olivia James', 'OliviaJames@FUNewsManagement.org', 2, '@1');
END;
