# Solution Assignment 02 — Code từng TODO + Checklist
> Thay `A2StudentName_ClassCode` bằng tên thật của bạn (VD: `A2BichTra_SE1801`).

## Mục lục

1. TODO-01 — Tạo Spring Boot project + cấu hình Data Source
2. TODO-02 — Tạo 4 Entity + quan hệ
3. TODO-03 — Tạo Repository (Spring Data JPA)
4. TODO-04 — DTO + Validation (validate tất cả field)
5. TODO-05 — Service layer + Exception (business rules)
6. TODO-06 — REST Controller + GlobalExceptionHandler + CORS
7. TODO-07 — Kiểm thử Postman toàn bộ API
8. TODO-08 — Tạo React project (Vite) + axios services
9. TODO-09 — AuthContext + Login + Router phân quyền
10. TODO-10 — Trang tin công khai (không cần đăng nhập)
11. TODO-11 — Account Management (Admin): CRUD + Search + Modal + Confirm
12. TODO-12 — Category Management (Staff)
13. TODO-13 — News Article Management (Staff, kèm tags)
14. TODO-14 — Profile + News History (Staff)
15. TODO-15 — Kiểm thử tích hợp FE ↔ BE

---

## TODO-01 — Tạo Spring Boot project + cấu hình Data Source

Tạo project Spring Initializr (Maven, Java 17, Spring Boot 3.2.x) với dependencies: Spring Web, Spring Data JPA, MS SQL Server Driver, Validation, Lombok. Tạo database bằng script SQL đề cho (đổi tên thành `A2StudentName_ClassCode`) rồi cấu hình datasource.

### 📄 `backend/pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.5</version>
        <relativePath/>
    </parent>

    <!-- Đổi artifactId theo tên của bạn: A2StudentName_ClassCode -->
    <groupId>com.fu</groupId>
    <artifactId>A2StudentName_ClassCode</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>A2StudentName_ClassCode</name>
    <description>Assignment 02 - FU News Management System (Spring Boot 3 REST API)</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <!-- Spring Web: RESTful API -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <!-- Spring Data JPA -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <!-- Bean Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <!-- MS SQL Server Driver -->
        <dependency>
            <groupId>com.microsoft.sqlserver</groupId>
            <artifactId>mssql-jdbc</artifactId>
            <scope>runtime</scope>
        </dependency>
        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 📄 `backend/src/main/resources/application.properties`

```properties
# ===== TODO-01: Cau hinh Data Source =====
spring.application.name=A2StudentName_ClassCode
server.port=8080

# Doi databaseName / username / password theo may cua ban
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=A2StudentName_ClassCode;encrypt=true;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=YourPassword@123
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

# JPA / Hibernate
# update: tu tao bang tu Entity neu chua co (Use Spring Data JPA to create the database)
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
```

### 📄 `backend/src/main/java/com/fu/a2/A2Application.java`

```java
package com.fu.a2;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class A2Application {
    public static void main(String[] args) {
        SpringApplication.run(A2Application.class, args);
    }
}
```

### ✅ Checklist kiểm tra

- [ ] Project chạy được, console không có exception
- [ ] Log hiện `HikariPool-1 - Start completed` (kết nối SQL Server thành công)
- [ ] Database đúng tên `A2StudentName_ClassCode`, đủ 5 bảng + dữ liệu mẫu
- [ ] Tomcat chạy ở port 8080

### 📌 Commit

```
chore(TODO-01): init spring boot project and configure sql server datasource
```

---

## TODO-02 — Tạo 4 Entity + quan hệ

Map đúng tên bảng/cột trong DB có sẵn (chú ý cột typo `CategoryDesciption`). Quan hệ: Account 1-N NewsArticle, Category 1-N NewsArticle, Category tự tham chiếu (parent), NewsArticle N-N Tag qua bảng `NewsTag`.

### 📄 `backend/src/main/java/com/fu/a2/entity/SystemAccount.java`

```java
package com.fu.a2.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

/**
 * TODO-02: Entity SystemAccount (AccountRole: 1 = Admin, 2 = Staff)
 */
@Entity
@Table(name = "SystemAccount")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemAccount {

    @Id
    @Column(name = "AccountID")
    private Short accountId;

    @Column(name = "AccountName", length = 100)
    private String accountName;

    @Column(name = "AccountEmail", length = 70, unique = true)
    private String accountEmail;

    @Column(name = "AccountRole")
    private Integer accountRole; // 1 = Admin, 2 = Staff

    @Column(name = "AccountPassword", length = 70)
    @JsonIgnore
    private String accountPassword;

    @OneToMany(mappedBy = "createdBy")
    @JsonIgnore
    @Builder.Default
    private List<NewsArticle> newsArticles = new ArrayList<>();
}
```

### 📄 `backend/src/main/java/com/fu/a2/entity/Category.java`

```java
package com.fu.a2.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * TODO-02: Entity Category (IsActive: 1 = active, 0 = inactive)
 */
@Entity
@Table(name = "Category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CategoryID")
    private Short categoryId;

    @Column(name = "CategoryName", nullable = false, length = 100)
    private String categoryName;

    // Ten cot trong DB goc bi typo "CategoryDesciption" - giu nguyen de khop DB
    @Column(name = "CategoryDesciption", nullable = false, length = 250)
    private String categoryDescription;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ParentCategoryID")
    private Category parentCategory;

    @Column(name = "IsActive")
    private Boolean isActive;
}
```

### 📄 `backend/src/main/java/com/fu/a2/entity/NewsArticle.java`

```java
package com.fu.a2.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

/**
 * TODO-02: Entity NewsArticle (NewsStatus: 1 = active, 0 = inactive)
 * Quan he N-N voi Tag qua bang trung gian NewsTag.
 */
@Entity
@Table(name = "NewsArticle")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsArticle {

    @Id
    @Column(name = "NewsArticleID", length = 20)
    private String newsArticleId;

    @Column(name = "NewsTitle", length = 400)
    private String newsTitle;

    @Column(name = "Headline", nullable = false, length = 150)
    private String headline;

    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    @Column(name = "NewsContent", length = 4000)
    private String newsContent;

    @Column(name = "NewsSource", length = 400)
    private String newsSource;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CategoryID")
    private Category category;

    @Column(name = "NewsStatus")
    private Boolean newsStatus;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "CreatedByID")
    private SystemAccount createdBy;

    @Column(name = "UpdatedByID")
    private Short updatedById;

    @Column(name = "ModifiedDate")
    private LocalDateTime modifiedDate;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "NewsTag",
            joinColumns = @JoinColumn(name = "NewsArticleID"),
            inverseJoinColumns = @JoinColumn(name = "TagID"))
    @Builder.Default
    private Set<Tag> tags = new HashSet<>();
}
```

### 📄 `backend/src/main/java/com/fu/a2/entity/Tag.java`

```java
package com.fu.a2.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * TODO-02: Entity Tag
 */
@Entity
@Table(name = "Tag")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag {

    @Id
    @Column(name = "TagID")
    private Integer tagId;

    @Column(name = "TagName", length = 50)
    private String tagName;

    @Column(name = "Note", length = 400)
    private String note;
}
```

### ✅ Checklist kiểm tra

- [ ] Chạy lại app, Hibernate không báo lỗi mapping
- [ ] Không sinh bảng thừa (tên bảng/cột khớp DB có sẵn, kể cả `CategoryDesciption`)
- [ ] `accountPassword` có `@JsonIgnore` — không bao giờ trả password ra JSON
- [ ] Quan hệ N-N khai báo bằng `@ManyToMany` + `@JoinTable(name = "NewsTag")`

### 📌 Commit

```
feat(TODO-02): add JPA entities with relationships
```

---

## TODO-03 — Tạo Repository (Spring Data JPA)

4 interface extends `JpaRepository`, dùng derived query cho login, search và 2 query `exists...` phục vụ ràng buộc xóa.

### 📄 `backend/src/main/java/com/fu/a2/repository/SystemAccountRepository.java`

```java
package com.fu.a2.repository;

import com.fu.a2.entity.SystemAccount;
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
```

### 📄 `backend/src/main/java/com/fu/a2/repository/CategoryRepository.java`

```java
package com.fu.a2.repository;

import com.fu.a2.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * TODO-03: Repository Category
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, Short> {

    // Search theo ten category
    List<Category> findByCategoryNameContainingIgnoreCase(String categoryName);
}
```

