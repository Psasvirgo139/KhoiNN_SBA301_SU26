-- SQL Server Seed Data Script for FUNewsManagementSystem
-- Database name: A2Khoi_sba301
-- Running this script in SQL Server Management Studio (SSMS) will insert default accounts, categories, tags, and news articles if they do not exist.

-- Select the database
USE A2Khoi_sba301;
GO

PRINT '==================================================';
PRINT 'STARTING DATABASE SEEDING...';
PRINT '==================================================';

-- 1. SEED SYSTEM ACCOUNT
PRINT 'Seeding SystemAccount...';

IF NOT EXISTS (SELECT 1 FROM SystemAccount WHERE AccountID = 1)
BEGIN
    INSERT INTO SystemAccount (AccountID, AccountName, AccountEmail, AccountRole, AccountPassword)
    VALUES (1, N'Steve Paris', 'SteveParis@FUNewsManagement.org', 1, '@1');
    PRINT '  - Inserted: Steve Paris (Admin)';
END;

IF NOT EXISTS (SELECT 1 FROM SystemAccount WHERE AccountID = 2)
BEGIN
    INSERT INTO SystemAccount (AccountID, AccountName, AccountEmail, AccountRole, AccountPassword)
    VALUES (2, N'Emma William', 'EmmaWilliam@FUNewsManagement.org', 2, '@1');
    PRINT '  - Inserted: Emma William (Staff)';
END;

IF NOT EXISTS (SELECT 1 FROM SystemAccount WHERE AccountID = 3)
BEGIN
    INSERT INTO SystemAccount (AccountID, AccountName, AccountEmail, AccountRole, AccountPassword)
    VALUES (3, N'Olivia James', 'OliviaJames@FUNewsManagement.org', 2, '@1');
    PRINT '  - Inserted: Olivia James (Staff)';
END;


-- 2. SEED CATEGORY
PRINT 'Seeding Category...';

SET IDENTITY_INSERT Category ON;

IF NOT EXISTS (SELECT 1 FROM Category WHERE CategoryID = 1)
BEGIN
    INSERT INTO Category (CategoryID, CategoryName, CategoryDesciption, ParentCategoryID, IsActive)
    VALUES (1, N'Politics', N'World and domestic politics news', NULL, 1);
    PRINT '  - Inserted: Politics Category';
END;

IF NOT EXISTS (SELECT 1 FROM Category WHERE CategoryID = 2)
BEGIN
    INSERT INTO Category (CategoryID, CategoryName, CategoryDesciption, ParentCategoryID, IsActive)
    VALUES (2, N'Business', N'Financial market, corporations, and economics', NULL, 1);
    PRINT '  - Inserted: Business Category';
END;

IF NOT EXISTS (SELECT 1 FROM Category WHERE CategoryID = 3)
BEGIN
    INSERT INTO Category (CategoryID, CategoryName, CategoryDesciption, ParentCategoryID, IsActive)
    VALUES (3, N'Technology', N'Software, hardware, AI, and consumer tech', NULL, 1);
    PRINT '  - Inserted: Technology Category';
END;

IF NOT EXISTS (SELECT 1 FROM Category WHERE CategoryID = 4)
BEGIN
    INSERT INTO Category (CategoryID, CategoryName, CategoryDesciption, ParentCategoryID, IsActive)
    VALUES (4, N'Sports', N'Football, basketball, tennis, and other sports', NULL, 1);
    PRINT '  - Inserted: Sports Category';
END;

IF NOT EXISTS (SELECT 1 FROM Category WHERE CategoryID = 5)
BEGIN
    INSERT INTO Category (CategoryID, CategoryName, CategoryDesciption, ParentCategoryID, IsActive)
    VALUES (5, N'Education', N'Universities, schools, and academic updates', NULL, 1);
    PRINT '  - Inserted: Education Category';
END;

SET IDENTITY_INSERT Category OFF;


-- 3. SEED TAG
PRINT 'Seeding Tag...';

IF NOT EXISTS (SELECT 1 FROM Tag WHERE TagID = 1)
BEGIN
    INSERT INTO Tag (TagID, TagName, Note) VALUES (1, N'Breaking', N'Urgent or highly important news updates');
    PRINT '  - Inserted tag: #Breaking';
END;

IF NOT EXISTS (SELECT 1 FROM Tag WHERE TagID = 2)
BEGIN
    INSERT INTO Tag (TagID, TagName, Note) VALUES (2, N'Economy', N'Related to finance, economy, markets');
    PRINT '  - Inserted tag: #Economy';
END;

IF NOT EXISTS (SELECT 1 FROM Tag WHERE TagID = 3)
BEGIN
    INSERT INTO Tag (TagID, TagName, Note) VALUES (3, N'Innovation', N'New technologies, research, ideas');
    PRINT '  - Inserted tag: #Innovation';
