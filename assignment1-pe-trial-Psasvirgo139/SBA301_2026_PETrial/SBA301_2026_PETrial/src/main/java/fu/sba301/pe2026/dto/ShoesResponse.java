package fu.sba301.pe2026.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoesResponse {
    private Long shoesId;
    private String shoesName;
    private double price;
    private int quantity;
    private String manufacturer;
    private Date productionDate;
    private Date importDate;
    private String categoryName;
}
