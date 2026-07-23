package fu.sba301.pe2026.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ShoesCategoryResponse {
    private Long id;
    private String categoryName;
    private String description;
}
