package newproject.newproject.repositories;

import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UsersRepository extends JpaRepository<UserModel, String> {
    UserModel findById(Integer id);
    UserModel findByEmail(String email);


}
