package newproject.newproject.service.products;

import jakarta.transaction.Transactional;
import newproject.newproject.authentication.OauthAndPrincipalAuthController;
import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.model.UserOrderedProduct;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import newproject.newproject.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.server.ResponseStatusException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProductsService {
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UsersRepository usersRepository;
    @Autowired
    OauthAndPrincipalAuthController oauthAndPrincipalAuthController;
    @Autowired
    UserService userService;

    public List<ProductModel> allProducts() {
        List<ProductModel> productList = productRepository.getAllProductsInRandomOrder();                 //returning first 20 products
        return productList;
    }

    @Transactional
    public UUID saveProduct(ProductModel product, Principal principal, @AuthenticationPrincipal OAuth2User authentication) {
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }
        if (product.getProductName() == null || product.getBrand() == null || product.getDescription() == null || product.getRetailPrice() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }

        UserModel currentUser = null;
        if (principal instanceof OAuth2AuthenticationToken) {
            currentUser = usersRepository.findByEmail((String) authentication.getAttributes().get("email"));
        } else if (principal instanceof UsernamePasswordAuthenticationToken) {
            currentUser = usersRepository.findByEmail(principal.getName());
        }
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authorized.");
        }


        if (productRepository.findByProductName(product.getProductName()) != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with such name already exists.");
        }

        ProductModel productModel = new ProductModel();
        productModel.setProductName(product.getProductName());
        productModel.setBrand(product.getBrand());
        productModel.setCategory(product.getCategory());
        productModel.setDescription(product.getDescription());
        productModel.setRetailPrice(product.getRetailPrice());
        productModel.setDiscountedPrice(product.getDiscountedPrice());
        productModel.setQuantity(product.getQuantity());
        productModel.setSellerId(currentUser.getId());

        currentUser.getPublishedProducts().add(productModel);


        productRepository.save(productModel);
        usersRepository.save(currentUser);
        return productRepository.findByProductName(product.getProductName()).getUniqId();

    }


    public void changeProductInfo(@RequestBody ProductModel product) {
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }

        ProductModel productModel = productRepository.findByUniqId(product.getUniqId());

        if (productModel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product is missing or invalid.");
        }

        productModel.setProductName(product.getProductName());
        productModel.setCategory(product.getCategory());
        productModel.setQuantity(product.getQuantity());
        productModel.setBrand(product.getBrand());
        productModel.setImage(product.getImage());
        productModel.setDescription(product.getDescription());
        productModel.setRetailPrice(product.getRetailPrice());
        productModel.setDiscountedPrice(product.getDiscountedPrice());

        productRepository.save(productModel);
    }

    public void deleteProduct(UUID productId, RedirectAttributes redirectAttributes) {
        ProductModel localProduct = productRepository.findByUniqId(productId);

        if (productId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }
        if (localProduct == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }
        productRepository.delete(localProduct);
    }

    public List<ProductModel> getProductsByName(String searchedProductName) {
        List<ProductModel> productsStartsWith = productRepository.findByProductNameStartsWith(searchedProductName);
        List<ProductModel> productsContains = productRepository.findByProductNameContains(searchedProductName);
        productsContains.removeAll(productsStartsWith);
        productsStartsWith.addAll(productsContains);


        if (productsStartsWith.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }
        int limit = Math.min(productsStartsWith.size(), 20);
        return productsStartsWith.subList(0, limit);
    }

    public ProductModel getProductById(UUID id) {
        ProductModel product = productRepository.findByUniqId(id);

        if (product == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }

        return product;
    }

    public void deleteOrderFromCurrentSeller(UUID productId, Principal principal, @AuthenticationPrincipal OAuth2User authentication) {
        UserModel currentUser = oauthAndPrincipalAuthController.getCurrentUser(principal, authentication);
        if (userService.getUserRole() != "SELLER"){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Current user is not a seller");
        }

        ProductModel currentProduct = productRepository.findByUniqId(productId);
        if (currentUser.getPublishedProducts().contains(currentProduct) == false){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Current user have no such product");
        }
        currentUser.getPublishedProducts().remove(currentProduct);
        productRepository.delete(currentProduct);
        usersRepository.save(currentUser);
    }

}
