package newproject.newproject.controller;

import jakarta.transaction.Transactional;
import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

import static java.util.Optional.empty;
import static javax.swing.UIManager.get;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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


    @Test
    void getAllProducts_success() {
        List <ProductModel> products = new ArrayList<>();
        ProductModel product1 = new ProductModel();
        ProductModel product2 = new ProductModel();
        product1.setProductName("product 1 name");
        product2.setProductName("product 2 name");
        products.add(product1);
        products.add(product2);

        Mockito.when(productRepository.findAll()).thenReturn(products);
        assertEquals(products, productsController.allProducts().getBody());
    }



    @Test
    void saveProduct_success() {

        ProductModel product = new ProductModel();
        product.setProductName("Test Product");
        product.setBrand("Test Brand");
        product.setDescription("Description");
        product.setImage("image.png");
        product.setRetailPrice(8);

        UserModel mockUser = new UserModel();
        mockUser.setId(1);
        mockUser.setEmail("test@example.com");

        when(principal.getName()).thenReturn("test@example.com");
        when(usersRepository.findByEmail("test@example.com")).thenReturn(mockUser);

        // Act
        ResponseEntity<String> response = productsController.saveProduct(product, principal, redirectAttributes);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Product saved", response.getBody());
    }
}
