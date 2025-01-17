package newproject.newproject.repositories;


import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<ProductModel, String> {
    @Query(value = "SELECT * FROM products ORDER BY RANDOM() LIMIT 30", nativeQuery = true)
    List<ProductModel> getAllProductsInRandomOrder();

    ProductModel findByUniqId(UUID uniqId);
    ProductModel findByProductName(String productName);
    List<ProductModel> findByBrand(String brand);

    @Query("SELECT p FROM ProductModel p WHERE p.sellerId = :sellerId ORDER BY RANDOM() LIMIT 15")
    List<ProductModel> findBySellerId(int sellerId);

    @Query("SELECT p FROM ProductModel p WHERE LOWER(p.productName) LIKE LOWER(CONCAT(:name, '%'))")
    List<ProductModel> findByProductNameStartsWith(@Param("name") String name);

    @Query("SELECT p FROM ProductModel p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<ProductModel> findByProductNameContains(@Param("name") String name);

    @Query("SELECT p FROM ProductModel p WHERE p.category LIKE %:name%")
    List<ProductModel> findByCategory(@Param("name") String name);


}
