package newproject.newproject;

import jakarta.transaction.Transactional;
import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import org.apache.catalina.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;



@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
    public class ObjectsArray {
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UsersRepository usersRepository;

        @GetMapping("/getallproducts")
        public ResponseEntity<List<ProductModel>> allProducts() {


            List<ProductModel> productList = productRepository.findAll();

            return ResponseEntity.ok(productList.subList(0, 20));
        }

        @PutMapping("/saveproduct")
    public ResponseEntity<String> saveProduct(){
            productRepository.save(new ProductModel("awdaw12", "Alisha Solid Women's Cycling Shorts", 999, 379, "url_to_image", "Описание продукта", "awdaw"));

            return ResponseEntity.ok("saved");
        }

    @PutMapping("/saveuser")
    public ResponseEntity<String> saveUser(){
        UserModel user = new UserModel();
        user.setUserName("Test User");
        user.setPassword("testpassword");




        if (user.getBoughtProducts() == null) {
            user.setBoughtProducts(new ArrayList<>());
        }


        user.getBoughtProducts().add(productRepository.findByUniqId("c2d766ca982eca8304150849735ffef9").get());

        usersRepository.save(user);
        return ResponseEntity.ok("saved");
    }

    @Transactional
    @GetMapping("/userinfo/{user_id}")
    public ResponseEntity<String> userinfo(@PathVariable int user_id){
            UserModel user = usersRepository.findById(user_id).get();
        System.out.println(user.getBoughtProducts().get(0).getBrand());
            return ResponseEntity.ok(user.getBoughtProducts().get(0).getBrand());
    }


    }