END;

IF NOT EXISTS (SELECT 1 FROM Tag WHERE TagID = 4)
BEGIN
    INSERT INTO Tag (TagID, TagName, Note) VALUES (4, N'Championship', N'Sports tournaments, cups, events');
    PRINT '  - Inserted tag: #Championship';
END;

IF NOT EXISTS (SELECT 1 FROM Tag WHERE TagID = 5)
BEGIN
    INSERT INTO Tag (TagID, TagName, Note) VALUES (5, N'World', N'International news coverage');
    PRINT '  - Inserted tag: #World';
END;

IF NOT EXISTS (SELECT 1 FROM Tag WHERE TagID = 6)
BEGIN
    INSERT INTO Tag (TagID, TagName, Note) VALUES (6, N'Health', N'Healthcare, wellness, medicine');
    PRINT '  - Inserted tag: #Health';
END;

IF NOT EXISTS (SELECT 1 FROM Tag WHERE TagID = 7)
BEGIN
    INSERT INTO Tag (TagID, TagName, Note) VALUES (7, N'Student', N'Student life, admissions, campuses');
    PRINT '  - Inserted tag: #Student';
END;

IF NOT EXISTS (SELECT 1 FROM Tag WHERE TagID = 8)
BEGIN
    INSERT INTO Tag (TagID, TagName, Note) VALUES (8, N'Science', N'Space, physics, biology breakthroughs');
    PRINT '  - Inserted tag: #Science';
END;

IF NOT EXISTS (SELECT 1 FROM Tag WHERE TagID = 9)
BEGIN
    INSERT INTO Tag (TagID, TagName, Note) VALUES (9, N'Lifestyle', N'Leisure, food, travel, fashion');
    PRINT '  - Inserted tag: #Lifestyle';
END;


-- 4. SEED NEWS ARTICLE
PRINT 'Seeding NewsArticle...';

IF NOT EXISTS (SELECT 1 FROM NewsArticle WHERE NewsArticleID = 'NEWS-001')
BEGIN
    INSERT INTO NewsArticle (NewsArticleID, NewsTitle, Headline, CreatedDate, NewsContent, NewsSource, CategoryID, NewsStatus, CreatedByID, UpdatedByID, ModifiedDate)
    VALUES (
        'NEWS-001',
        N'Global Summit on Climate Action 2026',
        N'World leaders gather to discuss carbon emissions reduction targets.',
        GETDATE(),
        N'Leaders from over 190 countries have gathered in Paris for the Global Climate Action Summit 2026. The main agenda is to set aggressive goals for carbon neutrality and establish a unified framework for green energy subsidies. Activists are optimistic but demand binding commitments rather than voluntary declarations.',
        N'International Environmental Press',
        1, -- Politics
        1, -- Active
        2, -- Emma William (Staff)
        NULL,
        NULL
    );
    PRINT '  - Inserted news: NEWS-001';
END;

IF NOT EXISTS (SELECT 1 FROM NewsArticle WHERE NewsArticleID = 'NEWS-002')
BEGIN
    INSERT INTO NewsArticle (NewsArticleID, NewsTitle, Headline, CreatedDate, NewsContent, NewsSource, CategoryID, NewsStatus, CreatedByID, UpdatedByID, ModifiedDate)
    VALUES (
        'NEWS-002',
        N'Tech Giants Unveil Next-Gen AI Frameworks',
        N'Open-source AI tools are set to reshape developer workflows.',
        GETDATE(),
        N'At the annual TechCon 2026, leading technology companies announced a joint venture to build a standardized, open-source AI developer framework. The framework aims to simplify neural network training and reduce computing overhead by 40%, making advanced AI accessible to small-scale start-ups.',
        N'Tech Chronicle',
        3, -- Technology
        1, -- Active
        2, -- Emma William (Staff)
        NULL,
        NULL
    );
    PRINT '  - Inserted news: NEWS-002';
END;

IF NOT EXISTS (SELECT 1 FROM NewsArticle WHERE NewsArticleID = 'NEWS-003')
BEGIN
    INSERT INTO NewsArticle (NewsArticleID, NewsTitle, Headline, CreatedDate, NewsContent, NewsSource, CategoryID, NewsStatus, CreatedByID, UpdatedByID, ModifiedDate)
    VALUES (
        'NEWS-003',
        N'Market Rally: Stocks Hit Record Highs',
        N'Federal Reserve decision triggers massive buying in financial sector.',
        GETDATE(),
        N'Stock indices reached historic highs today following the Federal Reserve''s unexpected decision to lower interest rates. Analysts believe this move will stimulate economic growth, though some warn of persistent inflationary pressures in the housing market.',
        N'Wall Street Journal Digest',
        2, -- Business
        1, -- Active
        3, -- Olivia James (Staff)
        NULL,
        NULL
    );
    PRINT '  - Inserted news: NEWS-003';
