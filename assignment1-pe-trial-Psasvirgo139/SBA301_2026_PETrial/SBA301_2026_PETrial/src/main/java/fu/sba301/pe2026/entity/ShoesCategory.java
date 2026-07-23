package fu.sba301.pe2026.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "shoes_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoesCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id")
    private long id;
    @Column(name = "category_name")
    private String categoryName;
    @Column(name = "description")
    private String description;
}
