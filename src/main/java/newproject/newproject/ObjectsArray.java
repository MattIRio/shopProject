package newproject.newproject;

import newproject.newproject.model.ProductModel;
import newproject.newproject.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
    public class ObjectsArray {
    @Autowired
    ProductRepository productRepository;

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
    }