END;

IF NOT EXISTS (SELECT 1 FROM NewsArticle WHERE NewsArticleID = 'NEWS-004')
BEGIN
    INSERT INTO NewsArticle (NewsArticleID, NewsTitle, Headline, CreatedDate, NewsContent, NewsSource, CategoryID, NewsStatus, CreatedByID, UpdatedByID, ModifiedDate)
    VALUES (
        'NEWS-004',
        N'Championship Finals: Underdogs Claim Victory',
        N'A stunning 90th-minute goal seals the historic championship win.',
        GETDATE(),
        N'In one of the most thrilling matches of the season, FC United secured a 2-1 victory over the reigning champions. The winning goal came in the final minutes of extra time, sparking celebrations across the city and marking their first title in over three decades.',
        N'Global Sports Network',
        4, -- Sports
        1, -- Active
        3, -- Olivia James (Staff)
        NULL,
        NULL
    );
    PRINT '  - Inserted news: NEWS-004';
END;

IF NOT EXISTS (SELECT 1 FROM NewsArticle WHERE NewsArticleID = 'NEWS-005')
BEGIN
    INSERT INTO NewsArticle (NewsArticleID, NewsTitle, Headline, CreatedDate, NewsContent, NewsSource, CategoryID, NewsStatus, CreatedByID, UpdatedByID, ModifiedDate)
    VALUES (
        'NEWS-005',
        N'University Admits Record Number of Underrepresented Students',
        N'New scholarship programs successfully increase campus diversity.',
        GETDATE(),
        N'FUNiversity announced a record-breaking enrollment of diverse and underrepresented students for the fall semester. This milestone is attributed to the newly launched Global Merit scholarship fund, which covers tuition and living expenses for top academic performers from disadvantaged backgrounds.',
        N'Academic Herald',
        5, -- Education
        1, -- Active
        2, -- Emma William (Staff)
        NULL,
        NULL
    );
    PRINT '  - Inserted news: NEWS-005';
END;


-- 5. SEED NEWS TAG (MANY-TO-MANY RELATIONSHIP)
PRINT 'Seeding NewsTag relationship...';

-- NEWS-001 tags: 1 (Breaking), 5 (World)
IF NOT EXISTS (SELECT 1 FROM NewsTag WHERE NewsArticleID = 'NEWS-001' AND TagID = 1)
    INSERT INTO NewsTag (NewsArticleID, TagID) VALUES ('NEWS-001', 1);
IF NOT EXISTS (SELECT 1 FROM NewsTag WHERE NewsArticleID = 'NEWS-001' AND TagID = 5)
    INSERT INTO NewsTag (NewsArticleID, TagID) VALUES ('NEWS-001', 5);

-- NEWS-002 tags: 1 (Breaking), 3 (Innovation), 8 (Science)
IF NOT EXISTS (SELECT 1 FROM NewsTag WHERE NewsArticleID = 'NEWS-002' AND TagID = 1)
    INSERT INTO NewsTag (NewsArticleID, TagID) VALUES ('NEWS-002', 1);
IF NOT EXISTS (SELECT 1 FROM NewsTag WHERE NewsArticleID = 'NEWS-002' AND TagID = 3)
    INSERT INTO NewsTag (NewsArticleID, TagID) VALUES ('NEWS-002', 3);
IF NOT EXISTS (SELECT 1 FROM NewsTag WHERE NewsArticleID = 'NEWS-002' AND TagID = 8)
    INSERT INTO NewsTag (NewsArticleID, TagID) VALUES ('NEWS-002', 8);

-- NEWS-003 tags: 2 (Economy)
IF NOT EXISTS (SELECT 1 FROM NewsTag WHERE NewsArticleID = 'NEWS-003' AND TagID = 2)
    INSERT INTO NewsTag (NewsArticleID, TagID) VALUES ('NEWS-003', 2);

-- NEWS-004 tags: 4 (Championship)
IF NOT EXISTS (SELECT 1 FROM NewsTag WHERE NewsArticleID = 'NEWS-004' AND TagID = 4)
    INSERT INTO NewsTag (NewsArticleID, TagID) VALUES ('NEWS-004', 4);

-- NEWS-005 tags: 7 (Student)
IF NOT EXISTS (SELECT 1 FROM NewsTag WHERE NewsArticleID = 'NEWS-005' AND TagID = 7)
    INSERT INTO NewsTag (NewsArticleID, TagID) VALUES ('NEWS-005', 7);

PRINT '  - Seeded Many-to-Many relationships between NewsArticles and Tags';

PRINT '==================================================';
PRINT 'DATABASE SEEDING COMPLETED SUCCESSFULLY!';
PRINT '==================================================';
GO