### 📄 `backend/src/main/java/com/fu/a2/repository/NewsArticleRepository.java`

```java
package com.fu.a2.repository;

import com.fu.a2.entity.NewsArticle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * TODO-03: Repository NewsArticle
 */
@Repository
public interface NewsArticleRepository extends JpaRepository<NewsArticle, String> {

    // Public: chi lay tin dang active
    List<NewsArticle> findByNewsStatusTrueOrderByCreatedDateDesc();

    // Lich su tin cua 1 staff
    List<NewsArticle> findByCreatedBy_AccountIdOrderByCreatedDateDesc(Short accountId);

    // Rang buoc delete: account da tao bai viet thi khong duoc xoa
    boolean existsByCreatedBy_AccountId(Short accountId);

    // Rang buoc delete: category dang duoc dung boi bai viet thi khong duoc xoa
    boolean existsByCategory_CategoryId(Short categoryId);

    // Search theo tieu de hoac headline
    List<NewsArticle> findByNewsTitleContainingIgnoreCaseOrHeadlineContainingIgnoreCase(String title, String headline);
}
```

### 📄 `backend/src/main/java/com/fu/a2/repository/TagRepository.java`

```java
package com.fu.a2.repository;

import com.fu.a2.entity.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * TODO-03: Repository Tag
 */
@Repository
public interface TagRepository extends JpaRepository<Tag, Integer> {
}
```

### ✅ Checklist kiểm tra

- [ ] App khởi động được — tên method sai quy tắc Spring Data sẽ fail ngay lúc start
- [ ] Có `findByAccountEmailAndAccountPassword` cho login
- [ ] Có `existsByCreatedBy_AccountId` và `existsByCategory_CategoryId` cho ràng buộc xóa
- [ ] Có `findByNewsStatusTrueOrderByCreatedDateDesc` cho trang public

### 📌 Commit

```
feat(TODO-03): add spring data repositories with search and constraint queries
```

---

## TODO-04 — DTO + Validation (validate tất cả field)

Dùng Java record + Bean Validation. Request DTO validate đúng độ dài cột DB; Response DTO có static factory `from(entity)`, không lộ password, kèm tên category/người tạo/tags cho FE.

### 📄 `backend/src/main/java/com/fu/a2/dto/LoginRequest.java`

```java
package com.fu.a2.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * TODO-04: DTO + Validation
 */
public record LoginRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Email is invalid")
        String email,

        @NotBlank(message = "Password is required")
        String password
) {
}
```

### 📄 `backend/src/main/java/com/fu/a2/dto/AccountRequest.java`

```java
package com.fu.a2.dto;

import jakarta.validation.constraints.*;

/**
 * TODO-04: DTO + Validation cho SystemAccount
 */
public record AccountRequest(
        @NotNull(message = "AccountId is required")
        Short accountId,

        @NotBlank(message = "AccountName is required")
        @Size(max = 100, message = "AccountName must be at most 100 characters")
        String accountName,

        @NotBlank(message = "AccountEmail is required")
        @Email(message = "AccountEmail is invalid")
        @Size(max = 70, message = "AccountEmail must be at most 70 characters")
        String accountEmail,

        @NotNull(message = "AccountRole is required")
        @Min(value = 1, message = "AccountRole must be 1 (Admin) or 2 (Staff)")
        @Max(value = 2, message = "AccountRole must be 1 (Admin) or 2 (Staff)")
        Integer accountRole,

        @NotBlank(message = "AccountPassword is required")
        @Size(max = 70, message = "AccountPassword must be at most 70 characters")
        String accountPassword
) {
}
```

### 📄 `backend/src/main/java/com/fu/a2/dto/CategoryRequest.java`

```java
package com.fu.a2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/**
 * TODO-04: DTO + Validation cho Category
 */
public record CategoryRequest(
        @NotBlank(message = "CategoryName is required")
        @Size(max = 100, message = "CategoryName must be at most 100 characters")
        String categoryName,

        @NotBlank(message = "CategoryDescription is required")
        @Size(max = 250, message = "CategoryDescription must be at most 250 characters")
        String categoryDescription,

        Short parentCategoryId,

        @NotNull(message = "IsActive is required")
        Boolean isActive
) {
}
```

### 📄 `backend/src/main/java/com/fu/a2/dto/NewsArticleRequest.java`

```java
package com.fu.a2.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

/**
 * TODO-04: DTO + Validation cho NewsArticle
 */
public record NewsArticleRequest(
        @NotBlank(message = "NewsArticleId is required")
        @Size(max = 20, message = "NewsArticleId must be at most 20 characters")
        String newsArticleId,

        @Size(max = 400, message = "NewsTitle must be at most 400 characters")
        String newsTitle,

        @NotBlank(message = "Headline is required")
        @Size(max = 150, message = "Headline must be at most 150 characters")
        String headline,

        @Size(max = 4000, message = "NewsContent must be at most 4000 characters")
        String newsContent,

        @Size(max = 400, message = "NewsSource must be at most 400 characters")
        String newsSource,

        @NotNull(message = "CategoryId is required")
        Short categoryId,

        @NotNull(message = "NewsStatus is required")
        Boolean newsStatus,

        @NotNull(message = "CreatedById is required")
        Short createdById,

        List<Integer> tagIds
) {
}
```

### 📄 `backend/src/main/java/com/fu/a2/dto/AccountResponse.java`

```java
package com.fu.a2.dto;

import com.fu.a2.entity.SystemAccount;

/**
 * TODO-04: Response DTO cho SystemAccount (khong tra ve password)
 */
public record AccountResponse(
        Short accountId,
        String accountName,
        String accountEmail,
        Integer accountRole
) {
    public static AccountResponse from(SystemAccount a) {
        return new AccountResponse(a.getAccountId(), a.getAccountName(), a.getAccountEmail(), a.getAccountRole());
    }
}
```

### 📄 `backend/src/main/java/com/fu/a2/dto/CategoryResponse.java`

```java
package com.fu.a2.dto;

import com.fu.a2.entity.Category;

/**
 * TODO-04: Response DTO cho Category
 */
public record CategoryResponse(
        Short categoryId,
        String categoryName,
        String categoryDescription,
        Short parentCategoryId,
        String parentCategoryName,
        Boolean isActive
) {
    public static CategoryResponse from(Category c) {
        return new CategoryResponse(
                c.getCategoryId(),
                c.getCategoryName(),
                c.getCategoryDescription(),
                c.getParentCategory() != null ? c.getParentCategory().getCategoryId() : null,
                c.getParentCategory() != null ? c.getParentCategory().getCategoryName() : null,
                c.getIsActive());
    }
}
```

### 📄 `backend/src/main/java/com/fu/a2/dto/NewsArticleResponse.java`

```java
package com.fu.a2.dto;

import com.fu.a2.entity.NewsArticle;
import com.fu.a2.entity.Tag;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;

/**
 * TODO-04: Response DTO cho NewsArticle (kem category, nguoi tao, tags)
 */
public record NewsArticleResponse(
        String newsArticleId,
        String newsTitle,
        String headline,
        LocalDateTime createdDate,
        String newsContent,
        String newsSource,
        Short categoryId,
        String categoryName,
        Boolean newsStatus,
        Short createdById,
        String createdByName,
        Short updatedById,
        LocalDateTime modifiedDate,
        List<TagResponse> tags
) {
    public record TagResponse(Integer tagId, String tagName, String note) {
        public static TagResponse from(Tag t) {
            return new TagResponse(t.getTagId(), t.getTagName(), t.getNote());
        }
    }

    public static NewsArticleResponse from(NewsArticle n) {
        return new NewsArticleResponse(
                n.getNewsArticleId(),
                n.getNewsTitle(),
                n.getHeadline(),
                n.getCreatedDate(),
                n.getNewsContent(),
                n.getNewsSource(),
                n.getCategory() != null ? n.getCategory().getCategoryId() : null,
                n.getCategory() != null ? n.getCategory().getCategoryName() : null,
                n.getNewsStatus(),
                n.getCreatedBy() != null ? n.getCreatedBy().getAccountId() : null,
                n.getCreatedBy() != null ? n.getCreatedBy().getAccountName() : null,
                n.getUpdatedById(),
                n.getModifiedDate(),
                n.getTags().stream()
                        .sorted(Comparator.comparing(Tag::getTagId))
                        .map(TagResponse::from)
                        .toList());
    }
}
```

