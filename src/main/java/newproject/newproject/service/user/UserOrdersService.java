package newproject.newproject.service.user;

import newproject.newproject.authentication.OauthAndPrincipalAuthController;
import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.model.UserOrderedProduct;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UserOrderedProductRepository;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.parameters.P;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class UserOrdersService {

    @Autowired
    UsersRepository usersRepository;
    @Autowired
    OauthAndPrincipalAuthController oauthAndPrincipalAuthController;
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UserOrderedProductRepository userOrderedProductRepository;

    public List<ProductModel> userOrders(Principal principal, @AuthenticationPrincipal OAuth2User authentication){
        UserModel currentUser = oauthAndPrincipalAuthController.getCurrentUser(principal, authentication);
        List<ProductModel> userOrders = new ArrayList<>();
        for (UserOrderedProduct orderedProduct : currentUser.getOrderedProducts().stream().toList()){
            userOrders.add(orderedProduct.getProduct());
        }
        return userOrders;
    }

    public void addOrderToCurrentUser(UUID productId, int quantity, Principal principal, @AuthenticationPrincipal OAuth2User authentication){
        UserModel currentUser = oauthAndPrincipalAuthController.getCurrentUser(principal, authentication);
        ProductModel currentProduct = productRepository.findByUniqId(productId);
        UserOrderedProduct existingOrder = userOrderedProductRepository.findByUserAndProduct(currentUser, currentProduct);

        if (existingOrder != null) {
            existingOrder.setQuantity(existingOrder.getQuantity() + quantity);
        } else {
            UserOrderedProduct newOrder = new UserOrderedProduct();
            newOrder.setUser(currentUser);
            newOrder.setProduct(currentProduct);
            newOrder.setQuantity(quantity);
            currentUser.getOrderedProducts().add(newOrder);
        }
    }

}
