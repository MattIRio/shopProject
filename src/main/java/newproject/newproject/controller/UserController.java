package newproject.newproject.controller;

import newproject.newproject.model.ProductModel;
import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.PreferencesRepository;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import newproject.newproject.service.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import java.security.Principal;
import java.util.List;


@Controller
public class UserController {
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UsersRepository usersRepository;
    @Autowired
    PreferencesRepository preferencesRepository;
    @Autowired
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PutMapping("/saveuserinfo")
    public ResponseEntity<String> saveUser(@RequestBody UserModel user, Principal principal, RedirectAttributes redirectAttributes, @AuthenticationPrincipal OAuth2User authentication) {
        try {
            userService.saveUser(user, principal, redirectAttributes, authentication);
            return ResponseEntity.ok("User profile information saved");
        } catch (
                ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }


    @GetMapping("/getcurrentuserdata")
    public ResponseEntity<UserModel> getCurrentUserData(Principal principal, @AuthenticationPrincipal OAuth2User authentication) {
        try {
            UserModel currentUser = userService.getCurrentUserData(principal, authentication);
            return ResponseEntity.ok(currentUser);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @GetMapping("/getuserdatabyid/{id}")
    public ResponseEntity<UserModel> getCurrentUserDataById(@PathVariable Integer id) {
        try {
        UserModel currentUser = userService.getCurrentUserDataById(id);
        return ResponseEntity.ok(currentUser);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/deletecurrentuser")
    public ResponseEntity<String> deleteCurrentUser(Principal principal,@AuthenticationPrincipal OAuth2User authentication) {
        try {
            userService.deleteCurrentUser(principal, authentication);
            return ResponseEntity.ok("User deleted succesfully");
        }catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/getcurrentuserrole")
    public ResponseEntity<String> getUserRole() {
        try {
            String userRole = userService.getUserRole();
            return ResponseEntity.ok(userRole);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/isuserauthenticated")
    public ResponseEntity<Boolean> isAuthenticated(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(userService.isAuthenticated(userDetails));
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/currentusersproducts")
    public ResponseEntity<List<ProductModel>> getUserProducts(Principal principal, @AuthenticationPrincipal OAuth2User authentication) {
        try {
            List<ProductModel> userProducts = userService.getCurrentUserProducts(principal, authentication);
            return ResponseEntity.ok(userProducts);
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).build();
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
