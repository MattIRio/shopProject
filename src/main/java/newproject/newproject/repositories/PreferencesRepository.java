package newproject.newproject.repositories;

import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UsersPreferencesModel;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface PreferencesRepository extends JpaRepository<UsersPreferencesModel, String>{
    UsersPreferencesModel findByPreferredCategoryAndUserId(String productName, int user_Id);
    List<UsersPreferencesModel> findAllByUserId(int user_id);

    @Query(value = "SELECT i FROM UsersPreferencesModel i " + "WHERE i.userId = :userId " + "ORDER BY i.viewCount ASC, i.viewDate ASC")
    List<UsersPreferencesModel> findTopByUserIdOrderByViewCountAscViewDateAsc(@Param("userId") int userId);

    @Query(value = "SELECT u FROM UsersPreferencesModel u WHERE u.userId = :userId ORDER BY u.viewCount DESC")
    List<UsersPreferencesModel> findTopByUserIdOrderByViewCount(@Param("userId") int userId);

    @Query(value = "SELECT p FROM ProductModel p WHERE p.category LIKE %:category% ORDER BY RANDOM() LIMIT 15")
    List<ProductModel> findTopBy1stCategory(@Param("category") String category);

    @Query(value = "SELECT p FROM ProductModel p WHERE p.category LIKE %:category% ORDER BY RANDOM() LIMIT 10")
    List<ProductModel> findTopBy2ndCategory(@Param("category") String category);

    @Query(value = "SELECT p FROM ProductModel p WHERE p.category LIKE %:category% ORDER BY RANDOM() LIMIT 6")
    List<ProductModel> findTopBy3rdCategory(@Param("category") String category);

    @Query(value = "SELECT p FROM ProductModel p WHERE p.category LIKE %:category% ORDER BY RANDOM() LIMIT 2")
    List<ProductModel> findTopBy4thCategory(@Param("category") String category);

    @Query(value = "SELECT p FROM ProductModel p WHERE p.category LIKE %:category% ORDER BY RANDOM() LIMIT 2")
    List<ProductModel> findTopBy5thCategory(@Param("category") String category);


    @Query(value = "SELECT p FROM ProductModel p WHERE p.category LIKE %:category%")
    Page<ProductModel> findTopBy1stCategoryBestOffers(@Param("category") String category, Pageable pageable);

    @Query(value = "SELECT p FROM ProductModel p WHERE p.category LIKE %:category%")
    Page<ProductModel> findTopBy2ndCategoryBestOffers(@Param("category") String category, Pageable pageable);

    @Query(value = "SELECT p FROM ProductModel p WHERE p.category LIKE %:category%")
    Page<ProductModel> findTopBy3rdCategoryBestOffers(@Param("category") String category, Pageable pageable);

    @Query(value = "SELECT p FROM ProductModel p WHERE p.category LIKE %:category%")
    Page<ProductModel> findTopBy4thCategoryBestOffers(@Param("category") String category, Pageable pageable);

    @Query(value = "SELECT p FROM ProductModel p WHERE p.category LIKE %:category%")
    Page<ProductModel> findTopBy5thCategoryBestOffers(@Param("category") String category, Pageable pageable);

}
