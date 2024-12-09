package newproject.newproject.controller;

import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
@Controller
public class SellerController {
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UsersRepository usersRepository;


    @PostMapping("/saveproduct")
    public ResponseEntity<String> saveProduct(@RequestBody ProductModel product, Principal principal, RedirectAttributes redirectAttributes) {
        try {

            if (product == null){
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Product data is missing or invalid.");
            }
            if (product.getProductName() == null || product.getBrand() == null || product.getDescription() == null || product.getImage() == null || product.getRetailPrice() == null){
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Product data is missing or invalid.");
            }
            if (productRepository.findByProductName(product.getProductName()).isPresent()){
                System.out.println("awdawdd" + productRepository.findByProductName(product.getProductName()));
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Product with such name already exist.");
            }

            UserModel currentUser = usersRepository.findByEmail(principal.getName());

            ProductModel productModel = new ProductModel();
            productModel.setProductName(product.getProductName());
            productModel.setBrand(product.getBrand());
            productModel.setImage(product.getImage());
            productModel.setDescription(product.getDescription());
            productModel.setRetailPrice(product.getRetailPrice());
            productModel.setDiscountedPrice(product.getDiscountedPrice());
            productModel.setSellerId(currentUser.getId());

            productRepository.save(productModel);

        } catch (Exception e) {
            System.err.println("An error occurred while creating a product: " + e.getMessage());
            redirectAttributes.addFlashAttribute("error", "An unexpected error occurred. Please try again later.");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred. Please try again later.");
        }
        return ResponseEntity.ok("Product saved");
    }
}
