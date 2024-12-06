package newproject.newproject.controller;

import newproject.newproject.model.UserModel;
import newproject.newproject.repositories.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;


@Controller
public class signUpController {
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;


        @GetMapping("/signUpPage")
        public String signUpPage() {

            return "signup";
        }




    @PostMapping("/signUpUser")
    public String createUser(@RequestBody UserModel userModel,
                             RedirectAttributes redirectAttributes) {
            UserModel localUser = new UserModel();
            System.out.println("started");
        if ( usersRepository.findByEmail(userModel.getEmail()) != null) {
            redirectAttributes.addFlashAttribute("EmailExist", "User with such email already exist");
            return "redirect:/register";
        } else {
            localUser.setPassword(passwordEncoder.encode(userModel.getPassword()));
            redirectAttributes.addFlashAttribute("registrationSuccess", "You are successfully registered!");
            usersRepository.save(localUser);
            return "redirect:/loginPage";
        }
    }

    }