### ✅ Checklist kiểm tra

- [ ] Mọi field có annotation validation đúng độ dài cột DB
- [ ] `accountRole` bị giới hạn `@Min(1) @Max(2)`
- [ ] Response DTO không chứa password
- [ ] `NewsArticleResponse` trả kèm categoryName, createdByName, danh sách tags

### 📌 Commit

```
feat(TODO-04): add request/response DTOs with bean validation
```

---

## TODO-05 — Service layer + Exception (business rules)

Business rules nằm ở Service, không nằm ở Controller: chặn xóa account đã tạo bài (409), chặn xóa category đang dùng (409), chặn trùng ID/email (409), tự set createdDate/modifiedDate, resolve tagIds, clear NewsTag trước khi xóa tin.

### 📄 `backend/src/main/java/com/fu/a2/exception/ResourceNotFoundException.java`

```java
package com.fu.a2.exception;

/** TODO-05: 404 - khong tim thay resource */
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

### 📄 `backend/src/main/java/com/fu/a2/exception/ConflictException.java`

```java
package com.fu.a2.exception;

/**
 * TODO-05: 409 - vi pham rang buoc nghiep vu
 * (xoa account/category dang duoc dung, trung ID/email...)
 */
public class ConflictException extends RuntimeException {
    public ConflictException(String message) {
        super(message);
    }
}
```

### 📄 `backend/src/main/java/com/fu/a2/exception/UnauthorizedException.java`

```java
package com.fu.a2.exception;

/** TODO-05: 401 - dang nhap that bai */
public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
```

### 📄 `backend/src/main/java/com/fu/a2/service/AuthService.java`

```java
package com.fu.a2.service;

import com.fu.a2.dto.AccountResponse;
import com.fu.a2.dto.LoginRequest;
import com.fu.a2.exception.UnauthorizedException;
import com.fu.a2.repository.SystemAccountRepository;
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
```

### 📄 `backend/src/main/java/com/fu/a2/service/AccountService.java`

```java
package com.fu.a2.service;

import com.fu.a2.dto.AccountRequest;
import com.fu.a2.dto.AccountResponse;
import com.fu.a2.entity.SystemAccount;
import com.fu.a2.exception.ConflictException;
import com.fu.a2.exception.ResourceNotFoundException;
import com.fu.a2.repository.NewsArticleRepository;
import com.fu.a2.repository.SystemAccountRepository;
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
```

### 📄 `backend/src/main/java/com/fu/a2/service/CategoryService.java`

```java
package com.fu.a2.service;

import com.fu.a2.dto.CategoryRequest;
import com.fu.a2.dto.CategoryResponse;
import com.fu.a2.entity.Category;
import com.fu.a2.exception.ConflictException;
import com.fu.a2.exception.ResourceNotFoundException;
import com.fu.a2.repository.CategoryRepository;
import com.fu.a2.repository.NewsArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * TODO-05: Service quan ly Category (Staff).
 * Rang buoc: category dang duoc dung boi news article thi KHONG duoc xoa.
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final NewsArticleRepository newsArticleRepository;

    public List<CategoryResponse> getAll() {
        return categoryRepository.findAll().stream().map(CategoryResponse::from).toList();
    }

    public CategoryResponse getById(Short id) {
        return CategoryResponse.from(findCategory(id));
    }

    public List<CategoryResponse> search(String keyword) {
        return categoryRepository.findByCategoryNameContainingIgnoreCase(keyword)
                .stream().map(CategoryResponse::from).toList();
    }

    public CategoryResponse create(CategoryRequest request) {
        Category category = Category.builder()
                .categoryName(request.categoryName())
                .categoryDescription(request.categoryDescription())
                .parentCategory(resolveParent(request.parentCategoryId()))
                .isActive(request.isActive())
                .build();
        return CategoryResponse.from(categoryRepository.save(category));
    }

    public CategoryResponse update(Short id, CategoryRequest request) {
        Category category = findCategory(id);
        if (request.parentCategoryId() != null && request.parentCategoryId().equals(id)) {
            throw new ConflictException("A category cannot be its own parent");
        }
        category.setCategoryName(request.categoryName());
        category.setCategoryDescription(request.categoryDescription());
        category.setParentCategory(resolveParent(request.parentCategoryId()));
        category.setIsActive(request.isActive());
        return CategoryResponse.from(categoryRepository.save(category));
    }

    public void delete(Short id) {
        Category category = findCategory(id);
        // Rang buoc nghiep vu: category da duoc dung trong bai viet -> khong duoc xoa
        if (newsArticleRepository.existsByCategory_CategoryId(id)) {
            throw new ConflictException("Cannot delete: this category is used by news articles");
        }
        categoryRepository.delete(category);
    }

    private Category resolveParent(Short parentId) {
        if (parentId == null) return null;
        return categoryRepository.findById(parentId)
                .orElseThrow(() -> new ResourceNotFoundException("Parent category not found with id " + parentId));
    }

    private Category findCategory(Short id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
    }
}
```

### 📄 `backend/src/main/java/com/fu/a2/service/NewsArticleService.java`

```java
package com.fu.a2.service;

import com.fu.a2.dto.NewsArticleRequest;
import com.fu.a2.dto.NewsArticleResponse;
import com.fu.a2.entity.Category;
import com.fu.a2.entity.NewsArticle;
import com.fu.a2.entity.SystemAccount;
import com.fu.a2.entity.Tag;
import com.fu.a2.exception.ConflictException;
import com.fu.a2.exception.ResourceNotFoundException;
import com.fu.a2.repository.CategoryRepository;
import com.fu.a2.repository.NewsArticleRepository;
import com.fu.a2.repository.SystemAccountRepository;
import com.fu.a2.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * TODO-05: Service quan ly NewsArticle (Staff) - CRUD + Search + tags.
 */
@Service
@RequiredArgsConstructor
public class NewsArticleService {

    private final NewsArticleRepository newsArticleRepository;
    private final CategoryRepository categoryRepository;
    private final SystemAccountRepository accountRepository;
    private final TagRepository tagRepository;

    /** Public: khong can dang nhap, chi tra ve tin active. */
    public List<NewsArticleResponse> getPublicNews() {
        return newsArticleRepository.findByNewsStatusTrueOrderByCreatedDateDesc()
                .stream().map(NewsArticleResponse::from).toList();
    }

    public List<NewsArticleResponse> getAll() {
        return newsArticleRepository.findAll().stream().map(NewsArticleResponse::from).toList();
    }

    public NewsArticleResponse getById(String id) {
        return NewsArticleResponse.from(findNews(id));
    }

    /** Lich su tin da tao boi 1 staff. */
    public List<NewsArticleResponse> getHistoryByAccount(Short accountId) {
        return newsArticleRepository.findByCreatedBy_AccountIdOrderByCreatedDateDesc(accountId)
                .stream().map(NewsArticleResponse::from).toList();
    }

    public List<NewsArticleResponse> search(String keyword) {
        return newsArticleRepository
                .findByNewsTitleContainingIgnoreCaseOrHeadlineContainingIgnoreCase(keyword, keyword)
                .stream().map(NewsArticleResponse::from).toList();
    }

    @Transactional
    public NewsArticleResponse create(NewsArticleRequest request) {
        if (newsArticleRepository.existsById(request.newsArticleId())) {
            throw new ConflictException("NewsArticleId " + request.newsArticleId() + " already exists");
        }
        NewsArticle news = NewsArticle.builder()
                .newsArticleId(request.newsArticleId())
                .newsTitle(request.newsTitle())
                .headline(request.headline())
                .newsContent(request.newsContent())
                .newsSource(request.newsSource())
                .category(findCategory(request.categoryId()))
                .newsStatus(request.newsStatus())
                .createdBy(findAccount(request.createdById()))
                .createdDate(LocalDateTime.now())
                .tags(resolveTags(request.tagIds()))
                .build();
        return NewsArticleResponse.from(newsArticleRepository.save(news));
    }

