package newproject.newproject.controller;

import jakarta.transaction.Transactional;
import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
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
        List<ProductModel> productList = productRepository.findAll();                 //returning first 20 products
        int mimimal = Math.min(productList.size(), 20);
        return ResponseEntity.ok(productList.subList(0, mimimal));
    }

    @PostMapping("/saveproduct")
    public ResponseEntity<String> saveProduct(@RequestBody ProductModel product, Principal principal, RedirectAttributes redirectAttributes, @AuthenticationPrincipal OAuth2User authentication) {
        try {
            UserModel currentUser = null;
            if (principal instanceof OAuth2AuthenticationToken){
                currentUser = usersRepository.findByEmail((String) authentication.getAttributes().get("email"));
            } else if (principal instanceof UsernamePasswordAuthenticationToken){
                currentUser = usersRepository.findByEmail(principal.getName());
            }

            if (product == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Product data is missing or invalid.");
            }
            if (product.getProductName() == null || product.getBrand() == null || product.getDescription() == null || product.getImage() == null || product.getRetailPrice() == null) {   //creating product
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Product data is missing or invalid.");
            }
            if (productRepository.findByProductName(product.getProductName()) != null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Product with such name already exist.");
            }



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

    @PutMapping("/changeproductinfo")
    public ResponseEntity<String> changeProductInfo(@RequestBody ProductModel product, RedirectAttributes redirectAttributes) {
        try {

            if (product == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Product data is missing or invalid.");
            }

            ProductModel productModel = productRepository.findByUniqId(product.getUniqId());

            if (productModel == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Product is missing or invalid.");
            }

            productModel.setProductName(product.getProductName());
            productModel.setBrand(product.getBrand());
            productModel.setImage(product.getImage());
            productModel.setDescription(product.getDescription());
            productModel.setRetailPrice(product.getRetailPrice());
            productModel.setDiscountedPrice(product.getDiscountedPrice());

            productRepository.save(productModel);
            return ResponseEntity.ok("Product info changed");

        } catch (Exception e) {
            System.err.println("An error occurred while changing the product info: " + e.getMessage());
            redirectAttributes.addFlashAttribute("error", "An unexpected error occurred. Please try again later.");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred. Please try again later.");
        }
    }

    @PutMapping("/deleteproduct")
    public ResponseEntity<String> changeProductInfo(@PathVariable UUID productId, RedirectAttributes redirectAttributes) {
        ProductModel localProduct = productRepository.findByUniqId(productId);

        try {

            if (productId == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Product data is missing or invalid.");
            }
            if (localProduct == null) {
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body("Product is missing or invalid.");
            }
            productRepository.delete(localProduct);
            return ResponseEntity.ok("Product deleted");
        }catch (Exception e){
            System.err.println("An error occurred while deleting a product: " + e.getMessage());
            redirectAttributes.addFlashAttribute("error", "An unexpected error occurred. Please try again later.");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred. Please try again later.");
        }
    }

    @GetMapping("/getproductsbyname/{searchedProductName}")
    public ResponseEntity<List<ProductModel>> getProductsByName(@PathVariable String searchedProductName){
        List<ProductModel> productList = productRepository.findByProductNameStartingWithIgnoreCase(searchedProductName);

        if (productList.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
        int limit = Math.min(productList.size(), 20);
        return ResponseEntity.ok(productList.subList(0,limit));
    }

    @GetMapping("/getproductsbycategory/{searchedCategory}")
    public ResponseEntity<List<ProductModel>> findByProductNameByCategory(@PathVariable String searchedCategory){
        List<ProductModel> productList = productRepository.findByCategory(searchedCategory);

        if (productList.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
        int limit = Math.min(productList.size(), 20);
        return ResponseEntity.ok(productList.subList(0,limit));
    }



}
