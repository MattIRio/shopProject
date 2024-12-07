package newproject.newproject.repositories;


import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<ProductModel, String> {
    Optional<ProductModel> findByUniqId(String uniqId);
}