    @Transactional
    public NewsArticleResponse update(String id, NewsArticleRequest request) {
        NewsArticle news = findNews(id);
        news.setNewsTitle(request.newsTitle());
        news.setHeadline(request.headline());
        news.setNewsContent(request.newsContent());
        news.setNewsSource(request.newsSource());
        news.setCategory(findCategory(request.categoryId()));
        news.setNewsStatus(request.newsStatus());
        news.setUpdatedById(request.createdById()); // nguoi thuc hien update
        news.setModifiedDate(LocalDateTime.now());
        news.setTags(resolveTags(request.tagIds()));
        return NewsArticleResponse.from(newsArticleRepository.save(news));
    }

    @Transactional
    public void delete(String id) {
        NewsArticle news = findNews(id);
        news.getTags().clear(); // xoa cac dong NewsTag truoc
        newsArticleRepository.delete(news);
    }

    private Set<Tag> resolveTags(List<Integer> tagIds) {
        Set<Tag> tags = new HashSet<>();
        if (tagIds != null) {
            for (Integer tagId : tagIds) {
                tags.add(tagRepository.findById(tagId)
                        .orElseThrow(() -> new ResourceNotFoundException("Tag not found with id " + tagId)));
            }
        }
        return tags;
    }

    private NewsArticle findNews(String id) {
        return newsArticleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("News article not found with id " + id));
    }

    private Category findCategory(Short id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id " + id));
    }

    private SystemAccount findAccount(Short id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id " + id));
    }
}
```

### 📄 `backend/src/main/java/com/fu/a2/service/TagService.java`

```java
package com.fu.a2.service;

import com.fu.a2.entity.Tag;
import com.fu.a2.repository.TagRepository;
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
```

### ✅ Checklist kiểm tra

- [ ] Xóa account đã tạo bài → `ConflictException`; xóa category đang dùng → `ConflictException`
- [ ] Login sai → `UnauthorizedException`; không tìm thấy id → `ResourceNotFoundException`
- [ ] Create news tự set `createdDate`; update tự set `modifiedDate` + `updatedById`
- [ ] Delete news gọi `tags.clear()` trước — không lỗi FK với bảng NewsTag
- [ ] Create account chặn trùng `accountId` và trùng email

### 📌 Commit

```
feat(TODO-05): implement service layer with business rules
```

---

## TODO-06 — REST Controller + GlobalExceptionHandler + CORS

5 controller theo bảng API chuẩn. `@Valid @RequestBody` trên mọi POST/PUT; POST trả 201, DELETE trả 204. Handler tập trung map exception → status code. CORS mở cho React (port 5173).

### 📄 `backend/src/main/java/com/fu/a2/controller/AuthController.java`

```java
package com.fu.a2.controller;

import com.fu.a2.dto.AccountResponse;
import com.fu.a2.dto.LoginRequest;
import com.fu.a2.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * TODO-06: REST Controller - Auth
 * POST /api/auth/login
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public AccountResponse login(@Valid @RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
```

### 📄 `backend/src/main/java/com/fu/a2/controller/AccountController.java`

```java
package com.fu.a2.controller;

import com.fu.a2.dto.AccountRequest;
import com.fu.a2.dto.AccountResponse;
import com.fu.a2.service.AccountService;
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
```

### 📄 `backend/src/main/java/com/fu/a2/controller/CategoryController.java`

```java
package com.fu.a2.controller;

import com.fu.a2.dto.CategoryRequest;
import com.fu.a2.dto.CategoryResponse;
import com.fu.a2.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * TODO-06: REST Controller - Category management (Staff)
 * GET    /api/categories            - danh sach
 * GET    /api/categories/{id}       - chi tiet
 * GET    /api/categories/search?q=  - tim kiem theo ten
 * POST   /api/categories            - tao moi (201)
 * PUT    /api/categories/{id}       - cap nhat
 * DELETE /api/categories/{id}       - xoa (204; 409 neu dang duoc dung)
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public List<CategoryResponse> getAll() {
        return categoryService.getAll();
    }

    @GetMapping("/{id}")
    public CategoryResponse getById(@PathVariable Short id) {
        return categoryService.getById(id);
    }

    @GetMapping("/search")
    public List<CategoryResponse> search(@RequestParam("q") String keyword) {
        return categoryService.search(keyword);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CategoryResponse create(@Valid @RequestBody CategoryRequest request) {
        return categoryService.create(request);
    }

    @PutMapping("/{id}")
    public CategoryResponse update(@PathVariable Short id, @Valid @RequestBody CategoryRequest request) {
        return categoryService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Short id) {
        categoryService.delete(id);
    }
}
```

### 📄 `backend/src/main/java/com/fu/a2/controller/NewsArticleController.java`

```java
package com.fu.a2.controller;

import com.fu.a2.dto.NewsArticleRequest;
import com.fu.a2.dto.NewsArticleResponse;
import com.fu.a2.service.NewsArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * TODO-06: REST Controller - News article management
 * GET    /api/news/public               - PUBLIC, tin active, khong can dang nhap
 * GET    /api/news                      - danh sach (Staff)
 * GET    /api/news/{id}                 - chi tiet
 * GET    /api/news/search?q=            - tim kiem theo title/headline
 * GET    /api/news/history/{accountId}  - lich su tin cua 1 staff
 * POST   /api/news                      - tao moi (201)
 * PUT    /api/news/{id}                 - cap nhat
 * DELETE /api/news/{id}                 - xoa (204)
 */
@RestController
@RequestMapping("/api/news")
@RequiredArgsConstructor
public class NewsArticleController {

    private final NewsArticleService newsArticleService;

    @GetMapping("/public")
    public List<NewsArticleResponse> getPublicNews() {
        return newsArticleService.getPublicNews();
    }

    @GetMapping
    public List<NewsArticleResponse> getAll() {
        return newsArticleService.getAll();
    }

    @GetMapping("/{id}")
    public NewsArticleResponse getById(@PathVariable String id) {
        return newsArticleService.getById(id);
    }

    @GetMapping("/search")
    public List<NewsArticleResponse> search(@RequestParam("q") String keyword) {
        return newsArticleService.search(keyword);
    }

    @GetMapping("/history/{accountId}")
    public List<NewsArticleResponse> getHistory(@PathVariable Short accountId) {
        return newsArticleService.getHistoryByAccount(accountId);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public NewsArticleResponse create(@Valid @RequestBody NewsArticleRequest request) {
        return newsArticleService.create(request);
    }

    @PutMapping("/{id}")
    public NewsArticleResponse update(@PathVariable String id, @Valid @RequestBody NewsArticleRequest request) {
        return newsArticleService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        newsArticleService.delete(id);
    }
}
```

### 📄 `backend/src/main/java/com/fu/a2/controller/TagController.java`

```java
package com.fu.a2.controller;

import com.fu.a2.entity.Tag;
import com.fu.a2.service.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * TODO-06: REST Controller - Tag
 * GET /api/tags - danh sach tag (de gan vao news article)
 */
@RestController
@RequestMapping("/api/tags")
@RequiredArgsConstructor
public class TagController {

    private final TagService tagService;

    @GetMapping
    public List<Tag> getAll() {
        return tagService.getAll();
    }
}
```

### 📄 `backend/src/main/java/com/fu/a2/exception/GlobalExceptionHandler.java`

```java
package com.fu.a2.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * TODO-06: Xu ly loi tap trung, tra JSON thong nhat cho client.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private Map<String, Object> body(int status, Object message) {
        Map<String, Object> map = new HashMap<>();
        map.put("timestamp", LocalDateTime.now().toString());
        map.put("status", status);
        map.put("message", message);
        return map;
    }

    // 400 - loi validation (@Valid)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(fe -> errors.put(fe.getField(), fe.getDefaultMessage()));
        return ResponseEntity.badRequest().body(body(400, errors));
    }

    // 404 - khong tim thay
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body(404, ex.getMessage()));
    }

    // 409 - vi pham rang buoc nghiep vu
    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<Map<String, Object>> handleConflict(ConflictException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body(409, ex.getMessage()));
    }

    // 401 - sai email/password
    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<Map<String, Object>> handleUnauthorized(UnauthorizedException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body(401, ex.getMessage()));
    }
}
```

### 📄 `backend/src/main/java/com/fu/a2/config/CorsConfig.java`

```java
package com.fu.a2.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * TODO-06: Cho phep React client (http://localhost:5173) goi API.
 */
@Configuration
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*");
    }
}
```

### ✅ Checklist kiểm tra

- [ ] Đủ 20 endpoint theo bảng API (mục 1.3 file HuongDan_Assignment2.md)
- [ ] POST trả 201, DELETE trả 204, body thiếu field → 400 kèm map lỗi từng field
- [ ] 409 khi vi phạm ràng buộc xóa/trùng; 404 khi không tìm thấy; 401 khi login sai
- [ ] Không còn try-catch lặp trong controller (đã có `@RestControllerAdvice`)
- [ ] FE gọi API từ localhost:5173 không bị lỗi CORS

### 📌 Commit

```
feat(TODO-06): add REST controllers, global exception handler and CORS config
```

---

## TODO-07 — Kiểm thử Postman toàn bộ API

Không có code mới. Import `postman/A2_FUNewsManagement.postman_collection.json` và chạy 29 request theo hướng dẫn chi tiết trong **HuongDanPostman.md**. Chỉ chuyển sang FE khi tất cả pass.

### ✅ Checklist kiểm tra

- [ ] Run collection → 0 failed (29/29 request pass)
- [ ] Đã kiểm tra đủ case: 200/201/204 + 400 validation + 401 login + 404 not found + 409 conflict
- [ ] Chụp màn hình Collection Runner làm minh chứng

### 📌 Commit

```
test(TODO-07): verify all endpoints with postman collection
```

---

## TODO-08 — Tạo React project (Vite) + axios services

Tạo project: `npm create vite@latest A2StudentName_ClassCode -- --template react`, cài `axios react-router-dom bootstrap react-bootstrap`. Mọi request đi qua tầng services — không hardcode URL trong component.

### 📄 `frontend/package.json`

```json
{
  "name": "a2studentname_classcode",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "axios": "^1.6.8",
    "bootstrap": "^5.3.3",
    "react": "^18.2.0",
    "react-bootstrap": "^2.10.2",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.23.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.66",
    "@types/react-dom": "^18.2.22",
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^4.5.3"
  }
}
```

### 📄 `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  }
})
```

### 📄 `frontend/index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>FU News Management System</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 📄 `frontend/src/main.jsx`

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

