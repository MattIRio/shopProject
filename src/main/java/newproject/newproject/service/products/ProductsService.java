package newproject.newproject.service.products;

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
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.server.ResponseStatusException;
import java.security.Principal;
import java.util.List;
import java.util.UUID;

@Service
public class ProductsService {
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UsersRepository usersRepository;


    public List<ProductModel> allProducts() {
        List<ProductModel> productList = productRepository.findAll();                 //returning first 20 products
        int mimimal = Math.min(productList.size(), 20);
        return productList.subList(0, mimimal);
    }

    @Transactional
    public void saveProduct(ProductModel product, Principal principal, @AuthenticationPrincipal OAuth2User authentication) {
        UserModel currentUser = null;
        if (principal instanceof OAuth2AuthenticationToken) {
            currentUser = usersRepository.findByEmail((String) authentication.getAttributes().get("email"));
        } else if (principal instanceof UsernamePasswordAuthenticationToken) {
            currentUser = usersRepository.findByEmail(principal.getName());
        }

        if (product == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }
        if (product.getProductName() == null || product.getBrand() == null || product.getDescription() == null || product.getImage() == null || product.getRetailPrice() == null) {     //creating product
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }

        if (productRepository.findByProductName(product.getProductName()) != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product with such name already exist.");
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

    }


    public void changeProductInfo(@RequestBody ProductModel product, RedirectAttributes redirectAttributes) {
        if (product == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }

        ProductModel productModel = productRepository.findByUniqId(product.getUniqId());

        if (productModel == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product is missing or invalid.");
        }

        productModel.setProductName(product.getProductName());
        productModel.setBrand(product.getBrand());
        productModel.setImage(product.getImage());
        productModel.setDescription(product.getDescription());
        productModel.setRetailPrice(product.getRetailPrice());
        productModel.setDiscountedPrice(product.getDiscountedPrice());

        productRepository.save(productModel);
    }

    public void changeProductInfo(UUID productId, RedirectAttributes redirectAttributes) {
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
        List<ProductModel> productList = productRepository.findByProductNameStartingWithIgnoreCase(searchedProductName);

        if (productList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }
        int limit = Math.min(productList.size(), 20);
        return productList.subList(0, limit);
    }

    public List<ProductModel> findByProductNameByCategory(String searchedCategory){
        List<ProductModel> productList = productRepository.findByCategory(searchedCategory);

        if (productList.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }
        int limit = Math.min(productList.size(), 100);
        return productList.subList(0,limit);
    }
}
