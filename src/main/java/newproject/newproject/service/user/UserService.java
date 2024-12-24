package newproject.newproject.service.user;

import newproject.newproject.authentication.OauthAndPrincipalAuthController;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.PreferencesRepository;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;
import java.util.List;

import static newproject.newproject.model.UserModel.UserType.BUYER;
import static newproject.newproject.model.UserModel.UserType.SELLER;

@Service
public class UserService {
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UsersRepository usersRepository;
    @Autowired
    PreferencesRepository preferencesRepository;
    @Autowired
    OauthAndPrincipalAuthController oauthAndPrincipalAuthController;


    public String saveUser(UserModel user, Principal principal, RedirectAttributes redirectAttributes, @AuthenticationPrincipal OAuth2User authentication) {
        UserModel currentUser = oauthAndPrincipalAuthController.getCurrentUser(principal, authentication);

        if (user.getUserName() == null || user.getPhoneNumber() == null || user.getUserType() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }
        currentUser.setUserName(user.getUserName());
        currentUser.setPhoneNumber(user.getPhoneNumber());                                                                                  //saving/changing user info
        currentUser.setUserType(user.getUserType());

        usersRepository.save(currentUser);
        return "User profile information saved";
    }

    public UserModel getCurrentUserData(Principal principal, @AuthenticationPrincipal OAuth2User authentication) {
        UserModel currentUser = oauthAndPrincipalAuthController.getCurrentUser(principal, authentication);
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product data is missing or invalid.");
        }
        return (currentUser);
    }

    public UserModel getCurrentUserDataById(Integer id) {
        if (id == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User data is missing or invalid.");
        }
        UserModel currentUser = usersRepository.findById(id);
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User data is missing or invalid.");
        }
        return currentUser;
    }

    public ResponseEntity<String> deleteCurrentUser(Principal principal, @AuthenticationPrincipal OAuth2User authentication) {
        UserModel currentUser = oauthAndPrincipalAuthController.getCurrentUser(principal, authentication);
        if (currentUser == null) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User data is missing or invalid.");
        }
        usersRepository.delete(currentUser);
        return ResponseEntity.ok("User deleted");
    }


    public String getUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities() == null){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Current user has no roles.");
        }

        String response = "";
        if (authentication.getAuthorities().contains(SELLER)){
            response = "SELLER";
        } if(authentication.getAuthorities().contains(BUYER)) {
            response = "BUYER";
        }
        return response;
    }

    public Boolean isAuthenticated(@AuthenticationPrincipal UserDetails userDetails){
        return userDetails != null;
    }

}