### 📄 `frontend/src/services/api.js`

```javascript
// TODO-08: axios instance dung chung
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' }
})

export default api
```

### 📄 `frontend/src/services/authService.js`

```javascript
// TODO-08: goi API dang nhap
import api from './api'

export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password })
  return response.data
}
```

### 📄 `frontend/src/services/accountService.js`

```javascript
// TODO-08: goi API quan ly account
import api from './api'

export async function getAccounts() {
  const response = await api.get('/accounts')
  return response.data
}

export async function getAccountById(id) {
  const response = await api.get(`/accounts/${id}`)
  return response.data
}

export async function searchAccounts(keyword) {
  const response = await api.get('/accounts/search', { params: { q: keyword } })
  return response.data
}

export async function createAccount(account) {
  const response = await api.post('/accounts', account)
  return response.data
}

export async function updateAccount(id, account) {
  const response = await api.put(`/accounts/${id}`, account)
  return response.data
}

export async function deleteAccount(id) {
  await api.delete(`/accounts/${id}`)
}
```

### 📄 `frontend/src/services/categoryService.js`

```javascript
// TODO-08: goi API quan ly category
import api from './api'

export async function getCategories() {
  const response = await api.get('/categories')
  return response.data
}

export async function searchCategories(keyword) {
  const response = await api.get('/categories/search', { params: { q: keyword } })
  return response.data
}

export async function createCategory(category) {
  const response = await api.post('/categories', category)
  return response.data
}

export async function updateCategory(id, category) {
  const response = await api.put(`/categories/${id}`, category)
  return response.data
}

export async function deleteCategory(id) {
  await api.delete(`/categories/${id}`)
}
```

### 📄 `frontend/src/services/newsService.js`

```javascript
// TODO-08: goi API quan ly news article
import api from './api'

export async function getPublicNews() {
  const response = await api.get('/news/public')
  return response.data
}

export async function getNews() {
  const response = await api.get('/news')
  return response.data
}

export async function getNewsById(id) {
  const response = await api.get(`/news/${id}`)
  return response.data
}

export async function searchNews(keyword) {
  const response = await api.get('/news/search', { params: { q: keyword } })
  return response.data
}

export async function getNewsHistory(accountId) {
  const response = await api.get(`/news/history/${accountId}`)
  return response.data
}

export async function createNews(news) {
  const response = await api.post('/news', news)
  return response.data
}

export async function updateNews(id, news) {
  const response = await api.put(`/news/${id}`, news)
  return response.data
}

export async function deleteNews(id) {
  await api.delete(`/news/${id}`)
}
```

### 📄 `frontend/src/services/tagService.js`

```javascript
// TODO-08: goi API lay danh sach tag
import api from './api'

export async function getTags() {
  const response = await api.get('/tags')
  return response.data
}
```

### ✅ Checklist kiểm tra

- [ ] `npm run dev` chạy tại http://localhost:5173
- [ ] axios instance dùng chung `baseURL: http://localhost:8080/api`
- [ ] Mỗi resource có đủ hàm get/search/create/update/delete, named export, async/await
- [ ] Không hardcode URL trong component

### 📌 Commit

```
chore(TODO-08): init react vite project and axios services
```

---

## TODO-09 — AuthContext + Login + Router phân quyền

AuthContext lưu user vào localStorage (F5 không mất đăng nhập). ProtectedRoute chặn theo role (1 = Admin, 2 = Staff). Header hiện menu đúng role. Login thành công điều hướng Admin → /accounts, Staff → /news.

### 📄 `frontend/src/context/AuthContext.jsx`

```jsx
// TODO-09: Quan ly trang thai dang nhap toan app
import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (account) => {
    setUser(account)
    localStorage.setItem('user', JSON.stringify(account))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const isAdmin = user?.accountRole === 1
  const isStaff = user?.accountRole === 2

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin, isStaff }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
```

### 📄 `frontend/src/components/ProtectedRoute.jsx`

```jsx
// TODO-09: Chan truy cap theo role (1 = Admin, 2 = Staff)
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }
  if (roles && !roles.includes(user.accountRole)) {
    return <Navigate to="/" replace />
  }
  return children
}

export default ProtectedRoute
```

### 📄 `frontend/src/components/Header.jsx`

```jsx
// TODO-09: Thanh dieu huong theo role
import { Container, Nav, Navbar, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Header() {
  const { user, logout, isAdmin, isStaff } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">FU News</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            {isAdmin && <Nav.Link as={Link} to="/accounts">Accounts</Nav.Link>}
            {isStaff && (
              <>
                <Nav.Link as={Link} to="/categories">Categories</Nav.Link>
                <Nav.Link as={Link} to="/news">News Articles</Nav.Link>
                <Nav.Link as={Link} to="/history">My News History</Nav.Link>
                <Nav.Link as={Link} to="/profile">Profile</Nav.Link>
              </>
            )}
          </Nav>
          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-3">
                  {user.accountName} ({user.accountRole === 1 ? 'Admin' : 'Staff'})
                </Navbar.Text>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header
```

### 📄 `frontend/src/pages/LoginPage.jsx`

```jsx
// TODO-09: Dang nhap bang Email + Password
import { useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { login as loginApi } from '../services/authService'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const account = await loginApi(email, password)
      login(account)
      navigate(account.accountRole === 1 ? '/accounts' : '/news')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <Container style={{ maxWidth: 420 }}>
      <Card>
        <Card.Body>
          <Card.Title className="mb-3">Login</Card.Title>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default LoginPage
```

### 📄 `frontend/src/App.jsx`

```jsx
// TODO-09: Router + role-based routes
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import AccountManagementPage from './pages/AccountManagementPage'
import CategoryManagementPage from './pages/CategoryManagementPage'
import NewsManagementPage from './pages/NewsManagementPage'
import NewsHistoryPage from './pages/NewsHistoryPage'
import ProfilePage from './pages/ProfilePage'

const ADMIN = 1
const STAFF = 2

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/accounts" element={
            <ProtectedRoute roles={[ADMIN]}><AccountManagementPage /></ProtectedRoute>
          } />
          <Route path="/categories" element={
            <ProtectedRoute roles={[STAFF]}><CategoryManagementPage /></ProtectedRoute>
          } />
          <Route path="/news" element={
            <ProtectedRoute roles={[STAFF]}><NewsManagementPage /></ProtectedRoute>
          } />
          <Route path="/history" element={
            <ProtectedRoute roles={[STAFF]}><NewsHistoryPage /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute roles={[STAFF]}><ProfilePage /></ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
```

