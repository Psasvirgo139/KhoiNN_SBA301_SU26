package fu.sba301.pe2026.config;

import fu.sba301.pe2026.entity.Shoes;
import fu.sba301.pe2026.entity.ShoesCategory;
import fu.sba301.pe2026.repository.ShoesCategoryRepository;
import fu.sba301.pe2026.repository.ShoesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitialization implements CommandLineRunner {
    
    private final ShoesCategoryRepository shoesCategoryRepository;
    private final ShoesRepository shoesRepository;

    @Override
    public void run(String... args) throws Exception {
        if (shoesCategoryRepository.count() == 0) {
            ShoesCategory sport = shoesCategoryRepository.save(new ShoesCategory(0L, "Sport", "Sport shoes for athletic activities"));
            ShoesCategory casual = shoesCategoryRepository.save(new ShoesCategory(0L, "Casual", "Casual shoes for everyday wear"));
            ShoesCategory formal = shoesCategoryRepository.save(new ShoesCategory(0L, "Formal", "Formal shoes for business and events"));
            ShoesCategory running = shoesCategoryRepository.save(new ShoesCategory(0L, "Running", "Running shoes for jogging and marathon"));
            ShoesCategory basketball = shoesCategoryRepository.save(new ShoesCategory(0L, "Basketball", "Basketball shoes for court performance"));
            System.out.println("Initial shoes categories created successfully!");
            

        } else {
            if (shoesRepository.count() == 0) {
                ShoesCategory sport = shoesCategoryRepository.findByCategoryName("Sport");
                ShoesCategory casual = shoesCategoryRepository.findByCategoryName("Casual");
                ShoesCategory formal = shoesCategoryRepository.findByCategoryName("Formal");
                ShoesCategory running = shoesCategoryRepository.findByCategoryName("Running");
                ShoesCategory basketball = shoesCategoryRepository.findByCategoryName("Basketball");
                shoesRepository.saveAll(List.of(
                        new Shoes(0L, "Nike Air Max 270", 150.0, 50, "Nike", new Date(), new Date(), sport),
                        new Shoes(0L, "Adidas Ultraboost", 180.0, 30, "Adidas", new Date(), new Date(), running),
                        new Shoes(0L, "Puma Suede Classic", 80.0, 100, "Puma", new Date(), new Date(), casual),
                        new Shoes(0L, "Nike Air Jordan 1", 200.0, 25, "Nike", new Date(), new Date(), basketball),
                        new Shoes(0L, "Clarks Desert Boot", 120.0, 40, "Clarks", new Date(), new Date(), formal),
                        new Shoes(0L, "New Balance 574", 90.0, 60, "New Balance", new Date(), new Date(), casual),
                        new Shoes(0L, "Asics Gel-Kayano", 160.0, 35, "Asics", new Date(), new Date(), running),
                        new Shoes(0L, "Converse Chuck Taylor", 65.0, 80, "Converse", new Date(), new Date(), casual),
                        new Shoes(0L, "Reebok Classic Leather", 75.0, 70, "Reebok", new Date(), new Date(), sport),
                        new Shoes(0L, "Vans Old Skool", 70.0, 90, "Vans", new Date(), new Date(), casual)
                ));
                System.out.println("Initial shoes data created successfully!");
            }
        }
    }
}
