package newproject.newproject.controller.products;

import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import newproject.newproject.service.products.ProductsService;
import newproject.newproject.service.products.ProductsSorting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.awt.*;
import java.awt.print.Pageable;
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
    public ResponseEntity<List<ProductModel>> allProducts(@RequestParam(required = false, defaultValue = "0") int page, @RequestParam(required = false, defaultValue = "20") int size) {
        List<ProductModel> products = productsService.allProducts(PageRequest.of(page, size));
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

    @GetMapping("/searchproductsbyname/{searchedProductName}")
    public ResponseEntity<List<ProductModel>> searchProductsByName(@PathVariable String searchedProductName) {
        try {
            List<ProductModel> products = productsService.searchProductsByName(searchedProductName);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @GetMapping("/getproductsbyname/{searchedProductName}")
    public ResponseEntity<List<ProductModel>> getProductsByName(@PathVariable String searchedProductName,
                                                                @RequestParam(required = false, defaultValue = "0") int page,
                                                                @RequestParam(required = false, defaultValue = "20") int size) {
        try {
            List<ProductModel> products = productsService.getProductsByName(searchedProductName, PageRequest.of(page, size));
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @GetMapping("/getproductbrandsbycategory/{category}/{brandName}")
    public ResponseEntity<List<String>> getProductBrandsByCategory(@PathVariable String category, @PathVariable String brandName) {
        try {
            List<String> products = productsService.getBrandsByCategoryAndName(category, brandName);
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

    @GetMapping("/getproductsbypricerangeandcategory/{minPrice}/{maxPrice}/{category}")
    public ResponseEntity<List<ProductModel>> findByProductsByPriceRandgeAndCategory(@PathVariable Integer minPrice,
                                                                          @PathVariable Integer maxPrice,
                                                                          @PathVariable String category,
                                                                          @RequestParam(required = false, defaultValue = "0") int page,
                                                                          @RequestParam(required = false, defaultValue = "20") int size ) {
        try {
            List<ProductModel> products = productsSorting.findByProductsByPriceRandgeAndCategory(minPrice, maxPrice, category, PageRequest.of(page, size));
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

//    @GetMapping("/getproductsbybrand")
//    public ResponseEntity<?> findByProductsByBrands(@RequestParam List<String> brand) {
//        try {
//            List<ProductModel> products = productsSorting.findProductByBrands(brand);
//            return ResponseEntity.ok(products);
//        } catch (ResponseStatusException e) {
//            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
//        } catch (Exception e) {
//            System.out.println("Unexpected error: " + e);
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("An unexpected error occurred.");
//        }
//    }



    @GetMapping("/getbrandsbycategory/{searchedCategory}")
    public ResponseEntity<List<String>> findBrandsByCategory(@PathVariable String searchedCategory, HttpSession session) {
        try {
            List<String> brands = productsSorting.findBrandsByCategory(searchedCategory);
            return ResponseEntity.ok(brands);
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }

    @GetMapping("/findProductByBrandsCategoryInPriceRange")
    public ResponseEntity<List<ProductModel>> findProductByBrandsCategoryInPriceRange(@RequestParam(required = false, defaultValue = "") String category,
                                                                       @RequestParam(required = false, defaultValue = "") List<String> brand,
                                                                       @RequestParam(required = false, defaultValue = "") Integer minPrice,
                                                                       @RequestParam(required = false, defaultValue = "") Integer maxPrice,
                                                                       @RequestParam(required = false, defaultValue = "") String productName,
                                                                       @RequestParam(required = false, defaultValue = "0") int page,
                                                                       @RequestParam(required = false, defaultValue = "20") int size) {
        try {
            List<ProductModel> products = productsSorting.findProductByBrandsCategoryInPriceRange(category, brand, minPrice, maxPrice, productName, PageRequest.of(page, size));
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build();
        }
    }




}
