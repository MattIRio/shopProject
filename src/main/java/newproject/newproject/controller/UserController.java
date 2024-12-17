package newproject.newproject.controller;

import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;

import static newproject.newproject.model.UserModel.UserType.BUYER;
import static newproject.newproject.model.UserModel.UserType.SELLER;

@Controller
public class UserController {
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UsersRepository usersRepository;

    @PutMapping("/saveuserinfo")
    public ResponseEntity<String> saveUser(@RequestBody UserModel user, Principal principal, RedirectAttributes redirectAttributes, @AuthenticationPrincipal OAuth2User authentication) {
        try {
            UserModel currentUser = null;
            if (principal instanceof OAuth2AuthenticationToken){
                currentUser = usersRepository.findByEmail((String) authentication.getAttributes().get("email"));
            } else if (principal instanceof UsernamePasswordAuthenticationToken){
                currentUser = usersRepository.findByEmail(principal.getName());
            }

            if (user.getUserName() == null || user.getPhoneNumber() == null || user.getUserType() == null) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("User data is missing or invalid.");
            }
            currentUser.setUserName(user.getUserName());
            currentUser.setPhoneNumber(user.getPhoneNumber());                                                                                  //saving/changing user info
            currentUser.setUserType(user.getUserType());

            usersRepository.save(currentUser);
            return ResponseEntity.ok("User profile information saved");
        } catch (Exception e) {
            System.err.println("An error occurred while saving user info: " + e.getMessage());
            redirectAttributes.addFlashAttribute("error", "An unexpected error occurred. Please try again later.");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred. Please try again later.");
        }
    }


    @GetMapping("/getcurrentuserdata")
    public ResponseEntity<UserModel> getCurrentUserData(Principal principal, @AuthenticationPrincipal OAuth2User authentication) {
        UserModel currentUser = null;
        if (principal instanceof OAuth2AuthenticationToken){
            currentUser = usersRepository.findByEmail((String) authentication.getAttributes().get("email"));
        } else if (principal instanceof UsernamePasswordAuthenticationToken){
            currentUser = usersRepository.findByEmail(principal.getName());                                                                          //returning current logged user model logged by Form-Based Authentication and oauth2
        }
        return ResponseEntity.ok(currentUser);
    }


    @GetMapping("/getuserdatabyid/{id}")
    public ResponseEntity<UserModel> getCurrentUserDataById(@PathVariable Integer id) {
        if (id == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)                                                                                                  //returning user model by id
                    .build();
        }
        UserModel currentUser = usersRepository.findById(id);
        if (currentUser == null) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .build();
        }
        return ResponseEntity.ok(currentUser);
    }

    @DeleteMapping("/deletecurrentuser")
    public ResponseEntity<String> deleteCurrentUser(Principal principal,@AuthenticationPrincipal OAuth2User authentication) {
        try {
            UserModel currentUser = null;
            if (principal instanceof OAuth2AuthenticationToken){
                currentUser = usersRepository.findByEmail((String) authentication.getAttributes().get("email"));
            } else if (principal instanceof UsernamePasswordAuthenticationToken){
                currentUser = usersRepository.findByEmail(principal.getName());
            }
            usersRepository.delete(currentUser);
            return ResponseEntity.ok("User deleted");
        } catch (Exception e) {
            System.err.println("An error occurred while deleting user: " + e.getMessage());                                        //deleting current logged user model logged by Form-Based Authentication and oauth2
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred. Please try again later.");
        }
    }

    @GetMapping("/getcurrentuserrole")
    public ResponseEntity<String> getUserRole() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication.getAuthorities() == null){
            return ResponseEntity.badRequest().body("Current user has no roles");
        }

        String response = "";
        if (authentication.getAuthorities().contains(SELLER)){
            response = "SELLER";
        } if(authentication.getAuthorities().contains(BUYER)) {
            response = "BUYER";
        }
        return ResponseEntity.ok(response);
    }
}
