package newproject.newproject.repositories;


import newproject.newproject.model.ProductModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<ProductModel, String> {

}
