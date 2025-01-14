package newproject.newproject.controller;

import jakarta.transaction.Transactional;
import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import newproject.newproject.service.products.ProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;


@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/api/products")
    public class ProductsController {
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UsersRepository usersRepository;

    private final ProductsService productsService;

    public ProductsController(ProductsService productsService) {
        this.productsService = productsService;
    }

    @GetMapping("/getallproducts")
    public ResponseEntity<List<ProductModel>> allProducts() {
        List<ProductModel> products = productsService.allProducts();
        return ResponseEntity.ok(products);
    }

    @Transactional
    @PostMapping("/saveproduct")
    public ResponseEntity<UUID> saveProduct(@RequestBody ProductModel product, Principal principal, RedirectAttributes redirectAttributes, @AuthenticationPrincipal OAuth2User authentication) {
        try {
            UUID createdProductId = productsService.saveProduct(product, principal, authentication);
            return ResponseEntity.ok(createdProductId);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @PutMapping("/changeproductinfo")
    public ResponseEntity<String> changeProductInfo(@RequestBody ProductModel product, RedirectAttributes redirectAttributes) {
        try {
            productsService.changeProductInfo(product, redirectAttributes);
            return ResponseEntity.ok("Product changed");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

//    @DeleteMapping("/deleteproduct/{productId}")
//    public ResponseEntity<String> changeProductInfo(@PathVariable UUID productId, RedirectAttributes redirectAttributes) {
//        try {
//            productsService.deleteProduct(productId, redirectAttributes);
//            return ResponseEntity.ok("Product deleted");
//        } catch (ResponseStatusException e) {
//            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
//        } catch (Exception e) {
//            System.out.println("Unexpected error: " + e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
//        }
//    }

    @GetMapping("/getproductsbyname/{searchedProductName}")
    public ResponseEntity<List<ProductModel>> getProductsByName(@PathVariable String searchedProductName){
        try {
            List<ProductModel> products = productsService.getProductsByName(searchedProductName);
        return ResponseEntity.ok(products);
        } catch (Exception e) {
        System.out.println("Unexpected error: " + e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .build();
        }
    }

    @GetMapping("/getproductbyid/{productId}")
    public ResponseEntity<ProductModel> getProductById(@PathVariable UUID productId){
        try {
            ProductModel product = productsService.getProductById(productId);
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @GetMapping("/getproductsbycategory/{searchedCategory}")
    public ResponseEntity<List<ProductModel>> findByProductNameByCategory(@PathVariable String searchedCategory) {
        try {
            List<ProductModel> products = productsService.findProductByCategory(searchedCategory);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @GetMapping("/getproductsbysellerid/{sellerid}")
    public ResponseEntity<List<ProductModel>> findByProductsBySellerId(@PathVariable int sellerid) {
        try {
            List<ProductModel> products = productsService.findProductBySellerId(sellerid);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @GetMapping("/getproductsbybrand/{brand}")
    public ResponseEntity<?> findByProductsByBrand(@PathVariable String brand) {
        try {
            List<ProductModel> products = productsService.findProductByBrand(brand);
            return ResponseEntity.ok(products);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred.");
        }
    }


}
