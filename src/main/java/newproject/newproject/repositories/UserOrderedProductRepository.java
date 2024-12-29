package newproject.newproject.repositories;

import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.model.UserOrderedProduct;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserOrderedProductRepository extends JpaRepository<UserOrderedProduct, String> {
    UserOrderedProduct findByUserAndProduct(UserModel user, ProductModel product);
}