### ✅ Checklist kiểm tra

- [ ] Login đúng → điều hướng theo role; sai → hiện lỗi từ API (Alert đỏ)
- [ ] F5 không mất đăng nhập (localStorage)
- [ ] Staff gõ tay `/accounts` bị đẩy về `/`; chưa login vào `/news` bị đẩy về `/login`
- [ ] Navbar chỉ hiện menu đúng role, có nút Logout

### 📌 Commit

```
feat(TODO-09): add auth context, login page and role-based routing
```

---

## TODO-10 — Trang tin công khai (không cần đăng nhập)

Gọi `/news/public` (chỉ trả tin active) trong `useEffect`, hiển thị Card grid, có trạng thái loading (Spinner) và error (Alert).

### 📄 `frontend/src/pages/HomePage.jsx`

```jsx
// TODO-10: Trang public - xem tin active, khong can dang nhap
import { useEffect, useState } from 'react'
import { Alert, Badge, Card, Col, Container, Row, Spinner } from 'react-bootstrap'
import { getPublicNews } from '../services/newsService'

function HomePage() {
  const [newsList, setNewsList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getPublicNews()
      .then(setNewsList)
      .catch(() => setError('Cannot load news. Is the API running?'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Container className="text-center"><Spinner animation="border" /></Container>
  if (error) return <Container><Alert variant="danger">{error}</Alert></Container>

  return (
    <Container>
      <h2 className="mb-4">Latest News</h2>
      <Row xs={1} md={2} className="g-4">
        {newsList.map((news) => (
          <Col key={news.newsArticleId}>
            <Card className="h-100">
              <Card.Body>
                <Card.Title>{news.newsTitle}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  {news.categoryName} | {news.createdDate?.substring(0, 10)} | by {news.createdByName}
                </Card.Subtitle>
                <Card.Text>{news.newsContent?.substring(0, 200)}...</Card.Text>
                {news.tags.map((tag) => (
                  <Badge bg="secondary" className="me-1" key={tag.tagId}>
                    {tag.tagName}
                  </Badge>
                ))}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  )
}

export default HomePage
```

### ✅ Checklist kiểm tra

- [ ] Mở `/` khi CHƯA login vẫn xem được tin
- [ ] Chỉ hiện tin `newsStatus = true`
- [ ] Tắt BE → hiện thông báo lỗi, không trắng trang
- [ ] Card hiện đủ: title, category, ngày tạo, người tạo, tags

### 📌 Commit

```
feat(TODO-10): add public news page without authentication
```

---

## TODO-11 — Account Management (Admin): CRUD + Search + Modal + Confirm

Bảng + search + nút Add. Create/Update qua popup dialog (AccountModal) — ID disable khi update, validate đủ field. Delete luôn qua ConfirmModal; account đã tạo bài → API trả 409 → hiện Alert.

### 📄 `frontend/src/pages/AccountManagementPage.jsx`

```jsx
// TODO-11: Account Management (Admin) - CRUD + Search, popup dialog, confirm delete
import { useEffect, useState } from 'react'
import { Alert, Button, Container, Form, InputGroup, Table } from 'react-bootstrap'
import {
  getAccounts, searchAccounts, createAccount, updateAccount, deleteAccount
} from '../services/accountService'
import AccountModal from '../components/AccountModal'
import ConfirmModal from '../components/ConfirmModal'

function AccountManagementPage() {
  const [accounts, setAccounts] = useState([])
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingAccount, setEditingAccount] = useState(null)
  const [deletingAccount, setDeletingAccount] = useState(null)

  const loadAccounts = async () => {
    try {
      setError('')
      const data = keyword.trim() ? await searchAccounts(keyword.trim()) : await getAccounts()
      setAccounts(data)
    } catch {
      setError('Cannot load accounts')
    }
  }

  useEffect(() => {
    loadAccounts()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    loadAccounts()
  }

  const handleSave = async (form) => {
    try {
      if (editingAccount) {
        await updateAccount(editingAccount.accountId, form)
      } else {
        await createAccount(form)
      }
      setShowModal(false)
      setEditingAccount(null)
      loadAccounts()
    } catch (err) {
      throw new Error(JSON.stringify(err.response?.data?.message || 'Save failed'))
    }
  }

  const handleDelete = async () => {
    try {
      await deleteAccount(deletingAccount.accountId)
      setDeletingAccount(null)
      loadAccounts()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
      setDeletingAccount(null)
    }
  }

  return (
    <Container>
      <h2 className="mb-4">Account Management</h2>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Form onSubmit={handleSearch} style={{ maxWidth: 400 }}>
          <InputGroup>
            <Form.Control
              placeholder="Search by name or email..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" variant="outline-primary">Search</Button>
          </InputGroup>
        </Form>
        <Button onClick={() => { setEditingAccount(null); setShowModal(true) }}>
          + Add Account
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map((acc) => (
            <tr key={acc.accountId}>
              <td>{acc.accountId}</td>
              <td>{acc.accountName}</td>
              <td>{acc.accountEmail}</td>
              <td>{acc.accountRole === 1 ? 'Admin' : 'Staff'}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2"
                  onClick={() => { setEditingAccount(acc); setShowModal(true) }}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeletingAccount(acc)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <AccountModal
        show={showModal}
        account={editingAccount}
        onSave={handleSave}
        onClose={() => { setShowModal(false); setEditingAccount(null) }}
      />
      <ConfirmModal
        show={!!deletingAccount}
        message={`Delete account "${deletingAccount?.accountName}"? An account that has created news articles cannot be deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingAccount(null)}
      />
    </Container>
  )
}

