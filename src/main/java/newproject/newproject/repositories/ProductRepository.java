package newproject.newproject.repositories;


import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProductRepository extends JpaRepository<ProductModel, String> {
    @Query(value = "SELECT * FROM products", nativeQuery = true)
    List<ProductModel> getAllProducts(PageRequest pageRequest);

    ProductModel findByUniqId(UUID uniqId);
    ProductModel findByProductName(String productName);
    List<ProductModel> findByBrand(String brand);


    @Query("SELECT p FROM ProductModel p WHERE p.sellerId = :sellerId ORDER BY RANDOM() LIMIT 15")
    List<ProductModel> findBySellerId(int sellerId);

    @Query("SELECT p FROM ProductModel p WHERE LOWER(p.productName) LIKE LOWER(CONCAT(:name, '%'))")
    List<ProductModel> findByProductNameStartsWith(@Param("name") String name);

    @Query("SELECT p FROM ProductModel p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<ProductModel> findByProductNameContains(@Param("name") String name);

    @Query("SELECT p FROM ProductModel p WHERE LOWER(p.productName) LIKE LOWER(CONCAT(:name, '%'))")
    List<ProductModel> getByProductNameStartsWith(@Param("name") String name, PageRequest pageRequest);

    @Query("SELECT p FROM ProductModel p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<ProductModel> getByProductNameContains(@Param("name") String name, PageRequest pageRequest);

    @Query("SELECT p FROM ProductModel p WHERE p.category LIKE %:name%")
    List<ProductModel> findByCategory(@Param("name") String name, PageRequest pageReques);

    @Query("SELECT MAX(p.retailPrice) FROM ProductModel p WHERE p.category LIKE %:category%")
    Integer findMaxPriceInCategory(@Param("category") String category);

    @Query("SELECT MIN(p.retailPrice) FROM ProductModel p WHERE p.category LIKE %:category%")
    Integer findMinPriceInCategory(@Param("category") String category);

    @Query("SELECT MAX(p.retailPrice) FROM ProductModel p WHERE p.category LIKE %:category% AND p.brand IN :brand")
    Integer findMaxPriceInCategoryByBrand(@Param("category") String category, @Param("brand") List<String> brand);

    @Query("SELECT MIN(p.retailPrice) FROM ProductModel p WHERE p.category LIKE %:category% AND p.brand IN :brand")
    Integer findMinPriceInCategoryByBrand(@Param("category") String category, @Param("brand") List<String> brand);

    @Query("SELECT MAX(p.retailPrice) FROM ProductModel p WHERE p.productName LIKE %:productName%")
    Integer findMaxPriceByName(@Param("productName") String productName);

    @Query("SELECT MIN(p.retailPrice) FROM ProductModel p WHERE p.productName LIKE %:productName%")
    Integer findMinPriceByName(@Param("productName") String productName);

    @Query("SELECT MAX(p.retailPrice) FROM ProductModel p WHERE p.productName LIKE %:productName% AND p.brand IN :brand")
    Integer findMaxPriceByNameAndBrand(@Param("productName") String productName, @Param("brand") List<String> brand);

    @Query("SELECT MIN(p.retailPrice) FROM ProductModel p WHERE p.productName LIKE %:productName% AND p.brand IN :brand")
    Integer findMinPriceByNameAndBrand(@Param("productName") String productName, @Param("brand") List<String> brand);

    @Query("SELECT DISTINCT p.brand FROM ProductModel p WHERE p.category LIKE %:name%")
    List<String> findBrandByCategory(@Param("name") String name);

    @Query("SELECT DISTINCT p.brand FROM ProductModel p WHERE p.brand LIKE %:name% AND p.category LIKE %:category%")
    List<String> findBrandByName(@Param("category") String category, @Param("name") String name);

    @Query("SELECT DISTINCT p.brand FROM ProductModel p WHERE LOWER(p.productName) LIKE LOWER(CONCAT(:name, '%'))")
    List<String> findBrandsContainsProductName(@Param("name") String name);

    @Query("SELECT DISTINCT p.brand FROM ProductModel p WHERE LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<String> findBrandsStartingWithProductName(@Param("name") String name);

    @Query("SELECT DISTINCT  p.sellerId FROM ProductModel p WHERE p.category LIKE %:name%")
    List<Integer> findSellerIdByCategory(@Param("name") String name);

    @Query("SELECT DISTINCT p FROM ProductModel p WHERE p.retailPrice BETWEEN :min AND :max AND p.category LIKE %:category%")
    List<ProductModel> findProductsByPriceRange(@Param("min") int min, @Param("max") int max, @Param("category") String category, PageRequest pageRequest);


    @Query("SELECT p FROM ProductModel p WHERE p.category LIKE %:category% AND LOWER(p.productName) LIKE LOWER(CONCAT('%', :productName, '%'))")
    List<ProductModel> findByCategoryAndName(@Param("category") String category, @Param("productName") String productName, PageRequest pageRequest);

    @Query("SELECT p FROM ProductModel p WHERE p.category LIKE %:category% AND p.brand IN :brand")
    List<ProductModel> findByCategoryAndBrand(@Param("category") String category, @Param("brand") List<String> brands, PageRequest pageRequest);

    @Query("SELECT p FROM ProductModel p WHERE p.category LIKE %:category% AND COALESCE(p.discountedPrice, p.retailPrice) BETWEEN :min AND :max")
    List<ProductModel> findByCategoryInPriceRange(@Param("category") String category, @Param("min") int min, @Param("max") int max, PageRequest pageRequest);

    @Query("SELECT p FROM ProductModel p WHERE p.category LIKE %:category% AND COALESCE(p.discountedPrice, p.retailPrice) BETWEEN :min AND :max AND LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<ProductModel> findByCategoryAndNameInPriceRange(@Param("category") String category, @Param("name") String name, @Param("min") int min, @Param("max") int max, PageRequest pageRequest);

    @Query("SELECT p FROM ProductModel p WHERE p.category LIKE %:category% AND COALESCE(p.discountedPrice, p.retailPrice) BETWEEN :min AND :max AND p.brand IN :brand")
    List<ProductModel> findByCategoryAndBrandInPriceRange(@Param("category") String category, @Param("brand") List<String> brands, @Param("min") int min, @Param("max") int max, PageRequest pageRequest);

    @Query("SELECT p FROM ProductModel p WHERE p.category LIKE %:category% AND p.brand IN :brand AND LOWER(p.productName) LIKE LOWER(CONCAT('%', :productName, '%'))")
    List<ProductModel> findByCategoryNameAndBrand(@Param("category") String category, @Param("productName") String productName, @Param("brand") List<String> brands, PageRequest pageRequest);

    @Query("SELECT DISTINCT p FROM ProductModel p WHERE p.category LIKE %:category% AND COALESCE(p.discountedPrice, p.retailPrice) BETWEEN :min AND :max AND p.brand IN :brand AND LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<ProductModel> findProductByBrandsCategoryInPriceRange(@Param("category") String category, @Param("brand") List<String> brands, @Param("name") String name, @Param("min") int min, @Param("max") int max, PageRequest pageRequest);

    @Query("SELECT DISTINCT p FROM ProductModel p WHERE COALESCE(p.discountedPrice, p.retailPrice) BETWEEN :min AND :max AND p.brand IN :brand AND LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<ProductModel> findProductByNameAndBrandInPriceRange(@Param("brand") List<String> brands, @Param("name") String name, @Param("min") int min, @Param("max") int max, PageRequest pageRequest);

    @Query("SELECT p FROM ProductModel p WHERE p.productName LIKE %:productName% AND p.brand IN :brand")
    List<ProductModel> findByNameAndBrand(@Param("productName") String productName, @Param("brand") List<String> brands, PageRequest pageRequest);

    @Query("SELECT p FROM ProductModel p WHERE COALESCE(p.discountedPrice, p.retailPrice) BETWEEN :min AND :max AND LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<ProductModel> findByNameInPriceRange(@Param("name") String name, @Param("min") int min, @Param("max") int max, PageRequest pageRequest);




    @Query("SELECT COUNT(p) FROM ProductModel p WHERE p.category LIKE %:category% AND LOWER(p.productName) LIKE LOWER(CONCAT('%', :productName, '%'))")
    Integer countByCategoryAndName(@Param("category") String category, @Param("productName") String productName);

    @Query("SELECT COUNT(p) FROM ProductModel p WHERE p.category LIKE %:category% AND p.brand IN :brand")
    Integer countByCategoryAndBrand(@Param("category") String category, @Param("brand") List<String> brands);

    @Query("SELECT COUNT(p) FROM ProductModel p WHERE p.category LIKE %:category% AND COALESCE(p.discountedPrice, p.retailPrice) BETWEEN :min AND :max")
    Integer countByCategoryInPriceRange(@Param("category") String category, @Param("min") int min, @Param("max") int max);

    @Query("SELECT COUNT(p) FROM ProductModel p WHERE p.category LIKE %:category% AND COALESCE(p.discountedPrice, p.retailPrice) BETWEEN :min AND :max AND LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))")
    Integer countByCategoryAndNameInPriceRange(@Param("category") String category, @Param("name") String name, @Param("min") int min, @Param("max") int max);

    @Query("SELECT COUNT(p) FROM ProductModel p WHERE p.category LIKE %:category% AND COALESCE(p.discountedPrice, p.retailPrice) BETWEEN :min AND :max AND p.brand IN :brand")
    Integer countByCategoryAndBrandInPriceRange(@Param("category") String category, @Param("brand") List<String> brands, @Param("min") int min, @Param("max") int max);

    @Query("SELECT COUNT(p) FROM ProductModel p WHERE p.category LIKE %:category% AND p.brand IN :brand AND LOWER(p.productName) LIKE LOWER(CONCAT('%', :productName, '%'))")
    Integer countByCategoryNameAndBrand(@Param("category") String category, @Param("productName") String productName, @Param("brand") List<String> brands);

    @Query("SELECT COUNT(p) FROM ProductModel p WHERE p.category LIKE %:category% AND COALESCE(p.discountedPrice, p.retailPrice) BETWEEN :min AND :max AND p.brand IN :brand AND LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))")
    Integer countProductByBrandsCategoryInPriceRange(@Param("category") String category, @Param("brand") List<String> brands, @Param("name") String name, @Param("min") int min, @Param("max") int max);

    @Query("SELECT DISTINCT COUNT(p) FROM ProductModel p WHERE COALESCE(p.discountedPrice, p.retailPrice) BETWEEN :min AND :max AND p.brand IN :brand AND LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))")
    Integer countProductByNameAndBrandInPriceRange(@Param("brand") List<String> brands, @Param("name") String name, @Param("min") int min, @Param("max") int max);

    @Query("SELECT COUNT(p) FROM ProductModel p WHERE p.productName LIKE %:productName% AND p.brand IN :brand")
    Integer countByNameAndBrand(@Param("productName") String productName, @Param("brand") List<String> brands);

    @Query("SELECT COUNT(p) FROM ProductModel p WHERE COALESCE(p.discountedPrice, p.retailPrice) BETWEEN :min AND :max AND LOWER(p.productName) LIKE LOWER(CONCAT('%', :name, '%'))")
    Integer countByNameInPriceRange(@Param("name") String name, @Param("min") int min, @Param("max") int max);

    @Query("SELECT COUNT(p) FROM ProductModel p WHERE p.category LIKE %:category%")
    Integer countByCategory(@Param("category") String category);

    @Query("SELECT COUNT(p) FROM ProductModel p WHERE p.productName LIKE %:productName%")
    Integer countByName(@Param("productName") String productName);
}
