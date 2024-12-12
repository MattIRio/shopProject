package newproject.newproject.controller;

import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.ProductRepository;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.security.Principal;

@Controller
public class UserController {
    @Autowired
    ProductRepository productRepository;
    @Autowired
    UsersRepository usersRepository;

    @PutMapping("/saveuserinfo")
    public ResponseEntity<String> saveUser(@RequestBody UserModel user, Principal principal, RedirectAttributes redirectAttributes) {
        try {
            UserModel currentUser = usersRepository.findByEmail(principal.getName());

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
            System.err.println("An error occurred while creating a product: " + e.getMessage());
            redirectAttributes.addFlashAttribute("error", "An unexpected error occurred. Please try again later.");
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred. Please try again later.");
        }
    }


    @GetMapping("/getcurrentuserdata")
    public UserModel getCurrentUserData(Principal principal) {
        UserModel currentUser = usersRepository.findByEmail(principal.getName());                                     //returning current logged user model
        return currentUser;
    }

    @GetMapping("/getuserdatabyid/{id}")
    public ResponseEntity<UserModel> getCurrentUserDataById(@PathVariable Integer id) {
        if (id == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)                                                                  //returning user model by id
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
    public ResponseEntity<String> deleteCurrentUser(Principal principal) {
        try {
            UserModel localUser = usersRepository.findByEmail(principal.getName());
            usersRepository.delete(localUser);
            return ResponseEntity.ok("User deleted");
        } catch (Exception e) {
            System.err.println("An error occurred while creating a product: " + e.getMessage());
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred. Please try again later.");
        }
    }
}