export default AccountManagementPage
```

### 📄 `frontend/src/components/AccountModal.jsx`

```jsx
// TODO-11: Popup dialog Create/Update account + validate
import { useEffect, useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'

const emptyForm = { accountId: '', accountName: '', accountEmail: '', accountRole: 2, accountPassword: '' }

function AccountModal({ show, account, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (show) {
      setError('')
      setForm(account
        ? { ...account, accountPassword: '' }
        : emptyForm)
    }
  }, [show, account])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await onSave({
        accountId: Number(form.accountId),
        accountName: form.accountName,
        accountEmail: form.accountEmail,
        accountRole: Number(form.accountRole),
        accountPassword: form.accountPassword
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{account ? 'Update Account' : 'Create Account'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Account ID</Form.Label>
            <Form.Control type="number" name="accountId" value={form.accountId}
              onChange={handleChange} required disabled={!!account} min={1} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control name="accountName" value={form.accountName}
              onChange={handleChange} required maxLength={100} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" name="accountEmail" value={form.accountEmail}
              onChange={handleChange} required maxLength={70} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select name="accountRole" value={form.accountRole} onChange={handleChange}>
              <option value={1}>Admin</option>
              <option value={2}>Staff</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" name="accountPassword" value={form.accountPassword}
              onChange={handleChange} required maxLength={70} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default AccountModal
```

### 📄 `frontend/src/components/ConfirmModal.jsx`

```jsx
// TODO-11: Modal xac nhan truoc khi xoa (Delete always combines with confirmation)
import { Button, Modal } from 'react-bootstrap'

function ConfirmModal({ show, title, message, onConfirm, onCancel }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || 'Confirm Delete'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{message || 'Are you sure you want to delete this item?'}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Delete</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default ConfirmModal
```

### ✅ Checklist kiểm tra

- [ ] Create/Update mở popup, thành công thì đóng modal + reload bảng
- [ ] Delete luôn hỏi xác nhận; account có bài viết báo lỗi 409 rõ ràng
- [ ] Search theo tên/email hoạt động
- [ ] Validate: email đúng định dạng, required, maxLength; lỗi API hiện trong modal

### 📌 Commit

```
feat(TODO-11): add account management for admin with modal and confirm delete
```

---

## TODO-12 — Category Management (Staff)

Tương tự TODO-11, thêm dropdown Parent Category (loại chính nó khi update) và switch Active. Xóa category đang dùng → 409.

### 📄 `frontend/src/pages/CategoryManagementPage.jsx`

```jsx
// TODO-12: Category Management (Staff) - CRUD + Search, popup dialog, confirm delete
import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Container, Form, InputGroup, Table } from 'react-bootstrap'
import {
  getCategories, searchCategories, createCategory, updateCategory, deleteCategory
} from '../services/categoryService'
import CategoryModal from '../components/CategoryModal'
import ConfirmModal from '../components/ConfirmModal'

function CategoryManagementPage() {
  const [categories, setCategories] = useState([])
  const [allCategories, setAllCategories] = useState([]) // cho dropdown parent
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [deletingCategory, setDeletingCategory] = useState(null)

  const loadCategories = async () => {
    try {
      setError('')
      const data = keyword.trim() ? await searchCategories(keyword.trim()) : await getCategories()
      setCategories(data)
      if (!keyword.trim()) setAllCategories(data)
    } catch {
      setError('Cannot load categories')
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    loadCategories()
  }

  const handleSave = async (form) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.categoryId, form)
      } else {
        await createCategory(form)
      }
      setShowModal(false)
      setEditingCategory(null)
      loadCategories()
    } catch (err) {
      throw new Error(JSON.stringify(err.response?.data?.message || 'Save failed'))
    }
  }

  const handleDelete = async () => {
    try {
      await deleteCategory(deletingCategory.categoryId)
      setDeletingCategory(null)
      loadCategories()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
      setDeletingCategory(null)
    }
  }

  return (
    <Container>
      <h2 className="mb-4">Category Management</h2>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Form onSubmit={handleSearch} style={{ maxWidth: 400 }}>
          <InputGroup>
            <Form.Control
              placeholder="Search by category name..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" variant="outline-primary">Search</Button>
          </InputGroup>
        </Form>
        <Button onClick={() => { setEditingCategory(null); setShowModal(true) }}>
          + Add Category
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Name</th><th>Description</th><th>Parent</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.categoryId}>
              <td>{cat.categoryId}</td>
              <td>{cat.categoryName}</td>
              <td>{cat.categoryDescription}</td>
              <td>{cat.parentCategoryName || '-'}</td>
              <td>
                <Badge bg={cat.isActive ? 'success' : 'secondary'}>
                  {cat.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <Button size="sm" variant="warning" className="me-2"
                  onClick={() => { setEditingCategory(cat); setShowModal(true) }}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeletingCategory(cat)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <CategoryModal
        show={showModal}
        category={editingCategory}
        categories={allCategories}
        onSave={handleSave}
        onClose={() => { setShowModal(false); setEditingCategory(null) }}
      />
      <ConfirmModal
        show={!!deletingCategory}
        message={`Delete category "${deletingCategory?.categoryName}"? A category used by news articles cannot be deleted.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingCategory(null)}
      />
    </Container>
  )
}

export default CategoryManagementPage
```

### 📄 `frontend/src/components/CategoryModal.jsx`

```jsx
// TODO-12: Popup dialog Create/Update category + validate
import { useEffect, useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'

const emptyForm = { categoryName: '', categoryDescription: '', parentCategoryId: '', isActive: true }

function CategoryModal({ show, category, categories, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (show) {
      setError('')
      setForm(category
        ? {
            categoryName: category.categoryName,
            categoryDescription: category.categoryDescription,
            parentCategoryId: category.parentCategoryId ?? '',
            isActive: category.isActive
          }
        : emptyForm)
    }
  }, [show, category])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await onSave({
        categoryName: form.categoryName,
        categoryDescription: form.categoryDescription,
        parentCategoryId: form.parentCategoryId === '' ? null : Number(form.parentCategoryId),
        isActive: form.isActive
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{category ? 'Update Category' : 'Create Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3">
            <Form.Label>Category Name</Form.Label>
            <Form.Control value={form.categoryName} required maxLength={100}
              onChange={(e) => setForm({ ...form, categoryName: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={form.categoryDescription} required maxLength={250}
              onChange={(e) => setForm({ ...form, categoryDescription: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Parent Category</Form.Label>
            <Form.Select value={form.parentCategoryId}
              onChange={(e) => setForm({ ...form, parentCategoryId: e.target.value })}>
              <option value="">-- None --</option>
              {categories
                .filter((c) => c.categoryId !== category?.categoryId)
                .map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                ))}
            </Form.Select>
          </Form.Group>
          <Form.Check
            type="switch"
            label="Active"
            checked={form.isActive}
            onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default CategoryModal
```

### ✅ Checklist kiểm tra

- [ ] CRUD + Search hoạt động, popup + confirm đầy đủ
- [ ] Không chọn được chính nó làm parent
- [ ] Xóa category đang dùng bị chặn kèm thông báo 409
- [ ] Badge Active/Inactive hiển thị đúng

### 📌 Commit

```
feat(TODO-12): add category management for staff
```

---

## TODO-13 — News Article Management (Staff, kèm tags)

Modal size lg với đủ field + Category (select) + Tags (checkbox nhiều lựa chọn) + switch Active. Khi save gắn `createdById` từ user đang đăng nhập.

### 📄 `frontend/src/pages/NewsManagementPage.jsx`

```jsx
// TODO-13: News Article Management (Staff) - CRUD + Search + tags, popup dialog, confirm delete
import { useEffect, useState } from 'react'
import { Alert, Badge, Button, Container, Form, InputGroup, Table } from 'react-bootstrap'
import { getNews, searchNews, createNews, updateNews, deleteNews } from '../services/newsService'
import { getCategories } from '../services/categoryService'
import { getTags } from '../services/tagService'
import { useAuth } from '../context/AuthContext'
import NewsModal from '../components/NewsModal'
import ConfirmModal from '../components/ConfirmModal'

function NewsManagementPage() {
  const [newsList, setNewsList] = useState([])
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [keyword, setKeyword] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingNews, setEditingNews] = useState(null)
  const [deletingNews, setDeletingNews] = useState(null)
  const { user } = useAuth()

  const loadNews = async () => {
    try {
      setError('')
      const data = keyword.trim() ? await searchNews(keyword.trim()) : await getNews()
      setNewsList(data)
    } catch {
      setError('Cannot load news articles')
    }
  }

  useEffect(() => {
    loadNews()
    getCategories().then(setCategories).catch(() => {})
    getTags().then(setTags).catch(() => {})
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    loadNews()
  }

  const handleSave = async (form) => {
    try {
      const payload = { ...form, createdById: user.accountId }
      if (editingNews) {
        await updateNews(editingNews.newsArticleId, payload)
      } else {
        await createNews(payload)
      }
      setShowModal(false)
      setEditingNews(null)
      loadNews()
    } catch (err) {
      throw new Error(JSON.stringify(err.response?.data?.message || 'Save failed'))
    }
  }

  const handleDelete = async () => {
    try {
      await deleteNews(deletingNews.newsArticleId)
      setDeletingNews(null)
      loadNews()
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed')
      setDeletingNews(null)
    }
  }

  return (
    <Container>
      <h2 className="mb-4">News Article Management</h2>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

      <div className="d-flex justify-content-between mb-3">
        <Form onSubmit={handleSearch} style={{ maxWidth: 400 }}>
          <InputGroup>
            <Form.Control
              placeholder="Search by title or headline..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <Button type="submit" variant="outline-primary">Search</Button>
          </InputGroup>
        </Form>
        <Button onClick={() => { setEditingNews(null); setShowModal(true) }}>
          + Add News
        </Button>
      </div>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Title</th><th>Category</th><th>Tags</th><th>Status</th><th>Created By</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {newsList.map((news) => (
            <tr key={news.newsArticleId}>
              <td>{news.newsArticleId}</td>
              <td>{news.newsTitle}</td>
              <td>{news.categoryName}</td>
              <td>
                {news.tags.map((tag) => (
                  <Badge bg="info" className="me-1" key={tag.tagId}>{tag.tagName}</Badge>
                ))}
              </td>
              <td>
                <Badge bg={news.newsStatus ? 'success' : 'secondary'}>
                  {news.newsStatus ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>{news.createdByName}</td>
              <td>
                <Button size="sm" variant="warning" className="me-2"
                  onClick={() => { setEditingNews(news); setShowModal(true) }}>
                  Edit
                </Button>
                <Button size="sm" variant="danger" onClick={() => setDeletingNews(news)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <NewsModal
        show={showModal}
        news={editingNews}
        categories={categories}
        tags={tags}
        onSave={handleSave}
        onClose={() => { setShowModal(false); setEditingNews(null) }}
      />
      <ConfirmModal
        show={!!deletingNews}
        message={`Delete news article "${deletingNews?.newsTitle}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingNews(null)}
      />
    </Container>
  )
}

export default NewsManagementPage
```

### 📄 `frontend/src/components/NewsModal.jsx`

```jsx
// TODO-13: Popup dialog Create/Update news article (kem tags) + validate
import { useEffect, useState } from 'react'
import { Alert, Button, Col, Form, Modal, Row } from 'react-bootstrap'

const emptyForm = {
  newsArticleId: '', newsTitle: '', headline: '', newsContent: '',
  newsSource: '', categoryId: '', newsStatus: true, tagIds: []
}

function NewsModal({ show, news, categories, tags, onSave, onClose }) {
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  useEffect(() => {
    if (show) {
      setError('')
      setForm(news
        ? {
            newsArticleId: news.newsArticleId,
            newsTitle: news.newsTitle ?? '',
            headline: news.headline ?? '',
            newsContent: news.newsContent ?? '',
            newsSource: news.newsSource ?? '',
            categoryId: news.categoryId ?? '',
            newsStatus: !!news.newsStatus,
            tagIds: news.tags.map((t) => t.tagId)
          }
        : emptyForm)
    }
  }, [show, news])

  const toggleTag = (tagId) => {
    setForm((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await onSave({
        newsArticleId: form.newsArticleId,
        newsTitle: form.newsTitle,
        headline: form.headline,
        newsContent: form.newsContent,
        newsSource: form.newsSource,
        categoryId: Number(form.categoryId),
        newsStatus: form.newsStatus,
        tagIds: form.tagIds
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <Modal show={show} onHide={onClose} centered size="lg">
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>{news ? 'Update News Article' : 'Create News Article'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>News ID</Form.Label>
                <Form.Control value={form.newsArticleId} required maxLength={20} disabled={!!news}
                  onChange={(e) => setForm({ ...form, newsArticleId: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Title</Form.Label>
                <Form.Control value={form.newsTitle} required maxLength={400}
                  onChange={(e) => setForm({ ...form, newsTitle: e.target.value })} />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Headline</Form.Label>
            <Form.Control value={form.headline} required maxLength={150}
              onChange={(e) => setForm({ ...form, headline: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Content</Form.Label>
            <Form.Control as="textarea" rows={5} value={form.newsContent} maxLength={4000}
              onChange={(e) => setForm({ ...form, newsContent: e.target.value })} />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Source</Form.Label>
                <Form.Control value={form.newsSource} maxLength={400}
                  onChange={(e) => setForm({ ...form, newsSource: e.target.value })} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select value={form.categoryId} required
                  onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
                  <option value="">-- Select category --</option>
                  {categories.map((c) => (
                    <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>Tags</Form.Label>
            <div>
              {tags.map((tag) => (
                <Form.Check
                  inline
                  key={tag.tagId}
                  type="checkbox"
                  label={tag.tagName}
                  checked={form.tagIds.includes(tag.tagId)}
                  onChange={() => toggleTag(tag.tagId)}
                />
              ))}
            </div>
          </Form.Group>
          <Form.Check
            type="switch"
            label="Active"
            checked={form.newsStatus}
            onChange={(e) => setForm({ ...form, newsStatus: e.target.checked })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default NewsModal
```

### ✅ Checklist kiểm tra

- [ ] Tạo tin có tags → bảng hiện đúng tags (Badge)
- [ ] Update đổi tags/category/status thành công; bảng `NewsTag` trong DB cập nhật đúng
- [ ] Tin active mới tạo xuất hiện ở HomePage; đổi sang inactive thì biến mất
- [ ] Delete có confirm, xóa xong reload bảng

### 📌 Commit

```
feat(TODO-13): add news article management with tags
```

---

## TODO-14 — Profile + News History (Staff)

Profile: sửa Name/Email/Password của chính mình (giữ nguyên role), thành công cập nhật lại AuthContext. History: bảng tin do chính staff đang đăng nhập tạo.

### 📄 `frontend/src/pages/ProfilePage.jsx`

```jsx
// TODO-14: Staff quan ly profile cua chinh minh
import { useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import { updateAccount } from '../services/accountService'
import { useAuth } from '../context/AuthContext'

function ProfilePage() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({
    accountName: user.accountName,
    accountEmail: user.accountEmail,
    accountPassword: ''
  })
  const [message, setMessage] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    try {
      const updated = await updateAccount(user.accountId, {
        accountId: user.accountId,
        accountName: form.accountName,
        accountEmail: form.accountEmail,
        accountRole: user.accountRole,
        accountPassword: form.accountPassword
      })
      login(updated) // cap nhat lai context + localStorage
      setForm((prev) => ({ ...prev, accountPassword: '' }))
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (err) {
      setMessage({
        type: 'danger',
        text: JSON.stringify(err.response?.data?.message || 'Update failed')
      })
    }
  }

  return (
    <Container style={{ maxWidth: 480 }}>
      <Card>
        <Card.Body>
          <Card.Title className="mb-3">My Profile</Card.Title>
          {message && <Alert variant={message.type}>{message.text}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Account ID</Form.Label>
              <Form.Control value={user.accountId} disabled />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control value={form.accountName} required maxLength={100}
                onChange={(e) => setForm({ ...form, accountName: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={form.accountEmail} required maxLength={70}
                onChange={(e) => setForm({ ...form, accountEmail: e.target.value })} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control type="password" value={form.accountPassword} required maxLength={70}
                placeholder="Enter password to confirm changes"
                onChange={(e) => setForm({ ...form, accountPassword: e.target.value })} />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100">Update Profile</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default ProfilePage
```

### 📄 `frontend/src/pages/NewsHistoryPage.jsx`

```jsx
// TODO-14: Lich su tin da tao boi staff dang dang nhap
import { useEffect, useState } from 'react'
import { Alert, Badge, Container, Table } from 'react-bootstrap'
import { getNewsHistory } from '../services/newsService'
import { useAuth } from '../context/AuthContext'

function NewsHistoryPage() {
  const [newsList, setNewsList] = useState([])
  const [error, setError] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    getNewsHistory(user.accountId)
      .then(setNewsList)
      .catch(() => setError('Cannot load news history'))
  }, [user.accountId])

  return (
    <Container>
      <h2 className="mb-4">My News History</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th><th>Title</th><th>Category</th><th>Created</th><th>Modified</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          {newsList.map((news) => (
            <tr key={news.newsArticleId}>
              <td>{news.newsArticleId}</td>
              <td>{news.newsTitle}</td>
              <td>{news.categoryName}</td>
              <td>{news.createdDate?.substring(0, 10)}</td>
              <td>{news.modifiedDate?.substring(0, 10) || '-'}</td>
              <td>
                <Badge bg={news.newsStatus ? 'success' : 'secondary'}>
                  {news.newsStatus ? 'Active' : 'Inactive'}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {newsList.length === 0 && !error && <p className="text-muted">You have not created any news articles yet.</p>}
    </Container>
  )
}

export default NewsHistoryPage
```

### ✅ Checklist kiểm tra

- [ ] Đổi tên trong Profile → tên trên Header đổi theo ngay
- [ ] History chỉ hiện tin của đúng user đang đăng nhập
- [ ] Hiện ngày tạo/ngày sửa/status từng tin

### 📌 Commit

```
feat(TODO-14): add profile page and news history page
```

---

## TODO-15 — Kiểm thử tích hợp FE ↔ BE

Không có code mới. Chạy đồng thời BE (8080) + FE (5173), đi hết kịch bản demo: xem tin public → login Admin CRUD account (thử xóa account 1 bị chặn) → login Staff tạo category + tin kèm tags → kiểm tra HomePage/History/Profile → thử xóa category đang dùng bị chặn.

### ✅ Checklist kiểm tra

- [ ] Toàn bộ checklist mục 5 trong HuongDan_Assignment2.md pass
- [ ] Kịch bản demo 5 phút chạy trơn tru, không lỗi console
- [ ] Lịch sử git đủ 15 commit đúng format `type(TODO-NN): message`

### 📌 Commit

```
test(TODO-15): end-to-end testing FE-BE integration
```

---
