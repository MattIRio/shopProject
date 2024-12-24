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
    ProductModel findByUniqId(UUID uniqId);
    ProductModel findByProductName(String productName);

    @Query("SELECT p FROM ProductModel p WHERE LOWER(p.productName) LIKE LOWER(CONCAT(:name, '%'))")
    List<ProductModel> findByProductNameStartingWithIgnoreCase(@Param("name") String name);

    @Query("SELECT p FROM ProductModel p WHERE p.category LIKE %:name%")
    List<ProductModel> findByCategory(@Param("name") String name);


}
