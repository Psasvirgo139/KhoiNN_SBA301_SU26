package fu.sba301.pe2026.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "shoes")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shoes {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long shoes_id;
    @Column(name = "name", length = 100, nullable = false)
    private String shoesName;
    @Column(name = "price")
    private double price;
    @Column(name = "quantity")
    private int quantity;
    @Column(name = "manufacturer", length = 100, nullable = false)
    private String manufacturer;
    @Column(name = "production_date")
    private Date productionDate;
    @Column(name = "import_date")
    private Date importDate;
    @ManyToOne
    @JoinColumn(name = "category_id")
    private ShoesCategory shoesCategory;
}
