package newproject.newproject.controller;

import jakarta.transaction.Transactional;
import newproject.newproject.controller.products.ProductsController;
import newproject.newproject.controller.user.UserController;
import newproject.newproject.model.ProductModel;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import static javax.swing.UIManager.get;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;

@SpringBootTest
@Transactional
@ExtendWith(MockitoExtension.class)
class ProductsControllerTest {
    @Mock
    UsersRepository usersRepository;
    @InjectMocks
    ProductsController productsController;
    @Mock
    ProductRepository productRepository;
    @InjectMocks
    UserController userController;
    @Mock
    Principal principal;
    @Mock
    private RedirectAttributes redirectAttributes;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

//    @Test
//    void getAllProducts_success() {
//        List <ProductModel> products = new ArrayList<>();
//        ProductModel product1 = new ProductModel();
//        ProductModel product2 = new ProductModel();
//        product1.setProductName("product 1 name");
//        product2.setProductName("product 2 name");
//        products.add(product1);
//        products.add(product2);
//
//        Mockito.when(productRepository.findAll()).thenReturn(products);
//        assertEquals(products, productsController.allProducts().getBody());
//    }



    // @Test
    // void saveProduct_success() {
    //     OAuth2User authentication = mock(OAuth2User.class);

    //     ProductModel product = new ProductModel();
    //     product.setProductName("Test Product");
    //     product.setBrand("Test Brand");
    //     product.setDescription("Description");
    //     product.setImage("image.png");
    //     product.setRetailPrice(8);

    //     UserModel mockUser = new UserModel();
    //     mockUser.setId(1);
    //     mockUser.setEmail("test@example.com");

    //     when(principal.getName()).thenReturn("test@example.com");
    //     when(usersRepository.findByEmail("test@example.com")).thenReturn(mockUser);

    //     // Act
    //     // ResponseEntity<UUID> response = productsController.saveProduct(product, principal, redirectAttributes, authentication);


    //     assertEquals(HttpStatus.OK, response.getStatusCode());
    //     assertEquals("Product saved", response.getBody());
    // }

    @Test
    void changeProductInfo_success() {
        ProductModel product = new ProductModel();
        product.setProductName("Test Product");
        product.setBrand("Test Brand");
        product.setDescription("Description");
        product.setImage("image.png");
        product.setRetailPrice(8);



        ProductModel existingProduct = new ProductModel();
        existingProduct.setProductName("Test Product");
        existingProduct.setBrand("Test Brand");
        existingProduct.setDescription("Description");
        existingProduct.setImage("image.png");
        existingProduct.setRetailPrice(8);


        when((productRepository.findByUniqId(product.getUniqId()))).thenReturn(product);


        ResponseEntity<String> response = productsController.changeProductInfo(existingProduct);


        assertEquals("Product info changed", response.getBody());
    }
}
