-- SQL Server Seed Data Script for SystemAccount
-- Database name: A2Khoi_sba301
-- Running this script in SQL Server Management Studio (SSMS) will insert the default accounts if they do not exist.

-- Select the database
USE A2Khoi_sba301;
GO

-- Insert default accounts
IF NOT EXISTS (SELECT 1 FROM SystemAccount WHERE AccountID = 1)
BEGIN
    INSERT INTO SystemAccount (AccountID, AccountName, AccountEmail, AccountRole, AccountPassword)
    VALUES (1, N'Steve Paris', 'SteveParis@FUNewsManagement.org', 1, '@1');
    PRINT 'Inserted account: Steve Paris (Admin)';
END
ELSE
BEGIN
    PRINT 'Account ID 1 already exists, skipping.';
END;

IF NOT EXISTS (SELECT 1 FROM SystemAccount WHERE AccountID = 2)
BEGIN
    INSERT INTO SystemAccount (AccountID, AccountName, AccountEmail, AccountRole, AccountPassword)
    VALUES (2, N'Emma William', 'EmmaWilliam@FUNewsManagement.org', 2, '@1');
    PRINT 'Inserted account: Emma William (Staff)';
END
ELSE
BEGIN
    PRINT 'Account ID 2 already exists, skipping.';
END;

IF NOT EXISTS (SELECT 1 FROM SystemAccount WHERE AccountID = 3)
BEGIN
    INSERT INTO SystemAccount (AccountID, AccountName, AccountEmail, AccountRole, AccountPassword)
    VALUES (3, N'Olivia James', 'OliviaJames@FUNewsManagement.org', 2, '@1');
    PRINT 'Inserted account: Olivia James (Staff)';
END
ELSE
BEGIN
    PRINT 'Account ID 3 already exists, skipping.';
END;
GO
