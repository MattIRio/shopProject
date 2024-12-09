package newproject.newproject.controller;

import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Controller
public class SignUpController {
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

        @GetMapping("/signUpPage")
        public String signUpPage() {                            //url to sign up page
            return "signup";
        }

    @PostMapping("/signUpUser")
    public String createUser(@RequestBody UserModel userModel,
                             RedirectAttributes redirectAttributes) {
        try {
            if (userModel == null || userModel.getEmail() == null || userModel.getPassword() == null) {
                redirectAttributes.addFlashAttribute("error", "Invalid user data provided");
                return "redirect:/signUpPage";
            }

            UserModel existingUser = usersRepository.findByEmail(userModel.getEmail());
            if (existingUser != null) {
                redirectAttributes.addFlashAttribute("EmailExist", "User with such email already exists");
                return "redirect:/signUpPage";

            } else {
                UserModel localUser = new UserModel();
                localUser.setPassword(passwordEncoder.encode(userModel.getPassword()));
                localUser.setEmail(userModel.getEmail());
                redirectAttributes.addFlashAttribute("registrationSuccess", "You are successfully registered!");
                usersRepository.save(localUser);
                return "redirect:/loginPage";
            }
        } catch (Exception e) {
            System.err.println("An error occurred while creating a user: " + e.getMessage());
            redirectAttributes.addFlashAttribute("error", "An unexpected error occurred. Please try again later.");
            return "redirect:/signUpPage";
        }
    }

    }
