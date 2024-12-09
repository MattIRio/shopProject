package newproject.newproject.controller;

import jakarta.transaction.Transactional;
import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;


@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
    public class ProductsController {
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UsersRepository usersRepository;

        @GetMapping("/getallproducts")
        public ResponseEntity<List<ProductModel>> allProducts() {
            List<ProductModel> productList = productRepository.findAll();
            return ResponseEntity.ok(productList.subList(0, 20));
        }

        @PutMapping("/")
        public ResponseEntity<String> saveProduct(@RequestBody ProductModel product){

            ProductModel productModel = new ProductModel();
            productModel.setProductName(product.getProductName());
            productModel.setBrand(product.getBrand());
            productModel.setImage(product.getImage());
            productModel.setDescription(product.getDescription());
            productModel.setRetailPrice(product.getRetailPrice());
            productModel.setDiscountedPrice(product.getDiscountedPrice());

            productRepository.save(productModel);
            return ResponseEntity.ok("Product saved");
        }

    @PutMapping("/saveuser")
    public ResponseEntity<String> saveUser(){
        UserModel user = new UserModel();
        user.setUserName("Test User");
        user.setPassword("testpassword");




        if (user.getBoughtProducts() == null) {
            user.setBoughtProducts(new ArrayList<>());
        }


        user.getBoughtProducts().add(productRepository.findByUniqId(UUID.fromString("c2d766ca982eca8304150849735ffef9")).get());

        usersRepository.save(user);
        return ResponseEntity.ok("saved");
    }

    @Transactional
    @GetMapping("/userinfo/{user_id}")
    public ResponseEntity<String> userinfo(@PathVariable int user_id){
            return ResponseEntity.ok(usersRepository.findById(user_id).getBoughtProducts().get(0).getBrand());
    }


    }
