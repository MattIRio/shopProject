package newproject.newproject.controller.products;

import jakarta.transaction.Transactional;
import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import newproject.newproject.service.products.ProductsService;
import newproject.newproject.service.products.ProductsSorting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
import java.util.List;
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
    private final ProductsSorting productsSorting;

    public ProductsController(ProductsService productsService, ProductsSorting productsSorting) {
        this.productsService = productsService;
        this.productsSorting = productsSorting;
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
    public ResponseEntity<String> changeProductInfo(@RequestBody ProductModel product) {
        try {
            productsService.changeProductInfo(product);
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

    @GetMapping("/getsellersbycategory/{searchedCategory}")
    public ResponseEntity<List<UserModel>> findSellersByCategory(@PathVariable String searchedCategory) {
        try {
            List<UserModel> products = productsSorting.findSellersByCategory(searchedCategory);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @GetMapping("/getproductsbycategory/{searchedCategory}")
    public ResponseEntity<List<ProductModel>> findByProductNameByCategory(@PathVariable String searchedCategory) {
        try {
            List<ProductModel> products = productsSorting.findProductByCategory(searchedCategory);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @GetMapping("/getproductsbypricerange/{minPrice}/{maxPrice}")
    public ResponseEntity<List<ProductModel>> findByProductsByPriceRandge(@PathVariable Integer minPrice, @PathVariable Integer maxPrice) {
        try {
            List<ProductModel> products = productsSorting.findProductByPriceInRange(minPrice, maxPrice);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @GetMapping("/getbrandsbycategory/{searchedCategory}")
    public ResponseEntity<List<String>> findBrandsByCategory(@PathVariable String searchedCategory) {
        try {
            List<String> products = productsSorting.findBrandsByCategory(searchedCategory);
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
            List<ProductModel> products = productsSorting.findProductBySellerId(sellerid);
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
            List<ProductModel> products = productsSorting.findProductByBrand(brand);
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
